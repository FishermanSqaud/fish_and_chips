import React, { useEffect, useState } from "react";
import MainPage from "./MainPage.js";
import { observer, inject } from "mobx-react";
import { makeStyles } from '@material-ui/core/styles';
import Snackbars from './Snackbars'
import ReportDialog from './ReportDialog'
import CheckDialog from './CheckDialog'


const Index = inject("store")(
  observer((props) => {
    const classes = useStyles()

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {


      document.body.classList.add("index-page");
      document.body.classList.add("sidebar-collapse");
      document.documentElement.classList.remove("nav-open");

      const body = document.getElementsByTagName("body")[0]
      if (body) {
        body.style.fontWeight = 400
        body.style.lineHeight = 1.5
        body.style.color = "#2c2c2c"
        body.style.fontSize = 14
        body.style.fontFamily = '"Montserrat", "Helvetica Neue", Arial, sans-serif'
        body.style.overflowX = 'hidden'
        body.style.margin = 0
        body.style.backgroundColor = 'white'
        body.style.textAlign = 'left'
        body.style.webkitFontSmoothing = 'antialiased'
      }

      return function cleanup() {
        document.body.classList.remove("index-page");
        document.body.classList.remove("sidebar-collapse");
      };

    });

    useEffect(() => {
      async function init() {
        try {

          setIsLoading(true)

          // await props.store.getAllReport()

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
            <CheckDialog />}
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