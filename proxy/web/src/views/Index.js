import React, { useEffect, useState } from "react";
import MainPage from "./MainPage.js";
import { observer, inject } from "mobx-react";
import { makeStyles } from '@material-ui/core/styles';
import Snackbars from './Snackbars'
import ReportDialog from './ReportDialog'
import LogoutDialog from './LogoutDialog'
import MyReportDialog from "./MyReportDialog.js";
import DeleteReportDialog from "./DeleteReportDialog";
import DetailDialog from "./DetailDialog";
import { CircularProgress } from "@material-ui/core";


const Index = inject("store")(
  observer((props) => {
    const classes = useStyles()

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
      document.body.classList.add("index-page");
      document.body.classList.add("sidebar-collapse");
      document.documentElement.classList.remove("nav-open");

      return function cleanup() {
        document.body.classList.remove("index-page");
        document.body.classList.remove("sidebar-collapse");
      };

    });

    useEffect(() => {
      async function init() {
        try {

          setIsLoading(true)

          await props.store.getMyReports()

          setIsLoading(false)

        } catch (err) {
          alert(err)
        }
      }
      init()

    }, [])


    return (
      <React.Fragment>

        <div className={classes.wrapper}>
          <MainPage />

          {props.store.isReportDialogOpen &&
            <ReportDialog />}

          {props.store.isCheckDialogOpen &&
            <LogoutDialog />}

          {props.store.isMyReportOpen &&
            (props.store.loadingMyReport ?
              <CircularProgress></CircularProgress>
              :
              <MyReportDialog reports={props.store.myReports} />)
          }

          {props.store.isDeleteReportOpen &&
            <DeleteReportDialog />}

          {props.store.isReportDetailDialogOpen &&
            <DetailDialog />}
        </div>

        <Snackbars></Snackbars>

      </React.Fragment>
    );
  }))

export default Index;


const useStyles = makeStyles(theme => ({

  snackbarStyle: {
    position: "fixed",
    top: 12,
    zIndex: 2000,
    bottom: 'unset'
  },
  pageHeader: {
    position: 'absolute',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    width: '100%',
    height: '100%',
    zIndex: '-1'
  },
  wrapper: {

  },
  main: {
    position: 'relative',
    background: 'white'
  },
  pagination: {
    paddingBottom: 0,
    padding: '70px 0',
    position: 'relative',
    background: 'white'
  },
  container: {
    paddingBottom: '5%',
    maxWidth: '80%',
    width: '100%',
    paddingRight: 15,
    paddingLeft: 15,
    marginRight: 'auto',
    marginLeft: 'auto'
  }
}));