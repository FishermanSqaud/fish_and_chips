import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { observer, inject } from "mobx-react";
import { website, server } from "variables/general.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const OverviewTables = inject("store")(
  observer((props) => {

    const classes = useStyles();

    const handleUserReportOpen = (targetUserId) => (e) => {

      const targetUser = props.store.users.find((user) => {
        return user.id == targetUserId
      })

      props.store.set(
        "targetUserForDetails",
        targetUser
      )

      props.store.set(
        "isMyReportOpen",
        true
      )

    }

    return (

      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <CustomTabs
            title="처리 예정:"
            headerColor="primary"
            tabs={[
              {
                tabName: "신고 내역",
                tabIcon: BugReport,
                tabContent: (
                  <Tasks
                    checkedIndexes={[]}
                    tasksIndexes={
                      props.store.myReports.length >= 6 ?
                        defaultReportsCntArray
                        :
                        props.store.myReports.map((idx) => idx)
                    }
                    tasks={props.store.myReports.map((rep) => rep)}
                    contentKey={"spam_domain"}
                  />
                )
              },
              {
                tabName: "사용자 페이지",
                tabIcon: Code,
                tabContent: (
                  <Tasks
                    checkedIndexes={[0]}
                    tasksIndexes={[0, 1]}
                    tasks={website}
                  />
                )
              },
              {
                tabName: "API 서버",
                tabIcon: Cloud,
                tabContent: (
                  <Tasks
                    checkedIndexes={[1]}
                    tasksIndexes={[0, 1, 2]}
                    tasks={server}
                  />
                )
              }
            ]}
          />
        </GridItem>

        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning">

              <h4 className={classes.cardTitleWhite}>
                사용자 활동 통계
              </h4>

              <p className={classes.cardCategoryWhite}>
                신고 횟수 내림차순
              </p>

            </CardHeader>
            <CardBody>
              <Table
                openDetail={handleUserReportOpen}
                tableHeaderColor="warning"
                tableHead={userTableHeadColumns}
                tableData={
                  getUserSortedReportCnt(props.store.users)
                }
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }))

  export default OverviewTables


const userTableHeadColumns = [
  "이름",
  "email",
  "신고 횟수"
]

const defaultReportsCntArray = [
  0, 1, 2, 3, 4, 5, 6
]

const getUserSortedReportCnt = (users) => {

  const refinedUsers = users.map((user) => {
    return {
      ...user,
      reportCnt: user.reports.length
    }
  })

  refinedUsers.sort((a, b) => {
    if (a.reportCnt < b.reportCnt) {
      return 1
    } else if (a.reportCnt > b.reportCnt) {
      return -1
    } else {
      return 0
    }
  })

  return refinedUsers.map((user) => {
    return [
      user.id,
      user.name,
      user.email,
      user.reportCnt
    ]
  }).slice(0, 8)

}


const useStyles = makeStyles(styles);
