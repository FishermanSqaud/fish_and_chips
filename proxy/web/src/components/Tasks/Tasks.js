import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
// @material-ui/icons
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Check from "@material-ui/icons/Check";
// core components
import styles from "assets/jss/material-dashboard-react/components/tasksStyle.js";
import { observer, inject } from "mobx-react";

const useStyles = makeStyles(styles);

const Tasks = inject("store")(
  observer((props) => {

    const classes = useStyles();

    const [checked, setChecked] = React.useState([...props.checkedIndexes]);

    const handleToggle = taskIdx => {
      const currentIndex = checked.indexOf(taskIdx);
      const newChecked = [...checked];

      if (currentIndex === -1) {
        newChecked.push(taskIdx);
      } else {
        newChecked.splice(currentIndex, 1);
      }

      setChecked(newChecked);
    };

    const { tasksIndexes, tasks, rtlActive } = props;

    const tableCellClasses = classnames(classes.tableCell, {
      [classes.tableCellRTL]: rtlActive
    });


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

    const handleOpenDeleteDialog = (targetReport) => () => {

      props.store.set(
        "deleteReport",
        targetReport
      )

      props.store.set(
        "isDeleteDialogOpen",
        true
      )
    }


    return (
      <Table className={classes.table}>
        <TableBody>
          {tasksIndexes.map(taskIdx => (
            <TableRow key={taskIdx} className={classes.tableRow}>
              <TableCell className={tableCellClasses}>
                <Checkbox
                  checked={checked.indexOf(taskIdx) !== -1}
                  tabIndex={-1}
                  onClick={() => handleToggle(taskIdx)}
                  checkedIcon={<Check className={classes.checkedIcon} />}
                  icon={<Check className={classes.uncheckedIcon} />}
                  classes={{
                    checked: classes.checked,
                    root: classes.root
                  }}
                />
              </TableCell>
              <TableCell className={tableCellClasses}>
                {typeof (tasks[taskIdx]) == 'object' ?
                  tasks[taskIdx][props.contentKey]
                  :
                  tasks[taskIdx]
                }
              </TableCell>

              <TableCell className={classes.tableActions}>
                <Tooltip
                  id="tooltip-top"
                  title="빠른 수정"
                  placement="top"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <IconButton
                    aria-label="Edit"
                    onClick={
                      typeof (tasks[taskIdx]) == 'object' ?
                        handleOpenDetail(tasks[taskIdx].id)
                        :
                        null
                    }
                    className={classes.tableActionButton}
                  >
                    <Edit
                      className={
                        classes.tableActionButtonIcon + " " + classes.edit
                      }
                    />
                  </IconButton>
                </Tooltip>

                <Tooltip
                  id="tooltip-top-start"
                  title="빠른 삭제"
                  placement="top"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <IconButton
                    aria-label="Close"
                    onClick={
                      typeof (tasks[taskIdx]) == 'object' ?
                        handleOpenDeleteDialog(tasks[taskIdx])
                        :
                        null
                    }
                    className={classes.tableActionButton}
                  >
                    <Close
                      className={
                        classes.tableActionButtonIcon + " " + classes.close
                      }
                    />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }))

export default Tasks

Tasks.propTypes = {
  tasksIndexes: PropTypes.arrayOf(PropTypes.number),
  tasks: PropTypes.arrayOf(PropTypes.node),
  rtlActive: PropTypes.bool,
  checkedIndexes: PropTypes.array
};
