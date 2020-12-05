import { decorate, observable, action, entries } from "mobx";

class Store {
    constructor() {


        const urlParams = new URLSearchParams(window.location.search)
        this.reportDomain = urlParams.get("report")

        this.isLoggedIn = false
        this.isAdmin = false

        this.accessToken = localStorage.getItem("accessToken")
        if (this.accessToken != null || this.accessToken != undefined){
            this.isLoggedIn = true
        }

        this.userName = localStorage.getItem("userName")
        // this.userId = localStorage.getItem("userId")

        this.isReportDialogOpen = false
        this.isCheckDialogOpen = false
        this.isMyReportOpen = false

        this.reportsRowsPerPage = 10
        this.reportsTablePageNum = 0
        this.detaulReportKey = null
        this.isReportDetailDialogOpen = false
        this.tableFilter = this.FILTER_ALL
        this.tableSearch = ""


        this.snackbarInfoOpen = false
        this.snackbarWarningOpen = false
        this.snackbarErrorOpen = false
        this.snackbarMsg = ""
    }

    set = (field, value) => {
        this[field] = value
    }

    signUp = async (body) => {

        const backendUrl = process.env.REACT_APP_BACKEND_URL

        const response = await fetch(
            `${backendUrl}/users`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(body)
            }
          )

        return response
    }

    signIn = async (body) => {

        const backendUrl = process.env.REACT_APP_BACKEND_URL

        const response = await fetch(
            `${backendUrl}/users/signIn`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(body)
            }
          )
        
        if (response.ok) {

            this.set(
              "isLoggedIn",
              true
            )

            const accessToken = response.headers.get(
              "Authorization"
            )

            this.set(
              "accessToken",
              accessToken
            )

            console.log("로그인 토큰 확인 ", accessToken)

            const responseJson = await response.json()

            this.set(
              "userName",
              responseJson.userName
            )

            localStorage.setItem("accessToken", accessToken)
            localStorage.setItem("userName", responseJson.userName)

            return true

        } else {
            return false
        }
    }

}

decorate(Store, {
    isLoggedIn: observable, 
    isAdmin : observable,
    reportDomain : observable,
    accessToken : observable,
    userName : observable,
    isReportDialogOpen: observable,
    isCheckDialogOpen : observable,
    // userId : observable,
    isMyReportOpen : observable,

    snackbarInfoOpen: observable,
    snackbarWarningOpen: observable,
    snackbarErrorOpen: observable,

    set: action,
    signIn : action,

    reportsRowsPerPage: observable,
    reportsTablePageNum: observable,
    isReportDetailDialogOpen: observable,
    tableFilter: observable,
    tableSearch: observable,
});

export default Store;
