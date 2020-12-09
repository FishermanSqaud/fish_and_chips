import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "@material-ui/core/Button";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import { observer, inject } from "mobx-react";
import { CircularProgress } from "@material-ui/core";
import Table from "components/Table/Table.js";
import ReportsTable from "../ReportsTable/ReportsTable"
import DeleteUserDialog from "views/Dialog/DeleteUserDialog";
import UserDetail from './AdminUserDetail'

import boyAvatar from "assets/img/boy.png";
import girlAvatar from "assets/img/girl.png"


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

                <h4 className={classes.cardTitleWhite}>
                  {cardTitle}
                </h4>

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
                    tableHead={usersTableHeadColumns}
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
            <UserDetail></UserDetail>}
            
        </GridContainer>
      </div>
    );
  }))

export default AdminUsersPage;

const usersTableHeadColumns = [
  "이름", 
  "email", 
  "신고 횟수", 
  "가입 시각"
]

const cardTitle = "전체 사용자"

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
