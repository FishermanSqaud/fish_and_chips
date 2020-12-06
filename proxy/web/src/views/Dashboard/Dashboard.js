import React, { useEffect, useState } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Info from "components/Typography/Info.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import { bugs, website, server } from "variables/general.js";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { observer, inject } from "mobx-react";
import { CircularProgress } from "@material-ui/core";
import { conditionalExpression } from "@babel/types";

const useStyles = makeStyles(styles);

const Dashboard = inject("store")(
  observer((props) => {

    const [lastReportDate, setLastReportDate] = useState(new Date())

    useEffect(() => {

      if (!props.store.loadingMyReport && props.store.myReports.length > 0) {
        const lastReport = props.store.myReports[props.store.myReports.length - 1]
        setLastReportDate(new Date(lastReport.created_time))
      }

    }, [props.store.loadingMyReport])

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
      <div>
        <GridContainer>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <Icon>content_copy</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>서버 용량</p>
                <h3 className={classes.cardTitle}>
                  1/50 <small>GB</small>
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Info>
                    <InfoOutlinedIcon />
                  </Info>
                  여유가 있습니다
              </div>
              </CardFooter>
            </Card>
          </GridItem>

          <GridItem xs={12} sm={6} md={3}>
            <Card>

              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <ReportProblemOutlinedIcon></ReportProblemOutlinedIcon>
                </CardIcon>
                <p className={classes.cardCategory}>신고 내역</p>

                {props.store.loadingMyReport ?
                  "불러오는 중"
                  :
                  <h3 className={classes.cardTitle}>
                    {props.store.myReports.length}
                  </h3>
                }

              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <LocalOffer />

                  {props.store.loadingMyReport ?
                    "불러오는 중"
                    :
                    `마지막 신고 시각 : ${lastReportDate.toLocaleDateString()}`
                  }

                </div>
              </CardFooter>
            </Card>
          </GridItem>


          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <Accessibility />
                </CardIcon>
                <p className={classes.cardCategory}>총 사용자</p>
                <h3 className={classes.cardTitle}>
                  {props.store.users.length}
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Update />
                  {`최신 : ${new Date().toLocaleDateString()}`}
              </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>


        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <Card chart>

              <CardHeader color="success">
                <ChartistGraph
                  className="ct-chart"
                  data={dailySalesChart.data}
                  type="Line"
                  options={dailySalesChart.options}
                  listener={dailySalesChart.animation}
                />
              </CardHeader>

              <CardBody>
                <h4 className={classes.cardTitle}>일일 트래픽</h4>
                <p className={classes.cardCategory}>
                  <span className={classes.successText}>
                    <ArrowUpward className={classes.upArrowCardCategory} /> 1%
                </span>{" "}
                  증가율
              </p>
              </CardBody>

              <CardFooter chart>
                <div className={classes.stats}>
                  <AccessTime /> updated 2 days ago
              </div>
              </CardFooter>

            </Card>
          </GridItem>


          <GridItem xs={12} sm={12} md={4}>
            <Card chart>

              <CardHeader color="warning">

                {props.store.loadingMyReport ?
                  <CircularProgress></CircularProgress>
                  :
                  <ChartistGraph
                    className="ct-chart"
                    data={getReportCntInWeek(props.store.myReports)}
                    type="Bar"
                    options={emailsSubscriptionChart.options}
                    responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                    listener={emailsSubscriptionChart.animation}
                  />
                }
              </CardHeader>

              <CardBody>
                <h4 className={classes.cardTitle}>신고 내역</h4>
                <p className={classes.cardCategory}>지난 1주일</p>
              </CardBody>

              <CardFooter chart>
                <div className={classes.stats}>
                  <AccessTime /> 실시간 반영 중
              </div>
              </CardFooter>

            </Card>
          </GridItem>


          <GridItem xs={12} sm={12} md={4}>
            <Card chart>

              <CardHeader color="danger">
                <ChartistGraph
                  className="ct-chart"
                  data={completedTasksChart.data}
                  type="Line"
                  options={completedTasksChart.options}
                  listener={completedTasksChart.animation}
                />
              </CardHeader>

              <CardBody>
                <h4 className={classes.cardTitle}>처리 신고내역</h4>
                <p className={classes.cardCategory}>지난 1주일</p>
              </CardBody>

              <CardFooter chart>
                <div className={classes.stats}>
                  <AccessTime /> updated 2 days ago
              </div>
              </CardFooter>
            </Card>
          </GridItem>

        </GridContainer>


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
                      tasksIndexes={props.store.myReports.length >= 6 ?
                      [0, 1, 2, 3, 4, 5, 6]
                      :
                      props.store.myReports.map((rep, idx)=> idx)
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
                <h4 className={classes.cardTitleWhite}>사용자 활동 통계</h4>
                <p className={classes.cardCategoryWhite}>
                  신고 횟수 내림차순
              </p>
              </CardHeader>
              <CardBody>
                <Table
                  openDetail={handleUserReportOpen}
                  tableHeaderColor="warning"
                  tableHead={["이름", "email", "신고 횟수"]}
                  tableData={
                    getUserSortedReportCnt(props.store.users)
                  }
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }))

  const getUserSortedReportCnt = (users) => {

    const refinedUsers = users.map((user) => {
      return {
        ...user,
        reportCnt : user.reports.length
      }
    })

    refinedUsers.sort((a, b)=>{
      if (a.reportCnt < b.reportCnt){
        return 1
      } else if (a.reportCnt > b.reportCnt){
        return -1
      }else {
        return 0
      }
    })

    return refinedUsers.map((user)=>{
      return [
        user.id,
        user.name,
        user.email,
        user.reportCnt
      ]
    }).slice(0, 8)

  }

export default Dashboard


const dateDiffInDays = (a, b) => {

  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  return Math.floor((utc2 - utc1) / MS_PER_DAY);
}


const arrayRotate = (arr, count) => {
  count -= arr.length * Math.floor(count / arr.length);
  arr.push.apply(arr, arr.splice(0, count));
  return arr;
}


const getReportCntInWeek = (reports) => {
  const curDate = new Date()

  let labels = ["일", "월", "화", "수", "목", "금", "토"]

  labels[curDate.getDay()] += "\n(오늘)"

  const reportsCnt = reports.reduce((total, rep) => {

    const repDate = new Date(rep.created_time)
    const daysDiff = dateDiffInDays(curDate, repDate)

    if (daysDiff <= 7) {
      total[repDate.getDay()] += 1
    }

    return total

  }, [0, 0, 0, 0, 0, 0, 0])

  const series = arrayRotate(reportsCnt, 7 - (6 - curDate.getDay()))
  const rotatedLabels = arrayRotate(labels, 7 - (6 - curDate.getDay()))

  return {
    labels: rotatedLabels,
    series: [series]
  }
}
