import React, { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "../components/Navbars/Navbar.js";
import Footer from "../components/Footers/Footer";
import Sidebar from "../components/Sidebar/Sidebar.js";

import routes from "./routes.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import bgImage from "assets/img/squad_1.jpg";
import logo from "assets/img/fish_and_chips_icon_48.png";
import { observer, inject } from "mobx-react";
import { useHistory } from 'react-router-dom'
import Snackbars from "./Snackbars.js";
import DetailDialog from './DetailDialog'
import DeleteReportDialog from './DeleteReportDialog'
import MyReportDialog from './MyReportDialog'

const Admin = inject("store")(
  observer((props) => {

    // styles
    const classes = useStyles();
    const history = useHistory()

    // ref to help us initialize PerfectScrollbar on windows devices
    const mainPanel = React.createRef();
    // states and functions
    const [image, setImage] = React.useState(bgImage);
    const [color, setColor] = React.useState("blue");
    const [fixedClasses, setFixedClasses] = React.useState("dropdown show");
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };
    const getRoute = () => {
      return window.location.pathname !== "/admin/maps";
    };


    useEffect(() => {
      if (!props.store.isAdmin) {
        props.store.set(
          "snackbarMsg",
          "접근 권한이 없습니다."
        )

        props.store.set(
          "snackbarWarningOpen",
          true
        )

        history.push('/')
        return
      }

      props.store.getMyReports()
      props.store.getUsers()

      // 30초마다 새로 불러오기
      setInterval(() => {
        props.store.getMyReports()
        props.store.getUsers()
      }, 1000 * 30)

    }, [])



    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={routes}
          logoText={"피쉬 앤 칩스 관리자"}
          logo={logo}
          image={image}
          handleDrawerToggle={handleDrawerToggle}
          open={mobileOpen}
          color={color}
          {...props}
        />
        <div className={classes.mainPanel} ref={mainPanel}>
          <Navbar
            routes={routes}
            handleDrawerToggle={handleDrawerToggle}
            {...props}
          />
          {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
          {getRoute() ? (
            <div className={classes.content}>
              <div className={classes.container}>{switchRoutes}</div>
            </div>
          ) : (
              <div className={classes.map}>{switchRoutes}</div>
            )}
          {getRoute() ? <Footer /> : null}
        </div>

        <Snackbars></Snackbars>

        {props.store.isReportDetailDialogOpen &&
          <DetailDialog />}

        {props.store.isDeleteReportOpen &&
          <DeleteReportDialog />}

        {props.store.isMyReportOpen &&
          <MyReportDialog 
            name={props.store.targetUserForDetails.name}
            reports={props.store.targetUserForDetails.reports} />}
      </div>
    );
  }))

export default Admin


const switchRoutes = (
  <Switch>
    {routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      }
      return null;
    })}
    <Redirect from="/admin" to="/admin/dashboard" />
  </Switch>
);

const useStyles = makeStyles(styles);