import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "@material-ui/core/Button";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { observer, inject } from "mobx-react";
import { CircularProgress, TextField } from "@material-ui/core";
import Table from "components/Table/Table.js";
import ReportsTable from "./ReportsTable"

import boyAvatar from "assets/img/boy.png";
import girlAvatar from "assets/img/girl.png"

import DeleteUserDialog from "views/DeleteUserDialog";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const useStyles = makeStyles(styles);

const AdminUsersPage = inject("store")(
  observer((props) => {

    const classes = useStyles();

    const handleUserDetailOpen = (targetUserId) => (e) => {

      const targetUser = props.store.users.find((user) => {
        return user.id == targetUserId
      })

      props.store.set(
        "targetUserForDetails",
        targetUser
      )

      props.store.set(
        "isUserDetailsOpen",
        true
      )
    }

    const handleUserDelete = () => {

        props.store.set(
          "isDeleteUserOpen",
          true
        )
    }

    const getUserImage = (id) => {
      if (id % 2 == 0){
        return boyAvatar
      } else {
        return girlAvatar
      }
    }

    return (
      <div>

        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite}>전체 사용자</h4>
                <p className={classes.cardCategoryWhite}>
                  {`업데이트 - ${new Date().toLocaleDateString()}`}
                </p>
              </CardHeader>

              <CardBody>
                {props.store.loadingUsers ?
                  <CircularProgress />
                  :
                  <Table
                    openDetail={handleUserDetailOpen}
                    tableHeaderColor="warning"
                    tableHead={["이름", "email", "신고 횟수", "가입 시각"]}
                    tableData={props.store.users.map((user) => {
                      return [
                        user.id,
                        user.name,
                        user.email,
                        user.reports.length,
                        new Date(user.created_time).toLocaleDateString(),
                      ]
                    })}
                  />
                }
              </CardBody>
            </Card>
          </GridItem>

          {props.store.isUserDetailsOpen &&

            <React.Fragment>
              <GridItem xs={12} sm={12} md={8}>
                <Card>

                  <CardHeader color="warning">
                    <h4 className={classes.cardTitleWhite}>
                      사용자 신고내역
                    </h4>
                    <p className={classes.cardCategoryWhite}>
                      클릭 시 자세히 보기
                    </p>
                  </CardHeader>

                  <CardBody>

                    <ReportsTable
                      overview
                      reports={props.store.targetUserForDetails.reports}
                    ></ReportsTable>

                  </CardBody>
                </Card>
              </GridItem>

              <GridItem xs={12} sm={12} md={4}>
                <Card profile>
                  <CardAvatar profile>
                    <a href="#pablo" onClick={e => e.preventDefault()}>
                      <img src={getUserImage(props.store.targetUserForDetails.id)} alt="..." />
                    </a>

                  </CardAvatar>
                  <CardBody profile>
                    <h6 className={classes.cardCategory}>
                      {props.store.targetUserForDetails.email}
                    </h6>
                    <h4 className={classes.cardTitle}>
                      {props.store.targetUserForDetails.name}
                    </h4>

                    <p className={classes.description}>
                      가입 날짜 : {
                        new Date(props.store.targetUserForDetails.created_time).toLocaleDateString()
                      } <br></br>
                      총 신고 횟수 : {props.store.targetUserForDetails.reports.length}
                    </p>

                    <Button
                      onClick={handleUserDelete}
                      color="secondary"
                      variant="contained">
                      회원 탈퇴
                    </Button>

                  </CardBody>
                </Card>
              </GridItem>

              {props.store.isDeleteUserOpen &&
                <DeleteUserDialog/>}

            </React.Fragment>
          }
        </GridContainer>
      </div>
    );
  }))

export default AdminUsersPage