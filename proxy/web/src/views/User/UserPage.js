import React, { useEffect, useState } from "react";
import UserMain from "./UserMain.js";
import { observer, inject } from "mobx-react";
import { makeStyles } from '@material-ui/core/styles';
import Snackbars from '../../components/Snackbars/Snackbars'
import CreateReportDialog from '../Dialog/CreateReportDialog'
import LogoutDialog from '../Dialog/LogoutDialog'
import MyReportDialog from "../Dialog/MyReportDialog.js";
import DeleteReportDialog from "../Dialog/DeleteReportDialog";
import ReportDetailDialog from "../Dialog/ReportDetailDialog";
import { CircularProgress } from "@material-ui/core";
import {useHistory} from 'react-router-dom'


const UserPage = inject("store")(
  observer((props) => {
    const classes = useStyles()
    const history = useHistory()

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

      if (props.store.isAdmin){
        history.push('/admin')
        return

      } else {

        props.store.getMyReports()
      }

    }, [])


    return (
      <React.Fragment>

        <div className={classes.wrapper}>
          <UserMain />

          {props.store.isReportDialogOpen &&
            <CreateReportDialog />}

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
            <ReportDetailDialog />}
        </div>

        <Snackbars></Snackbars>

      </React.Fragment>
    );
  }))

export default UserPage;


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