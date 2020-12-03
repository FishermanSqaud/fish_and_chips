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
        this.userId = localStorage.getItem("userId")

        this.isReportDialogOpen = false
        this.isCheckDialogOpen = false

        this.locationRowsPerPage = 10
        this.locationTablePageNum = 0
        this.detailLocationKey = null
        this.isDetailDialogOpen = false
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

}

decorate(Store, {
    isLoggedIn: observable, 
    isAdmin : observable,
    reportDomain : observable,
    accessToken : observable,
    userName : observable,
    isReportDialogOpen: observable,
    isCheckDialogOpen : observable,
    userId : observable,

    snackbarInfoOpen: observable,
    snackbarWarningOpen: observable,
    snackbarErrorOpen: observable,

    set: action,

    locationRowsPerPage: observable,
    locationTablePageNum: observable,
    isDetailDialogOpen: observable,
    tableFilter: observable,
    tableSearch: observable,
});

export default Store;
