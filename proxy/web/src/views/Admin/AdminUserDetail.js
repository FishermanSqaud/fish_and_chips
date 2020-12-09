import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import Button from "@material-ui/core/Button";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import { observer, inject } from "mobx-react";
import ReportsTable from "../ReportsTable/ReportsTable"
import DeleteUserDialog from "views/Dialog/DeleteUserDialog";

import boyAvatar from "assets/img/boy.png";
import girlAvatar from "assets/img/girl.png"


const UserDetail = inject("store")(
  observer((props) => {

    const classes = useStyles();

    const handleUserDelete = () => {

      props.store.set(
        "isDeleteUserOpen",
        true
      )
    }

    const getUserImage = (id) => {
      if (id % 2 == 0) {
        return boyAvatar
      } else {
        return girlAvatar
      }
    }

    return (

      <React.Fragment>

        <GridItem xs={12} sm={12} md={8}>
          <Card>

            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>
                {cardTitle}
              </h4>

              <p className={classes.cardCategoryWhite}>
                {cardSubtitle}
              </p>
            </CardHeader>

            <CardBody>

              <ReportsTable
                overview
                reports={
                  props.store.targetUserForDetails.reports
                }
              ></ReportsTable>

            </CardBody>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            
            <CardAvatar profile>
              
              <img 
                src={
                  getUserImage(props.store.targetUserForDetails.id)
                } 
                alt="..." />
              
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
                  new Date(
                    props.store.targetUserForDetails.created_time
                  ).toLocaleDateString()
                } 
                
                <br></br>

                총 신고 횟수 : {
                  props.store.targetUserForDetails.reports.length
                }
              </p>

              <Button
                onClick={handleUserDelete}
                color="secondary"
                variant="contained">
                {ejectBtnLabel}
              </Button>

            </CardBody>
          </Card>
        </GridItem>

        {props.store.isDeleteUserOpen &&
          <DeleteUserDialog />}

      </React.Fragment>
    );
  }))

export default UserDetail;

const ejectBtnLabel = "회원 탈퇴"

const cardSubtitle = "클릭 시 자세히 보기"

const cardTitle = "사용자 신고내역"

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
