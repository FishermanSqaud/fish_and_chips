import React, { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
// import PerfectScrollbar from "perfect-scrollbar";
// import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "../components/Navbars/Navbar.js";
import Footer from "../components/Footers/Footer";
import Sidebar from "../components/Sidebar/Sidebar.js";

import routes from "./routes.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/fish_and_chips_icon_48.png";
import { observer, inject } from "mobx-react";
import {useHistory} from 'react-router-dom'

let ps;

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
  const handleImageClick = image => {
    setImage(image);
  };
  const handleColorClick = color => {
    setColor(color);
  };
  const handleFixedClick = () => {
    if (fixedClasses === "dropdown") {
      setFixedClasses("dropdown show");
    } else {
      setFixedClasses("dropdown");
    }
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return window.location.pathname !== "/admin/maps";
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  // initialize and destroy the PerfectScrollbar plugin
  // React.useEffect(() => {
  //   if (navigator.platform.indexOf("Win") > -1) {
  //     ps = new PerfectScrollbar(mainPanel.current, {
  //       suppressScrollX: true,
  //       suppressScrollY: false
  //     });
  //     document.body.style.overflow = "hidden";
  //   }
  //   window.addEventListener("resize", resizeFunction);
  //   // Specify how to clean up after this effect:
  //   return function cleanup() {
  //     if (navigator.platform.indexOf("Win") > -1) {
  //       ps.destroy();
  //     }
  //     window.removeEventListener("resize", resizeFunction);
  //   };
  // }, [mainPanel]);

  useEffect(()=>{
    // Admin check
    // 1. DB 수정
    // 2. admin인지 받아온 뒤
    // 3. 기록 (local storage 저장은 좀 그러니깐, jwt를 분해해서 isadmin인지로 확인)
    if (!props.store.isAdmin){
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
    </div>
  );
}))

// ({ ...rest }) {

export default Admin
