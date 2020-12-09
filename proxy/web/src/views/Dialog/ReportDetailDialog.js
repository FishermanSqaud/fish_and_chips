import React, { useRef, useState, useEffect } from "react";
import { observer, inject } from "mobx-react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField"
// require('dotenv').config();

const ReportDetailDialog = inject("store")(
	observer((props) => {

		const [isEditMode, setIsEditMode] = useState(false)

		let report = props.store.myReports.find(rep => {
			return rep.id == props.store.detailReportId
		})

		const [inputTitle, setInputTitle] = useState(report.title)
		const [inputContent, setInputContent] = useState(report.content)

		const classes = useStyles()

		const isOkToRequestUpdate = () => {

			return (inputTitle != "") && (inputContent != "")
		}

		const ENTER_KEY_CODE = 13

		const enterSubmit = (e) => {
			if (e.keyCode == ENTER_KEY_CODE) {
				const submitBtn = document.getElementById("submit")
				submitBtn.click()
			}
		}

		useEffect(() => {

			if (isEditMode) {
				window.addEventListener('keyup', enterSubmit)
			} else {
				window.removeEventListener('keyup', enterSubmit)
			}

			return function cleanup() {
				window.removeEventListener('keyup', enterSubmit)
			}

		}, [isEditMode])

		const switchToEditMode = () => {
			setIsEditMode(!isEditMode)
		}

		const handleUpdateReport = async () => {

			try {

				if (!isOkToRequestUpdate()) {
					props.store.set(
						"snackbarWarningOpen",
						true
					)
					return
				}

				const requestBody = {
					title: inputTitle,
					content: inputContent
				}

				const response = await fetch(
					`${props.store.backendUrl}/reports/${report.id}`,
					{
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${props.store.accessToken}`
						},
						body: JSON.stringify(requestBody)
					},
				)

				if (response.ok) {

					props.store.getMyReports()

					props.store.set(
						"snackbarMsg",
						"신고 내역 수정 완료"
					)

					props.store.set(
						"snackbarInfoOpen",
						true
					)

					switchToEditMode()

				} else {

					props.store.set(
						"snackbarMsg",
						"신고 내역 수정 실패"
					)

					props.store.set(
						"snackbarErrorOpen",
						true
					)
				}

			} catch (err) {
				console.log(err)

				props.store.set(
					"snackbarMsg",
					"신고 내역 수정 실패"
				)

				props.store.set(
					"snackbarErrorOpen",
					true
				)
			}

			props.store.set(
				"isReportDetailDialogOpen",
				false
			)
		}

		const handleInput = (valueSetter, type) => (e) => {
			valueSetter(type(e.target.value))
		}

		const handleClose = () => {
			props.store.set(
				"isReportDetailDialogOpen",
				false
			)
		}

		return (
			<Dialog
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
				open={props.store.isReportDetailDialogOpen}
				onClose={handleClose}
				className={classes.dialog}
				classes={{ paperScrollPaper: classes.dialog }}
			>
				<div
					className={classes.dialogTitle}>
					<div className={classes.newsTitle}>
						{`신고내역 상세보기`}
					</div>
					<div className={classes.newsTime}>
						{`신고 시각 : 
							${showCreatedTime(new Date(report.created_time))}
						`}
					</div>
				</div>

				<DialogContent
					className={classes.dialogContent}
					dividers>

					<div>

						<div>
							<TextField
								disabled
								className={classes.textFieldTop}
								id="standard-required"
								label="신고 도메인"
								defaultValue={report.spam_domain}
							/>

						</div>

						<div>
							<TextField
								disabled={!isEditMode}
								required
								className={classes.textFieldElse}
								id="standard-required"
								label="제목"
								defaultValue={report.title}
								onChange={handleInput(
									setInputTitle,
									String
								)}
							/>

						</div>
						<div>
							<TextField
								disabled={!isEditMode}
								required
								id="standard-number"
								className={classes.textFieldElse}
								label="본문"
								defaultValue={report.content}
								onChange={handleInput(
									setInputContent,
									String
								)}
							/>
						</div>

					</div>
				</DialogContent>

				<DialogActions className={classes.dialogActions}>
					<Button
						className={classes.button}
						onClick={handleClose}>
						닫기
        			</Button>

					{isEditMode ?
						<Button
							id="submit"
							className={classes.button}
							onClick={handleUpdateReport}>
							저장
        				</Button>
						:
						<Button
							className={classes.button}
							onClick={switchToEditMode}>
							수정
						</Button>
					}
				</DialogActions>
			</Dialog>
		)
	}))

export default ReportDetailDialog

const showCreatedTime = (date) => {
	return date.toLocaleDateString() + " " + date.toLocaleTimeString()
}

const useStyles = makeStyles((theme) => ({
	textFieldTop: {
		width: '80%',
	},
	textFieldElse: {
		width: '80%',
		marginTop: 20
	},
	paper: {
		position: "absolute",
		width: "500px",
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2),
		display: "flex",
		justifyContent: "center",
		flexDirection: "column",
	},
	formControl: {
		width: "100%",
		display: "flex",
		justifyContent: "center",
	},
	button: {
		// marginBottom: theme.spacing(1),
		background: "white",
		color: "black",
		padding: theme.spacing(1, 1),
	},
	create: {
		backgroundColor: "#182848",
		color: "white",
		transitionProperty: "all",
		"&:hover": {
			transitionDuration: "0.5s",
			transform: "translateY(-5px)",
			backgroundColor: "#182848",
		},
	},
	dialog: {
		minWidth: 400,
		minHeight: 480,
		position: "unset",

	},
	dialogTitle: {
		display: 'flex',
		flexDirection: 'column',
		flex: '0 0 auto',
		margin: 0,
		padding: '16px 24px 3px',
		fontSize: '1.25rem',
	},
	newsTitle: {
	},
	newsTime: {
		fontWeight: 300,
		fontSize: '0.6em',
	},
	dialogContent: {
		display: "flex",
		flexDirection: "column",
		paddingTop: 30
	},
	dialogActions: {
		padding: "6px 8px",
	},
}));

const dialogTitleStyle = {
	display: 'flex',
	alignItems: 'baseline'
}