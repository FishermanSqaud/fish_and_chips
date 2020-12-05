import React, { useRef, useState, useEffect } from "react";
import { observer, inject } from "mobx-react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField"
// require('dotenv').config();

const DetailDialog = inject("store")(
	observer((props) => {

		let location = props.store.allLocations.find(eachLocation => {
			return eachLocation.key == props.store.detaulReportKey
		})

		const [inputMsg, setInputMsg] = useState(location.message)
		const [inputLatitude, setInputLatitude] = useState(location.latitude)
		const [inputAltitude, setInputAltitude] = useState(location.altitude)
		const [inputLongitude, setInputLongitude] = useState(location.longitude)
		const [inputMsgErr, setInputMsgErr] = useState(false)
		const [inputLatErr, setInputLatErr] = useState(false)
		const [inputAltErr, setInputAltErr] = useState(false)
		const [inputLongErr, setInputLongErr] = useState(false)

		const classes = useStyles()

		const makeRequestJsonBody = async () => {

			let body = {}

			if (inputMsg != "") {
				body.message = inputMsg
			}
			if (inputLatitude != null) {
				body.latitude = inputLatitude
			}
			if (inputLongitude != null) {
				body.longitude = inputLongitude
			}
			if (inputAltitude != null) {
				body.altitude = inputAltitude
			}

			return body
		}

		const isOkToRequestUpdate = () => {
			if (inputMsgErr) {
				props.store.set(
					"snackbarMsg",
					"메세지가 입력되지 않았습니다."
				)
				return false
			}
			if (inputLatErr) {
				props.store.set(
					"snackbarMsg",
					"위도가 입력되지 않았습니다."
				)
				return false
			}
			if (inputLongErr) {
				props.store.set(
					"snackbarMsg",
					"경도가 입력되지 않았습니다."
				)
				return false
			}
			if (inputAltErr) {
				props.store.set(
					"snackbarMsg",
					"고도가 입력되지 않았습니다."
				)
				return false
			}

			return true
		}

		const handleUpdateLocation = async () => {

			try {
				const targetBaseUrl = process.env.REACT_APP_BACKEND_URL
				const targetUrl = targetBaseUrl + `/${props.store.detaulReportKey}`

				if (!isOkToRequestUpdate()) {
					props.store.set(
						"snackbarWarningOpen",
						true
					)
					return
				}

				const requestBody = await makeRequestJsonBody(
					inputMsg,
					inputLatitude,
					inputAltitude,
					inputLongitude,
				)

				const response = await fetch(
					targetUrl,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(requestBody)
					},
				)

				if (response.ok) {

					props.store.getAllLocationData()

					props.store.set(
						"snackbarMsg",
						"위치 데이터 수정 완료"
					)

					props.store.set(
						"snackbarInfoOpen",
						true
					)

				} else {

					props.store.set(
						"snackbarMsg",
						"위치 데이터 수정 실패"
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
					"위치 데이터 수정 실패"
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

		const handleInput = (errorState, errorSetter, valueSetter, type) =>
			(e) => {
				if (e.target.value == '') {
					errorSetter(true)
					return
				}

				if (errorState) {
					errorSetter(false)
				}

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
						{`상세보기`}
					</div>
					<div className={classes.newsTime}>
						{showCreatedTime(new Date(location.createdTime))}
					</div>
				</div>

				<DialogContent
					className={classes.dialogContent}
					dividers>

					<div>
						<div>
							<TextField
								required
								className={classes.textFieldTop}
								id="standard-required"
								label="메세지"
								defaultValue={location.message}
								onChange={handleInput(
									inputMsgErr,
									setInputMsgErr,
									setInputMsg,
									String
								)}
								error={inputMsgErr}
							/>

						</div>
						<div>
							<TextField
								id="standard-number"
								className={classes.textFieldElse}
								label="위도"
								type="number"
								defaultValue={location.latitude}
								onChange={handleInput(
									inputLatErr,
									setInputLatErr,
									setInputLatitude,
									Number
								)}
								error={inputLatErr}
								InputLabelProps={{
									shrink: true,
								}}
							/>
						</div>

						<div>
							<TextField
								id="standard-number"
								className={classes.textFieldElse}
								label="경도"
								type="number"
								defaultValue={location.longitude}
								onChange={handleInput(
									inputLongErr,
									setInputLongErr,
									setInputLongitude,
									Number
								)}
								error={inputLongErr}
								InputLabelProps={{
									shrink: true,
								}}
							/>
						</div>

						<div>
							<TextField
								id="standard-number"
								className={classes.textFieldElse}
								label="고도"
								type="number"
								defaultValue={location.altitude}
								onChange={handleInput(
									inputAltErr,
									setInputAltErr,
									setInputAltitude,
									Number
								)}
								error={inputAltErr}
								InputLabelProps={{
									shrink: true,
								}}
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

					<Button
						className={classes.button}
						onClick={handleUpdateLocation}>
						수정
        			</Button>
				</DialogActions>
			</Dialog>
		)
	}))

export default DetailDialog

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