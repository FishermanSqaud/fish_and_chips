import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { observer, inject } from "mobx-react";
import { CircularProgress, IconButton } from "@material-ui/core";
import ReportDetailDialog from '../ReportDetailDialog'
import DeleteReportDialog from '../DeleteReportDialog'
import DeleteIcon from '@material-ui/icons/Delete';



const TableList = inject("store")(
  observer((props) => {

    const classes = useStyles();

    const handleOpenDetail = (targetRepId) => () => {

      props.store.set(
        "detailReportId",
        targetRepId
      )

      props.store.set(
        "isReportDetailDialogOpen",
        true
      )
    }

    const handleOpenDeleteDialog = (targetReport) => (e) => {

      e.stopPropagation()

			props.store.set(
				"deleteReport",
				targetReport
			)

			props.store.set(
				"isDeleteReportOpen",
				true
      )
		}

    return (
      <React.Fragment>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>피싱 신고 내역</h4>
                <p className={classes.cardCategoryWhite}>
                  {`업데이트 - ${new Date().toLocaleDateString()}`}
                </p>
              </CardHeader>
              <CardBody>
                {props.store.loadingMyReport ?
                  <CircularProgress />
                  :
                  <Table
                    openDetail={handleOpenDetail}
                    tableHeaderColor="primary"
                    tableHead={["신고 도메인", "제목", "사용자", "신고 시각", "삭제"]}
                    tableData={props.store.myReports.map((rep) => {
                      return [
                        rep.id,
                        rep.spam_domain,
                        rep.title,
                        rep.user_id,
                        new Date(rep.created_time).toLocaleDateString(),
                        <IconButton onClick={handleOpenDeleteDialog(rep)}>
                          <DeleteIcon ></DeleteIcon>
                        </IconButton>
                      ]
                    })}
                  />
                }
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>

      </React.Fragment>

    );
  }))

export default TableList

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

const useStyles = makeStyles(styles);