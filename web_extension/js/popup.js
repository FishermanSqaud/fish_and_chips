// const consts = require('./consts')
import {
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


// ===== Data Fetch Interface =======
// ===== Curretnly Dummy data =======
const requestEncryptCheck = () => {
    return false
}

const requestReportCnt = () => {
    return 0
}

const requestDomainCheck = () => {
    return false
}


// ===== DATA FOR DETAILS =======
let isEncrypted = requestEncryptCheck()
let reportCnt = requestReportCnt()
let isDomainFound = requestDomainCheck()
// ==================================


// ===== DETAILS ELEMENTS ======
let encryptIconEl = document.getElementById('encryptIcon')
let encryptTextEl = document.getElementById('encryptText')
let reportIconEl = document.getElementById('reportIcon')
let reportCntEl = document.getElementById('reportCnt')
let reportTextEl = document.getElementById('reportText')
let domainFoundIconEl = document.getElementById('domainFoundIcon')
let domainFoundTextEl = document.getElementById('domainFoundText')



window.addEventListener("load", ()=> {

    changeState(dummyStateIdx)()

    if (encryptIconEl){
        if (isEncrypted) {
            encryptIconEl.src = icons.enryption.fine
            encryptTextEl.innerText = detailTexts.encryption.fine
        } else {
            encryptIconEl.src = icons.enryption.none
            encryptTextEl.innerText = detailTexts.encryption.none
        }
    }
    
    if (reportCntEl){
        reportCntEl.innerText = reportCnt
    
        if (reportCnt == 0){
            reportIconEl.src = icons.report.none
    
        } else if (reportCnt <= reportThreshold){
            reportIconEl.src = icons.report.few
    
        } else {
            reportIconEl.src = icons.report.many
        }
    }
    
    
    if (domainFoundIconEl){
    
        if (isDomainFound) {
            domainFoundIconEl.src = icons.domain.found
            domainFoundTextEl.innerText = detailTexts.domain.found
        } else {
            domainFoundIconEl.src = icons.domain.notFound
            domainFoundTextEl.innerText = detailTexts.domain.notFound
        }
    }
})


// localStorage.setItem("test2", window.location.href)

chrome.tabs.query({active : true, 'windowId' : chrome.windows.WINDOW_ID_CURRENT, lastFocusedWindow : true}, tabs => {
    const url = tabs[0].url;
    
    localStorage.setItem("report_domain", url)
})

let reportBtn = document.getElementById('reportBtn')
if (reportBtn) {
    reportBtn.onclick = () => {

        const curDomain = localStorage.getItem("report_domain")
        var reportPage = window.open(`http://localhost?report=${curDomain}`)//, '_blank',false)

    }
}
// ==== DETAIL SECTION ==============================

let detailsBtn = document.getElementById('detailsBtn')
let details = document.getElementById('details')
let isDetailOpen = false

const openDetailSection = (isDetailOpen) => () => {


    if (isDetailOpen){
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

if (detailsBtn){
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

if (changeStateBtn){
    //Dummy Code
    changeStateBtn.onclick = changeState(dummyStateIdx + 1)
}

