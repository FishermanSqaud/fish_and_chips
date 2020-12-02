const rootCas = require('ssl-root-cas').create()
const https = require('https')
const http = require('http')
// const openssl = require('openssl-nodejs')
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const openssl = require('./openssl')
const { Certificate } = require('@fidm/x509')
const { URL } = require('url')
const forge = require('node-forge')
const pki = forge.pki


process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const makeRootCaList = () => {

    return rootCas.map((ca) => Certificate.fromPEM(ca))
}

exports.rootCaList = makeRootCaList()

exports.makeRequestOption = async (uri) => {

    const url = new URL(uri)

    return {
        hostname: url.hostname,
        port: 443,
        path: url.pathname,
        method: 'GET'
    }
}

exports.getCertificateBuf = async (res) => {
    return res.socket.getPeerCertificate(true).raw.toString('base64')
}

exports.makeCertificate = async (raw) => {

    try {
        const derKey = forge.util.decode64(raw)
        const asnObj = forge.asn1.fromDer(derKey)
        const asn1Cert = pki.certificateFromAsn1(asnObj)
        const pemCert = pki.certificateToPem(asn1Cert)

        return pki.certificateFromPem(pemCert)

    } catch (err) {
        console.log("err in convert - ", err)
    }
}

// Recursive Function To Reach The Root CA Certificate
//
exports.getRootCaCertFrom = async (cert) => {

    try {

        const subject = cert.subject.getField('CN')
        var issuer = cert.issuer.getField('CN')
        if (issuer == null){
            issuer = cert.issuer.getField('OU')
        }

        if (subject == null || issuer == null){
            return null
        }

        const subjectCname = subject.value.split(' ')[0]
        const issuerCname= issuer.value.split(' ')[0]

        if (subjectCname == issuerCname) {
            console.log(`루트 CA 인증서 가져오기 성공`)
            return cert
        }

        const accessVal = cert.getExtension(AUTHORITY_INFO_ACCESS).value

        // console.log("ACCESS VALUE : ", accessVal)

        var targetUrl = await refineUnicode(accessVal)

        // console.log("Target URL : ", targetUrl)

        const protocolStart = targetUrl.indexOf("http")

        if (protocolStart != 0) {

            targetUrl = targetUrl.substring(
                protocolStart, 
                targetUrl.length
            )
            
        }

        console.log("다운받을 targetUrl - ", targetUrl)

        if (targetUrl.includes('ocsp')) {
            return cert
        }

        const certName = await downloadCertificate(
            targetUrl
        )

        const pemCert = await crtToPem(certName)

        console.log(`상위 CA 인증서 가져오기 성공 - ${targetUrl}`)

        // No Callback for deleting file
        fs.unlink(certName, (err)=> {})

        if (pemCert == null) {
            return null
        }

        // console.log("변환 완료!", pemCert)

        const pemCertBuf = fs.readFileSync(pemCert)

        fs.unlink(pemCert, (err)=> {})

        return await exports.getRootCaCertFrom(
            pki.certificateFromPem(pemCertBuf)
        )

    } catch (e) {
        console.log('e - ', e)
        return null
    }
}

exports.verify = async (cert) => {

    try {

        const cNamePrefix = cert.subject.getField('CN').value.split(' ')[0]
        const rootCa = exports.rootCaList.find((rootCa) => {

            const cName = rootCa.subject.attributes.find(attr => {
                return attr.shortName == 'CN'
            })

            if (cName) {

                // 일단 prefix로 일치 시킴
                const prefix = cName.value.split(' ')[0]

                return prefix == cNamePrefix

            } else {
                return false
            }
        })

        if (rootCa == undefined) {
            return false
        }

        return true


    } catch (e) {
        console.log("verify () : ", e)
        return false
    }
}


// ***** HELPER FUNCTIONS ***************

// Supporting Certificate Types
const PKCS7 = "pkcs7"
const X509 = "X.509"

// Field to get the superioir CA's certificate
const AUTHORITY_INFO_ACCESS = "authorityInfoAccess"


const allCertTypes = [
    X509,
    PKCS7
]

const TEMPORARY_CERT_PATH = ''

const downloadCertificate = (uri) => new Promise((res, rej) => {

    var words = uri.split('/')
    const certName = TEMPORARY_CERT_PATH + uuidv4() + words[words.length - 1]

    const file = fs.createWriteStream(certName);

    http.get(uri, (response) => {
        response.pipe(file).on("close", () => {
            // console.log("파일 다운로드 완료 - "+uri)
            res(certName)
        })
    })
})


const getOpenSslConvertCommand = async (crtName, fileName, certType) => {

    switch (certType) {
        case PKCS7:
            return [
                `openssl`,
                `pkcs7`,
                `-print_certs`,
                `-inform`,
                `DER`,
                `-in`,
                crtName,
                `-out`,
                fileName
            ]

        case X509:
            return [
                `x509`,
                `-inform`,
                `DER`,
                `-outform`,
                `PEM`,
                `-in`,
                crtName,
                `-out`,
                fileName
            ]
    }
}


// 확장자에 맞춰 forge 인증서를 생성한다
// 1) crt, cer, der 일 경우, pem 으로 변환 후 cert 생성
// 2) pem 일 경우, 바로 pem으로 변환 후 cert 생성
// 3) .spc, p7a. p7b, p7c => pkcs#7 로 cert생성
// 4) .p8 => pkcs#8 로 cert 생성
// 5) .p12, .pfx => pkcs #12 로 cert 생성
const getCertTypeFrom = async (extension) => {

    switch (extension) {
        case "der":
        case "cer":
        case "crt":
            return X509

        case "pem":
            return null

        case "spc":
        case "p7a":
        case "p7b":
        case "p7c":
            return PKCS7

        case "p8":
            return

        case "p12":
        case "pfx":
            return

    }
}


const openSslExec = (command, fileName) => new Promise(

    (res, rej) => {

        openssl(command, (errCode, buf) => {

            // console.log("errcode?!", errCode, typeof errCode)

            if (errCode == 0) {
                // console.log(command + " 성공!")
                res(fileName)

            } else {
                // console.log(command + " 실패!")
                res(null)
            }
        })

    }
)


const getCommandAllTypes = async (crtName) => {

    return allCertTypes.map(async (certType, idx, arr) => {

        const fileName = `${TEMPORARY_CERT_PATH}${crtName}.pem`

        const command = await getOpenSslConvertCommand(
            crtName, 
            fileName, 
            certType
        )

        return await openSslExec(command, fileName)
    })
}


const crtToPem = (crtName) => new Promise(async (res, rej) => {

    try {
        const extension = await getExtension(crtName)

        if (extension == null) {

            // 성공할 떄 까지 모두 시도
            const commandAllTypes = await getCommandAllTypes(crtName)

            const results = await Promise.all(commandAllTypes)

            const fileName = results.find((res) => res != null)

            if (fileName) {
                res(fileName)

            } else {
                rej(null)
            }

        } else {
            const certType = await getCertTypeFrom(extension)

            const fileName = `${TEMPORARY_CERT_PATH}${crtName}.pem`

            const command = await getOpenSslConvertCommand(
                crtName, 
                fileName, 
                certType
            )

            openssl(command, (errCode, buf) => {

                if (errCode == 0) {
                    res(fileName)

                } else {
                    rej(command + "openssl failed!")
                }
            })
        }

    } catch (e) {
        console.log("error in openssl", e)
    }
})



const isSupported = (extension) => {
    switch (extension) {

        case "der":
        case "cer":
        case "crt":
        case "pem":
        case "spc":
        case "p7a":
        case "p7b":
        case "p7c":
        case "p8":
        case "p12":
        case "pfx":
            return true

        default:
            return false
    }
}

const getExtension = async (fileName) => {

    const splitted = fileName.lastIndexOf('.')
    if (splitted == -1) {
        return null

    } else {
        const ext = fileName.substring(
            splitted + 1, 
            fileName.length
        )

        if (isSupported(ext)) {
            return ext

        } else {
            return null
        }
    }
}



// 재귀 함수
// 일단 이름명 + uuid 으로 다운로드를 받는다

// 확장자에 맞춰 forge 인증서를 생성한다
// 1) crt, cer, der 일 경우, pem 으로 변환 후 cert 생성
// 2) pem 일 경우, 바로 pem으로 변환 후 cert 생성
// 3) .spc, p7a. p7b, p7c => pkcs#7 로 cert생성
// 4) .p8 => pkcs#8 로 cert 생성
// 5) .p12, .pfx => pkcs #12 로 cert 생성

// cert에서 subject와 issuer가 동일하면 탈출

// 디지털 시그니쳐를 뽑아내서, 내가 갖고 있는 public key랑 비교한다

const extractUrls = async (val) => {

    const tmp = forge.asn1.fromDer(val)

    // extracting arrays into one array
    const objects = tmp.value.reduce((prev, cur) => {
        prev = [
            ...prev,
            ...cur.value
        ]
        return prev
    }, [])

    return objects.reduce((prev, cur) => {

        if (cur.value.includes('http')) {
            prev.push(cur.value)
        }

        return prev
    }, [])
}

const refineUnicode = async (str) => {

    if (str.includes('\u0006')) {
        const urls = await extractUrls(str)

        const url = urls.find((url) => !url.includes('ocsp'))

        if (url == undefined) {

            const ocsp = urls.find((url) => url.includes('ocsp'))
            if (ocsp) {
                return ocsp

            } else {
                return str
            }
        }

        return url

    } else {
        return str
    }
}
