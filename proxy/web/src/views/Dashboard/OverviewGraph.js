import React from "react";
import ChartistGraph from "react-chartist";
import { makeStyles } from "@material-ui/core/styles";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { observer, inject } from "mobx-react";
import { CircularProgress } from "@material-ui/core";
import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const OverviewGraph = inject("store")(
  observer((props) => {

    const classes = useStyles();

    return (

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

              <h4 className={classes.cardTitle}>
                일일 트래픽
                </h4>

              <p className={classes.cardCategory}>
                <span className={classes.successText}>

                  <ArrowUpward
                    className={classes.upArrowCardCategory} />

                  {"1%"}
                </span>
                {" 증가율"}
              </p>

            </CardBody>

            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime />
                {"updated 2 days ago"}
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
                  data={
                    getReportCntInWeek(props.store.myReports)
                  }
                  type="Bar"
                  options={
                    emailsSubscriptionChart.options
                  }
                  listener={
                    emailsSubscriptionChart.animation
                  }
                  responsiveOptions={
                    emailsSubscriptionChart.responsiveOptions
                  }
                />
              }
            </CardHeader>

            <CardBody>

              <h4 className={classes.cardTitle}>
                신고 내역
                </h4>

              <p className={classes.cardCategory}>
                지난 1주일
                </p>

            </CardBody>

            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime />
                {"실시간 반영 중"}
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

              <h4 className={classes.cardTitle}>
                처리 신고내역
                </h4>

              <p className={classes.cardCategory}>
                지난 1주일
                </p>

            </CardBody>

            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime />
                {"updated 2 days ago"}
              </div>
            </CardFooter>
          </Card>
        </GridItem>

      </GridContainer>
    );
  }))

export default OverviewGraph

const useStyles = makeStyles(styles);

const isReportReady = (store) => {
  return (!store.loadingMyReport) && (store.myReports.length > 0)
}

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
