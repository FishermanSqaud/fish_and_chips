import React from "react";
import { observer, inject } from "mobx-react";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from '@material-ui/core/styles';

const Alert = (props) => {
  return (
    <MuiAlert
      elevation={6}
      variant="filled"
      {...props} />
  )
}


const Snackbars = inject("store")(
  observer((props) => {
    const classes = useStyles()


    const handleSnackbarClose = (snackbarType) => () => {
      props.store.set(
        snackbarType,
        false
      )
    }

    return (
      <React.Fragment>

        {props.store.snackbarInfoOpen &&
          <Snackbar
            className={classes.snackbarStyle}
            open={props.store.snackbarInfoOpen}
            onClose={handleSnackbarClose("snackbarInfoOpen")}
            autoHideDuration={1500}
          >
            <Alert
              onClose={handleSnackbarClose("snackbarInfoOpen")}
              severity="info">
              {props.store.snackbarMsg}
            </Alert>
          </Snackbar>
        }

        {props.store.snackbarWarningOpen &&
          <Snackbar
            className={classes.snackbarStyle}
            open={props.store.snackbarWarningOpen}
            onClose={handleSnackbarClose("snackbarWarningOpen")}
            autoHideDuration={1500}
          >
            <Alert
              onClose={handleSnackbarClose("snackbarWarningOpen")}
              severity="warning">
              {props.store.snackbarMsg}
            </Alert>
          </Snackbar>
        }

        {props.store.snackbarErrorOpen &&
          <Snackbar
            className={classes.snackbarStyle}
            open={props.store.snackbarErrorOpen}
            onClose={handleSnackbarClose("snackbarErrorOpen")}
            autoHideDuration={1500}
          >
            <Alert
              onClose={handleSnackbarClose("snackbarErrorOpen")}
              severity="error">
              {props.store.snackbarMsg}
            </Alert>
          </Snackbar>
        }
      </React.Fragment>

    );
  }))

export default Snackbars;


const useStyles = makeStyles(theme => ({

  snackbarStyle: {
    position: "fixed",
    top: 12,
    zIndex: 2000,
    bottom: 'unset'
  }
}));