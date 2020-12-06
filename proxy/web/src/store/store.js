import { decorate, observable, action, entries } from "mobx";
import jwt from 'jsonwebtoken'

class Store {
  constructor() {


    const urlParams = new URLSearchParams(window.location.search)
    this.reportDomain = urlParams.get("report")

    this.isLoggedIn = false
    this.isAdmin = false

    this.accessToken = localStorage.getItem("accessToken")
    if (this.accessToken != null || this.accessToken != undefined) {
      this.isLoggedIn = true

      const decoded = jwt.verify(
        this.accessToken,
        process.env.REACT_APP_SIGN_IN_SECRET
      )

      this.isAdmin = decoded.isAdmin
    }

    this.userName = localStorage.getItem("userName")

    this.myReports = []

    this.isReportDialogOpen = false
    this.isCheckDialogOpen = false
    this.isMyReportOpen = false
    this.isDeleteDialogOpen = false

    this.reportsRowsPerPage = 10
    this.reportsTablePageNum = 0
    this.detailReportId = null
    this.isReportDetailDialogOpen = false
    this.tableFilter = this.FILTER_ALL
    this.tableSearch = ""


    this.snackbarInfoOpen = false
    this.snackbarWarningOpen = false
    this.snackbarErrorOpen = false
    this.snackbarMsg = ""


    this.backendUrl = process.env.REACT_APP_BACKEND_URL
  }

  set = (field, value) => {
    this[field] = value
  }

  signUp = async (body) => {

    const response = await fetch(
      `${this.backendUrl}/users`,
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

  getMyReports = async (accessToken) => {

    var headers = {
      "Content-Type": "application/json",
    }

    if (accessToken == undefined) {
      headers["Authorization"] = `Bearer ${this.accessToken}`
    } else {
      headers["Authorization"] = `Bearer ${accessToken}`
    }

    const response = await fetch(
      `${this.backendUrl}/reports`,
      {
        method: "GET",
        headers: headers
      }
    )

    if (response.ok) {

      const responseJson = await response.json()

      responseJson.reports.sort(this.compareCreateTime)

      this.set(
        "myReports",
        responseJson.reports
      )

      return true

    } else {
      return false
    }
  }

  
  compareCreateTime = (contentA, contentB, isAscend = false) => {
    if (isAscend) {
      return new Date(contentB.created_time) <
        new Date(contentA.created_time)
        ? 1
        : new Date(contentB.created_time) > new Date(contentA.created_time)
        ? -1
        : 0;
    } else {
      return new Date(contentB.created_time) >
        new Date(contentA.created_time)
        ? 1
        : new Date(contentB.created_time) < new Date(contentA.created_time)
        ? -1
        : 0;
    }
  };

  signIn = async (body) => {


    const response = await fetch(
      `${this.backendUrl}/users/signIn`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }
    )

    console.log("wtf?", response)

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

      const decoded = jwt.verify(
        accessToken,
        process.env.REACT_APP_SIGN_IN_SECRET
      )

      this.set(
        "isAdmin",
        decoded.isAdmin
      )

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
  isAdmin: observable,
  reportDomain: observable,
  accessToken: observable,
  userName: observable,
  isReportDialogOpen: observable,
  isCheckDialogOpen: observable,
  isDeleteDialogOpen: observable,
  isMyReportOpen: observable,
  myReports: observable,
  getMyReports: action,

  snackbarInfoOpen: observable,
  snackbarWarningOpen: observable,
  snackbarErrorOpen: observable,

  set: action,
  signIn: action,

  reportsRowsPerPage: observable,
  reportsTablePageNum: observable,
  isReportDetailDialogOpen: observable,
  tableFilter: observable,
  tableSearch: observable,
});

export default Store;
