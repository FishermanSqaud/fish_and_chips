
const securityTexts = [
    {
        securityMsg : "현재 사이트는 안전합니다.",
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
    icons.status.warning,
    icons.status.bad
]


const reportThreshold = 3

export {
    securityTexts,
    icons,
    detailTexts,
    dummyIcons,
    reportThreshold
}