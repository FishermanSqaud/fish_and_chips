import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button'
import TablePaginationAction from './TablePaginationAction'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextFieldsIcon from '@material-ui/icons/TextFields';
import ImageIcon from '@material-ui/icons/Image';
import DeleteIcon from '@material-ui/icons/Delete';
import BlurOnIcon from '@material-ui/icons/BlurOn';
import { observer, inject } from "mobx-react";
import { IconButton } from "@material-ui/core";


const ReportsTable = inject("store")(
	observer((props) => {
		const classes = useStyles();

		const [isLoading, setIsLoading] = useState(false)

		const handleChangePage = (e, newPageNum) => {
			props.store.set(
				"reportsTablePageNum",
				newPageNum
			)
		};

		const handleChangeRowsPerPage = (e) => {

			handleChangePage(null, 0)

			const newRowsPerPage = parseInt(e.target.value, 10)

			props.store.set(
				"reportsRowsPerPage",
				newRowsPerPage
			);
		};

		const handleOpenDetailModal = (key) => () => {
			props.store.set(
				"detaulReportKey",
				key
			)
			props.store.set(
				"isReportDetailDialogOpen",
				true
			)
		}

		const showDataTypeIcon = (type) => {

			switch (Number(type)) {
				case props.store.FILTER_TEXT:
					return <TextFieldsIcon color="primary"/>

				case props.store.FILTER_OBJECT:
					return <BlurOnIcon color="secondary"/>

				case props.store.FILTER_IMAGE:
					return <ImageIcon style={{
						color: 'lightseagreen'
					}}/>

				default:
					return type
			}
		}

		const handleOpenDeleteDialog = (targetLocation) => () => {

			props.store.set(
				"deleteReport",
				targetLocation
			)

			props.store.set(
				"isDeleteDialogOpen",
				true
			)
		}

		const getFilteredLocations = (locations, filterType, search) => {
			return locations.filter((row) => {
				switch (filterType) {
					case props.store.FILTER_ALL:
						return true

					default:
						return row.type == filterType
				}
			}).filter(row => {
				if (search == "") {
					return true
				} else {
					return row.message.toLowerCase().indexOf(search) > -1
				}
			})
		}

		return (

			<Table
				className={classes.table}
				aria-label="custom pagination table">

				<TableBody>
					{isLoading ?
						<CircularProgress />
						:
						getSlicedRows(
							getFilteredLocations(
								props.store.allLocations,
								props.store.tableFilter,
								props.store.tableSearch
							),
							props.store.reportsTablePageNum,
							props.store.reportsRowsPerPage
						)
							.map((row, idx) => {

								if (row.key == DUMMY_ROW_KEY) {

									return (
										<TableRow
											style={{ height: 81 }}
											key={idx}>
											<TableCell />
											<TableCell />
											<TableCell />
											<TableCell />
										</TableRow>
									)

								} else {

									const curDate = new Date(row.createdTime)

									return <TableRow key={idx}>

										<TableCell
											component="th"
											scope="row"
											style={{
												width: 70,
												textAlign: 'center'
											}}>
											{showDataTypeIcon(row.type)}
										</TableCell>

										<TableCell>
											<Button
												onClick={
													handleOpenDetailModal(
														row.key
													)}>
												{row.message}
											</Button>
										</TableCell>

										<TableCell
											style={{
												width: 150,
												fontSize: '0.8em'
											}}
											align="right">

											<div style={{
												textAlign: 'center'
											}}>
												{curDate.toLocaleDateString()}
											</div>

											<div style={{
												textAlign: 'center'
											}}>
												{curDate.toLocaleTimeString()}
											</div>
										</TableCell>

										<TableCell style={{ width: 50 }}>
											<IconButton
												onClick={
													handleOpenDeleteDialog(row)
												}
												style={{ width: '100%' }}>
												<DeleteIcon></DeleteIcon>
											</IconButton>
										</TableCell>

									</TableRow>
								}
							})}
				</TableBody>

				<TableFooter>
					<TableRow>
						<TablePagination
							rowsPerPageOptions={rowsPerPageOptions}
							colSpan={4}
							count={getFilteredLocations(
								props.store.allLocations,
								props.store.tableFilter,
								props.store.tableSearch,
							).length}
							rowsPerPage={props.store.reportsRowsPerPage}
							page={props.store.reportsTablePageNum}
							SelectProps={{
								inputProps: { 'aria-label': 'wassup' },
								native: true,
							}}
							labelRowsPerPage={"리스트 행 개수"}
							onChangePage={handleChangePage}
							onChangeRowsPerPage={handleChangeRowsPerPage}
							ActionsComponent={TablePaginationAction}
						/>
					</TableRow>
				</TableFooter>
			</Table>
		)
	}))

export default ReportsTable

const DUMMY_ROW_KEY = ' '

const getSlicedRows = (rows, curPageNum, rowsPerPage) => {

	let resultRows = rows.slice(
		curPageNum * rowsPerPage,
		curPageNum * rowsPerPage + rowsPerPage
	)

	if (rowsPerPage > resultRows.length) {

		let tmpRows = new Array(rowsPerPage - resultRows.length)
			.fill({
				key: DUMMY_ROW_KEY
			})

		return resultRows.concat(tmpRows)
	}

	return resultRows
}

const rowsPerPageOptions = [10, 15, 20, { label: 'All', value: -1 }]


const useStyles = makeStyles({
	table: {
		minHeight: 460
	},
});