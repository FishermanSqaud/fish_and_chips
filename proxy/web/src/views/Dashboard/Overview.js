import React, { useEffect, useState } from "react";
import ChartistGraph from "react-chartist";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
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
import { observer, inject } from "mobx-react";
import { CircularProgress } from "@material-ui/core";
import { website, server } from "variables/general.js";
import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";



const Overview = inject("store")(
  observer((props) => {
    
    const classes = useStyles();
    const [lastReportDate, setLastReportDate] = useState(new Date())

    useEffect(() => {

      if (isReportReady(props.store)) {

        const lastIdx = props.store.myReports.length - 1
        const lastReport = props.store.myReports[lastIdx]
        setLastReportDate(new Date(lastReport.created_time))

      }

    }, [props.store.loadingMyReport])


    return (
        <GridContainer>
          <GridItem xs={12} sm={6} md={3}>

            <Card>
              <CardHeader color="info" stats icon>
                
                <CardIcon color="info">
                  <Icon>content_copy</Icon>
                </CardIcon>

                <p className={classes.cardCategory}>
                  서버 용량
                </p>

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
                  <ReportProblemOutlinedIcon/>
                </CardIcon>

                <p className={classes.cardCategory}>
                  신고 내역
                </p>

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

                <p className={classes.cardCategory}>
                  총 사용자
                </p>

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
    );
  }))

export default Overview

const useStyles = makeStyles(styles);

const isReportReady = (store) => {
  return (!store.loadingMyReport) && (store.myReports.length > 0)
}