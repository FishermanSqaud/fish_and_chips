import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom'

const MainPage = inject("store")(
  observer((props) => {

    let pageHeader = React.createRef();

    const classes = useStyles()

    const openReportModal = () => {

      if (props.store.isLoggedIn) {

        props.store.set(
          "isReportDialogOpen",
          true
        )

      } else {

        props.store.set(
          "snackbarMsg",
          "로그인이 필요합니다"
        )

        props.store.set(
          "snackbarInfoOpen",
          true
        )
      }

    }

    const handleLogout = () => {
      props.store.set(
        "isCheckDialogOpen",
        true
      )
    }

    const handleOpenMyReport = () => {

      props.store.getMyReports()
      
      props.store.set(
        "isMyReportOpen",
        true
      )
    }

    return (
      <>
        <div className={classes.clearFilter} filter-color="blue">
          <div
            className={classes.pageHeaderImage}
            ref={pageHeader}
          ></div>
          <div className={classes.container}>

            <div className={classes.brand}>

              <img
                alt="..."
                className={classes.mrLogo}
                src={require(
                  "assets/img/fish_and_chips_icon_128.png"
                )}
              ></img>

              <h4 className={classes.description}>
                Fish and Chips
              </h4>

              {props.store.isLoggedIn &&

                <h4 className={classes.description}>
                  안녕하세요 {props.store.userName}님 😊
                </h4>
              }

              <div>
                <Button
                  style={{
                    marginTop: 30,
                    width: '16%'
                  }}
                  onClick={openReportModal}
                  variant="contained"
                  color="secondary">
                  신고하기
                </Button>
              </div>

              <div>
                {props.store.isLoggedIn &&
                  <Button
                    style={{
                      marginTop: 30,
                      width: '16%'
                    }}
                    onClick={handleOpenMyReport}
                    variant="contained"
                    color="primary">
                    신고내역
                  </Button>
                }
              </div>

              <div>
                {props.store.isLoggedIn ?

                  <Button
                    style={{
                      marginTop: 30,
                      width: '16%',
                      backgroundColor: 'dimgray'
                    }}
                    onClick={handleLogout}
                    variant="contained"
                    color="primary">
                    로그아웃
                </Button>

                  :

                  <Link to={'/signIn'}>
                    <Button
                      style={{
                        marginTop: 30,
                        width: '16%'
                      }}
                      variant="contained"
                      color="primary">
                      로그인
                    </Button>
                  </Link>
                }
              </div>


              {props.store.isAdmin ?

                <Link to={'/admin'}>
                  <Button
                    style={{
                      marginTop: 30,
                      width: '16%'
                    }}
                    variant="contained"
                    >
                    관리자 페이지
                </Button>
                </Link>
                :
                null
              }

            </div>


            <h5 className={classes.categoryAbsolute}>

              Coded by{" "}

              <a
                href="https://github.com/FishermanSqaud"
                target="_blank"
                style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  textDecoration: "none"
                }}>
                Team
            </a>


              <img
                alt="..."
                className={classes.logo}
                src={require("assets/img/riot-police.png")}
              ></img>

              <a
                href="https://github.com/FishermanSqaud"
                target="_blank"
                style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  textDecoration: "none"
                }}>
                Fisherman Squad
            </a>

            </h5>
          </div>
        </div>
      </>
    );
  }))

export default MainPage;


const useStyles = makeStyles(theme => ({

  snackbarStyle: {
    position: "fixed",
    top: 12,
    zIndex: 2000,
    bottom: 'unset'
  },
  clearFilter: {
    background: 'linear-gradient(0deg, rgba(44, 44, 44, 0.2), rgba(3, 161, 224, 0.6))',
    height: '125vh',
    minHeight: '100vh',
    maxHeight: 999,
    padding: 0,
    color: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden'
  },
  pageHeaderImage: {
    backgroundImage: "url(" + require("assets/img/squad_2.jpg") + ")",
    position: 'absolute',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    width: '100%',
    height: '100%',
    zIndex: -1
  },
  container: {
    height: '100%',
    zIndex: 1,
    textAlign: 'center',
    position: 'relative',
    paddingTop: '12vh',
    paddingBottom: 40,
    width: '100%',
    paddingRight: 15,
    paddingLeft: 15,
    marginRight: 'auto',
    marginLeft: 'auto'
  },
  brand: {
    top: '37%',
    position: 'absolute',
    left: '50%',
    zIndex: 2,
    transform: 'translate(-50%,-50%)',
    textAlign: 'center',
    color: 'white',
    padding: '0 15',
    width: '100%',
    maxWidth: 880
  },
  categoryAbsolute: {
    position: 'absolute',
    top: '100vh',
    marginTop: -60,
    padding: '0 15',
    width: '100%',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: 400,
    textTransform: 'capitalize',
    fontSize: '1.3em',
    lineHeight: '1.4em',
    marginBottom: 15,

  },
  logo: {
    maxWidth: 25,
    top: -2,
    position: 'relative',
    borderRadius: 1,
    verticalAlign: 'middle',
    borderStyle: 'none',
    marginLeft: 9,
    marginRight: 10
  },
  mrLogo: {

    maxWidth: 122,
    marginBottom: 40,
    borderRadius: 1,
    verticalAlign: 'middle',
    borderStyle: 'none',
    textAlign: 'center'
  },
  description: {
    fontSize: '1.5em',
    lineHeight: '1.45em',
    marginTop: 30,
    marginBottom: 15,
    fontWeight: 400
  }
}));