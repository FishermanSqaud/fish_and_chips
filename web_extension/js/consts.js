const securityLevel = {
     SECURE : 0,
     DANGER : 1,
     LOW_REPORT_NO_ENCRYPT : 2,
     HIGH_REPORT_YES_ENCRYPT : 3,
     SECURE_BUT_DOUBTFUL : 4
}

const securityTexts = [
    {
        securityMsg : "현재 사이트는 인증되었습니다.",
        helperMsg : "",
        reportMsg : "피싱 신고 내역이 없습니다.", // Not Used For Now
        fontColor : "#0BF781"
    },
    {
        securityMsg : "매우 위험한 사이트입니다.",
        helperMsg : "개인정보 입력 절대 금지.",
        reportMsg : "금융 피싱으로 3번 신고된 내역이 있습니다.", // Not Used For Now
        fontColor : "#FD4760"

    },
    {
        securityMsg : "보안이 취약한 사이트입니다.",
        helperMsg : "개인정보 입력을 권장하지 않습니다.",
        reportMsg : "금융 피싱으로 3번 신고된 내역이 있습니다." // Not Used For Now
    },
    {
        securityMsg : "피싱 신고내역이 많습니다.",
        helperMsg : "개인정보 입력을 권장하지 않습니다.",
        reportMsg : "금융 피싱으로 3번 신고된 내역이 있습니다." // Not Used For Now
    }, 
    {
        securityMsg : "현재 사이트는 암호화 되었습니다",
        helperMsg : "인증된 기업 페이지가 아니므로 조심하세요.",
    }
]

const iconsDir = "icons/"

const icons = {
    status : {
        good : iconsDir + "checked_ver2.svg",
        warning : iconsDir + "warning.svg",
        bad : iconsDir + "reject_ver2.svg",
    },
    enryption : {
        fine : iconsDir + "encryptFine.svg",
        none :  iconsDir + "encryptNone.svg"
    },
    report : {
        none : iconsDir + "reportNone.svg",
        few : iconsDir + "reportWarning.svg",
        many : iconsDir + "reportBad.svg"
    },
    domain : {
        found : iconsDir + "domainFound.svg",
        notFound : iconsDir + "domainNotFound.svg"
    }
}

const detailTexts = {
    encryption : {
        fine : "암호화",
        none : "비암호화"
    },
    domain : {
        found : "기업인증",
        notFound : "기업미확인"
    }
}

const dummyIcons = [
    icons.status.good,
    icons.status.bad,
    icons.status.warning,
    icons.status.warning,
    icons.status.warning,
]


const reportThreshold = 4

export {
    securityLevel,
    securityTexts,
    icons,
    detailTexts,
    dummyIcons,
    reportThreshold
}