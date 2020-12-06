import React from "react";
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

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();
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
              <h3 className={classes.cardTitle}>8</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <LocalOffer />
                업데이트 예정
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
              <p className={classes.cardCategory}>신규 사용자</p>
              <h3 className={classes.cardTitle}>+1</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                업데이트 예정
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
                <AccessTime /> updated 4 minutes ago
              </div>
            </CardFooter>

          </Card>
        </GridItem>


        <GridItem xs={12} sm={12} md={4}>
          <Card chart>

            <CardHeader color="warning">
              <ChartistGraph
                className="ct-chart"
                data={emailsSubscriptionChart.data}
                type="Bar"
                options={emailsSubscriptionChart.options}
                responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                listener={emailsSubscriptionChart.animation}
              />
            </CardHeader>

            <CardBody>
              <h4 className={classes.cardTitle}>신고 내역</h4>
              <p className={classes.cardCategory}>지난 1주일</p>
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
                    checkedIndexes={[0, 3]}
                    tasksIndexes={[0, 1, 2, 3]}
                    tasks={bugs}
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
              <h4 className={classes.cardTitleWhite}>사용자 통계</h4>
              <p className={classes.cardCategoryWhite}>
                사용자 활동 통계
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="warning"
                tableHead={["ID", "이름", "email", "신고 횟수"]}
                tableData={[
                  ["5", "테스트맨", "test@gmail.com", "10"],
                  ["3", "헬로맨101", "hello@naver.com", "5"],
                  ["1", "맹클론", "maeng@gmail.com", "3"],
                  ["9", "테스트100", "test100@gmail.com", "2"]
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
