import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button'
import TablePaginationAction from './TablePaginationAction'
import TextFieldsIcon from '@material-ui/icons/TextFields';
import ImageIcon from '@material-ui/icons/Image';
import DeleteIcon from '@material-ui/icons/Delete';
import BlurOnIcon from '@material-ui/icons/BlurOn';
import { observer, inject } from "mobx-react";
import { IconButton } from "@material-ui/core";
import TableHead from '@material-ui/core/TableHead';


const ReportsTable = inject("store")(
	observer((props) => {
		const classes = useStyles();

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

		const handleOpenDetailModal = (id) => () => {
			props.store.set(
				"detailReportId",
				id
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
				"isDeleteReportOpen",
				true
			)
		}

		const columns = [
			{ label: '번호', align: 'center', width: 'unset' },
			{ label: '신고 도메인', align: 'left', width: 300 },
			{
				id: 'population',
				label: '제목',
				align: 'center',
				width: 150,
			},
			{
				id: 'size',
				label: '신고 시각',
				align: 'center',
				width: 75,
			},
			{
				id: 'density',
				label: ' ',
			},
		]

		return (

			<Table
				className={classes.table}
				aria-label="custom pagination table">

				<TableHead>
					<TableRow>
						{columns.reduce((prev, column, idx) => {
							if (column.label == "제목") {
								if (props.overview != undefined) {
									return prev
								}
							}

							prev.push(
								<TableCell
									key={idx}
									align={column.align}
									style={{ width: column.width }}
								>
									{column.label}
								</TableCell>
							)

							return prev
						}, [])}
					</TableRow>
				</TableHead>

				<TableBody>
					{getSlicedRows(
						props.reports,
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
										{props.overview == undefined &&
											<TableCell />
										}
									</TableRow>
								)

							} else {

								const curDate = new Date(row.created_time)

								return <TableRow key={idx}>

									<TableCell align={columns[0].align}>
										{row.id}
									</TableCell>

									<TableCell
										style={{
											width: columns[1].width,
										}}
										align={columns[1].align}>
										<Button
											style={{
												padding: 'unset',
												textTransform: 'unset'
											}}
											onClick={
												handleOpenDetailModal(
													row.id
												)}>
											{row.spam_domain.length > 40 ?
												row.spam_domain.substring(0, 40) + "..."
												:
												row.spam_domain
											}
										</Button>
									</TableCell>


									{props.overview == undefined &&
										<TableCell
											style={{
												width: columns[2].width,
											}}
											align={columns[2].align}>
											<Button
												style={{
													padding: 'unset',
													textTransform: 'unset',
													minWidth: 'unset'
												}}
												onClick={
													handleOpenDetailModal(
														row.id
													)}>
												{row.title}
											</Button>
										</TableCell>
									}

									<TableCell
										align={columns[3].align}
										style={{
											width: columns[3].width,
											fontSize: '0.8em'
										}}>

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
							count={props.reports.length}
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

const rowsPerPageOptions = [
	10, 
	15, 
	20, 
	{ label: 'All', value: -1 }
]


const useStyles = makeStyles({
	table: {
		minHeight: 460
	},
});