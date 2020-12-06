import React from "react";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";
// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";
import { observer, inject } from "mobx-react";
import CheckDialog from '../../views/CheckDialog'

const useStyles = makeStyles(styles);

const AdminNavbarLinks = inject("store")(
  observer((props) => {

    const classes = useStyles();

    const [openNotification, setOpenNotification] = React.useState(null);
    const [openProfile, setOpenProfile] = React.useState(null);

    const handleClickNotification = event => {
      if (openNotification && openNotification.contains(event.target)) {
        setOpenNotification(null);
      } else {
        setOpenNotification(event.currentTarget);
      }
    };

    const handleCloseNotification = () => {
      setOpenNotification(null);
    };


    const handleClickProfile = event => {
      if (openProfile && openProfile.contains(event.target)) {
        setOpenProfile(null);
      } else {
        setOpenProfile(event.currentTarget);
      }
    };

    const handleCloseProfile = () => {
      setOpenProfile(null);

      props.store.set(
        "isCheckDialogOpen",
        true
      )
    };


    return (
      <React.Fragment>
        <div>
          <div className={classes.searchWrapper}>
            <CustomInput
              formControlProps={{
                className: classes.margin + " " + classes.search
              }}
              inputProps={{
                placeholder: "검색 지원 예정",
                inputProps: {
                  "aria-label": "Search"
                }
              }}
            />

            <Button color="white" aria-label="edit" justIcon round>
              <Search />
            </Button>
          </div>

          <div className={classes.manager}>
            <Button
              color={window.innerWidth > 959 ? "transparent" : "white"}
              justIcon={window.innerWidth > 959}
              simple={!(window.innerWidth > 959)}
              aria-owns={openProfile ? "profile-menu-list-grow" : null}
              aria-haspopup="true"
              onClick={handleClickProfile}
              className={classes.buttonLink}
            >
              <Person className={classes.icons} />
              <Hidden mdUp implementation="css">
                <p className={classes.linkText}>Profile</p>
              </Hidden>
            </Button>
            <Poppers
              open={Boolean(openProfile)}
              anchorEl={openProfile}
              transition
              disablePortal
              className={
                classNames({ [classes.popperClose]: !openProfile }) +
                " " +
                classes.popperNav
              }
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  id="profile-menu-list-grow"
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom"
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleCloseProfile}>
                      <MenuList role="menu">
                        <Divider light />
                        <MenuItem
                          onClick={handleCloseProfile}
                          className={classes.dropdownItem}
                        >
                          로그아웃
                    </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Poppers>
          </div>
        </div>

        {props.store.isCheckDialogOpen &&
          <CheckDialog />}
      </React.Fragment>

    );
  }))

export default AdminNavbarLinks
