// const consts = require('./consts')
import {
    securityLevel,
    securityTexts,
    icons,
    detailTexts,
    dummyIcons,
    reportThreshold
} from './consts.js';

// ===== MAIN POPUP ELEMENTS ======
let backgroundEl = document.getElementById('background')
let encryptMsgContainer = document.getElementById('encryptMsg')
let reportSummaryContainer = document.getElementById('reportSummary')
let totalIcon = document.getElementById('totalIcon')
let securityText = document.getElementById('securityText')
let helperText = document.getElementById('helperText')

const SERVER_URL = "http://3.35.127.235"




// ===== DATA FOR DETAILS =======
let isEncrypted = false
let reportCnt = 0
let isDomainFound = false
// ==================================


// ===== Data Fetch Interface =======
// ===== Curretnly Dummy data =======
const requestEncryptCheck = async () => {

    try {

        const curDomain = localStorage.getItem("report_domain")

        const url = new URL(curDomain)
        if (url.protocol == "http:"){            
            return false
        }

        // Temp Hack
        if (url.protocol == "https:"){
            return true
        }

        const response = await fetch(
            `${SERVER_URL}/api/v1/verify`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    uri: curDomain
                })
            }
        )

        console.log("인증서 확인 요청 결과 ", response)


        if (response.ok) {
            const responseJson = await response.json()

            return responseJson.result

        } else {
            return false
        }

    } catch (e) {
        console.log("request Encrypt Check error ", e)
        return false
    }
}

const requestReportCnt = async () => {

    try {

        const curDomain = localStorage.getItem("report_domain")

        const response = await fetch(
            `${SERVER_URL}/api/v1/reports/check`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    spam_domain: curDomain
                })
            }
        )

        console.log("신고 내역 확인 요청 결과 ", response)


        if (response.ok) {
            const responseJson = await response.json()

            return responseJson.reports.length

        } else {
            return 0
        }

    } catch (e) {
        console.log("requestReportCnt error ", e)
        return 0
    }
}

const requestDomainCheck = async () => {

    try {

        const curDomain = localStorage.getItem("report_domain")

        const response = await fetch(
            `${SERVER_URL}/api/v1/auth_domains/check`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    uri: curDomain
                })
            }
        )

        console.log("도메인 확인 요청 결과 ", response)

        if (response.ok) {
            const responseJson = await response.json()

            return responseJson.isAuthenticated

        } else {
            return false
        }

    } catch (e) {
        console.log("requestDomainCheck error ", e)
        return false
    }
}

const requestSecurityCheck = async () => {

    let [isEncrypted, reportCnt, isDomainFound] =await Promise.all([
        requestEncryptCheck(),
        requestReportCnt(),
        requestDomainCheck()
    ])

    return [isEncrypted, reportCnt, isDomainFound]
}


async function main() {

    // ===== DETAILS ELEMENTS ======
    let encryptIconEl = document.getElementById('encryptIcon')
    let encryptTextEl = document.getElementById('encryptText')
    let reportIconEl = document.getElementById('reportIcon')
    let reportCntEl = document.getElementById('reportCnt')
    let reportTextEl = document.getElementById('reportText')
    let domainFoundIconEl = document.getElementById('domainFoundIcon')
    let domainFoundTextEl = document.getElementById('domainFoundText')

    // Overview
    let totalIcon = document.getElementById('totalIcon')
    let securityText = document.getElementById('securityText')
    let helperText = document.getElementById('helperText')



    let [isEncrypted, reportCnt, isDomainFound] = await requestSecurityCheck()

    const secureLevel = await evaluate(isEncrypted, reportCnt, isDomainFound)

    totalIcon.src = dummyIcons[secureLevel]
    securityText.innerText = securityTexts[secureLevel].securityMsg
    securityText.style.color = securityTexts[secureLevel].fontColor
    helperText.innerText = securityTexts[secureLevel].helperMsg

    if (secureLevel == securityLevel.SECURE){
        isEncrypted = true
    }

    console.log("총 결과 : ", [isEncrypted, reportCnt, isDomainFound])
    // changeState(dummyStateIdx)()

    if (encryptIconEl) {
        if (isEncrypted) {
            encryptIconEl.src = icons.enryption.fine
            encryptTextEl.innerText = detailTexts.encryption.fine
        } else {
            encryptIconEl.src = icons.enryption.none
            encryptTextEl.innerText = detailTexts.encryption.none
        }
    }

    if (reportCntEl) {
        reportCntEl.innerText = reportCnt

        if (reportCnt == 0) {
            reportIconEl.src = icons.report.none

        } else if (reportCnt <= reportThreshold) {
            reportIconEl.src = icons.report.few

        } else {
            reportIconEl.src = icons.report.many
        }
    }


    if (domainFoundIconEl) {

        if (isDomainFound) {
            domainFoundIconEl.src = icons.domain.found
            domainFoundTextEl.innerText = detailTexts.domain.found
        } else {
            domainFoundIconEl.src = icons.domain.notFound
            domainFoundTextEl.innerText = detailTexts.domain.notFound
        }
    }
}

main()


// window.addEventListener("load", async () => {
// })

const evaluate = async (isEncrypted, reportCnt, isDomainFound) => {



    if (isDomainFound){ // 기업인증이 된 경우, 별도로 신고내역은 반영하지 않는다
        
        if (isEncrypted) {

            return securityLevel.SECURE

        } else {


            const curDomain = localStorage.getItem("report_domain")

            const url = new URL(curDomain)

            if (url.protocol == "https:"){

                return securityLevel.SECURE

            } else {
                return securityLevel.LOW_REPORT_NO_ENCRYPT
            }
        }

    } else {

        if (reportCnt >= reportThreshold){ // 피싱으로 의심 신고가 적당히 들어온 경우

            if (isEncrypted){ // 피싱사이트인데 암호화를 했을 수도 있다

                return securityLevel.HIGH_REPORT_YES_ENCRYPT

            } else {
                return securityLevel.DANGER
            }

        } else { // 피싱 의심 신고가 적은 경우

            if (isEncrypted){ // 암호화 피싱사이트인데 아직 신고가 적은 경우 일 수도 있다.

                return securityLevel.SECURE_BUT_DOUBTFUL

            } else { // 정상 사이트인데 암호화를 안 했을 수도 있다.
                return securityLevel.LOW_REPORT_NO_ENCRYPT
            }
        }
    }
}



// ==== Passing Domain Data to Client Page ==============================

const chromeTabOption = {
    active: true,
    
    // currentWindow: true
    // 'windowId': chrome.windows.WINDOW_ID_CURRENT,
    lastFocusedWindow: true
}


chrome.tabs.query(chromeTabOption, tabs => {
    const url = tabs[0].url;

    localStorage.setItem("report_domain", url)
})

let reportBtn = document.getElementById('reportBtn')
if (reportBtn) {
    reportBtn.onclick = () => {

        const curDomain = localStorage.getItem("report_domain")
        window.open(`${SERVER_URL}?report=${curDomain}`)
    }
}



// ==== DETAIL SECTION ==============================

let detailsBtn = document.getElementById('detailsBtn')
let details = document.getElementById('details')
let isDetailOpen = false

const openDetailSection = (isDetailOpen) => () => {


    if (isDetailOpen) {
        details.style.display = "none"
        detailsBtn.innerText = "자세히"
        isDetailOpen = false

        detailsBtn.style.fontWeight = 300
        detailsBtn.style.background = 'linear-gradient(145deg, #e6e6e6, #ffffff)'
        detailsBtn.style.boxShadow = '20px 20px 60px #c9c9c9, -20px -20px 60px #ffffff'

    } else {
        details.style.display = null
        detailsBtn.innerText = "간략히"
        isDetailOpen = true

        detailsBtn.style.fontWeight = 600
        detailsBtn.style.background = 'linear-gradient(145deg, #bdbec2, #e1e2e7)'
        detailsBtn.style.boxShadow = '20px 20px 60px #a6a7ab, -20px -20px 60px #feffff'
    }
}

if (detailsBtn) {
    detailsBtn.onclick = openDetailSection(isDetailOpen)
}


// ===== TEST/PROTOTYPING WITH DUMMY DATA =======================
let changeStateBtn = document.getElementById('changeStateBtn');

let dummyStateIdx = 0

// Using Closure
const changeState = (dummyStateIdx) => () => {
    let curIdx = dummyStateIdx % dummyIcons.length

    totalIcon.src = dummyIcons[curIdx]
    securityText.innerText = securityTexts[curIdx].securityMsg
    securityText.style.color = securityTexts[curIdx].fontColor
    helperText.innerText = securityTexts[curIdx].helperMsg

    dummyStateIdx += 1
}

if (changeStateBtn) {
    //Dummy Code
    changeStateBtn.onclick = changeState(dummyStateIdx + 1)
}

