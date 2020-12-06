import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button'
import TablePaginationAction from './index-sections/TablePaginationAction'
import CircularProgress from '@material-ui/core/CircularProgress'
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

		const showDataTypeIcon = (type) => {

			switch (Number(type)) {
				case props.store.FILTER_TEXT:
					return <TextFieldsIcon color="primary" />

				case props.store.FILTER_OBJECT:
					return <BlurOnIcon color="secondary" />

				case props.store.FILTER_IMAGE:
					return <ImageIcon style={{
						color: 'lightseagreen'
					}} />

				default:
					return type
			}
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
						{columns.map((column, idx) => (
							<TableCell
								key={idx}
								align={column.align}
								style={{ width: column.width }}
							>
								{column.label}
							</TableCell>
						))}
					</TableRow>
				</TableHead>

				<TableBody>
					{getSlicedRows(
						props.store.myReports,
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
											row.spam_domain.substring(0,40) + "..."
											:
											row.spam_domain
											}
										</Button>
									</TableCell>

									<TableCell
										style={{
											width: columns[2].width,
										}}
										align={columns[2].align}>
										<Button
											style={{
												padding: 'unset',
												textTransform: 'unset',
												minWidth : 'unset'
											}}
											onClick={
												handleOpenDetailModal(
													row.id
												)}>
											{row.title}
										</Button>
									</TableCell>

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
							count={props.store.myReports.length}
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