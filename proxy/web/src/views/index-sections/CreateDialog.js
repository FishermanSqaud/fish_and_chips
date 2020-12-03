import React, { useRef, useState, useEffect } from "react";
import { observer, inject } from "mobx-react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField"
import { findSourceMap } from "module";
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
// require('dotenv').config();

const CreateDialog = inject("store")(
	observer((props) => {
		const [inputType, setInputType] = useState(0)
		const [inputMsg, setInputMsg] = useState("")
		const [inputLatitude, setInputLatitude] = useState("")
		const [inputAltitude, setInputAltitude] = useState("")
		const [inputLongitude, setInputLongitude] = useState("")
		const [inputMsgErr, setInputMsgErr] = useState(false)
		const [inputLatErr, setInputLatErr] = useState(false)
		const [inputAltErr, setInputAltErr] = useState(false)
		const [inputLongErr, setInputLongErr] = useState(false)

		const classes = useStyles()

		const makeRequestJsonBody = async (msg, lat, lng, alt) => {

			let body = {}

			if (msg != "") {
				body.message = msg
			}
			if (String(lat) != "") {
				body.latitude = lat
			}
			if (String(lng) != "") {
				body.longitude = lng
			}
			if (String(alt) != "") {
				body.altitude = alt
			}

			body.type = inputType

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

		const handleCreateLocation = async () => {

			try {
				const backendUrl = process.env.REACT_APP_BACKEND_URL

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
					backendUrl,
					{
						method: "POST",
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
						"위치 데이터 생성 성공"
					)

					props.store.set(
						"snackbarInfoOpen",
						true
					)


				} else {

					props.store.set(
						"snackbarMsg",
						"위치 데이터 생성 실패"
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
					"위치 데이터 생성 실패"
				)

				props.store.set(
					"snackbarErrorOpen",
					true
				)
			}

			props.store.set(
				"isCreateDialogOpen",
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
				"isCreateDialogOpen",
				false
			)
		}

		const handleChange = (e) => {
			setInputType(Number(e.target.value))
		};

		return (
			<Dialog
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
				open={props.store.isCreateDialogOpen}
				onClose={handleClose}
				className={classes.dialog}
				classes={{ paperScrollPaper: classes.dialog }}
			>
				<div
					className={classes.dialogTitle}>
					<div className={classes.newsTitle}>
						{`신고하기`}
					</div>
					<div className={classes.newsTime}>
						{showCreatedTime(new Date(Date.now()))}
					</div>
				</div>

				<DialogContent
					className={classes.dialogContent}
					dividers>

					<div>
						<div>
							<FormControl className={classes.formControl}>
								<InputLabel htmlFor="age-native-simple">
									신고 종류
								</InputLabel>
								<Select
									native
									value={inputType}
									onChange={handleChange}
									inputProps={{
										name: '데이터 종류',
										id: 'age-native-simple',
									}}
								>
									<option value={props.store.FILTER_TEXT}>
										피싱
									</option>
									<option value={props.store.FILTER_IMAGE}>
										기타
									</option>
								</Select>
							</FormControl>
						</div>
						<div>
							<TextField
								disabled={true}
								className={classes.textFieldTop}
								id="standard-required"
								label="신고할 사이트"
								placeholder="ex. 명량해전"
							/>

						</div>
						<div>
							<TextField
								id="standard-number"
								className={classes.textFieldElse}
								label="제목"
								type="number"
								placeholder="ex. 37.7"
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
								placeholder="ex. 125.5"
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
								placeholder="ex. 55.5"
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
						onClick={handleCreateLocation}>
						생성
        			</Button>
				</DialogActions>
			</Dialog>
		)
	}))

export default CreateDialog

const showCreatedTime = (date) => {
	return date.toLocaleDateString() + " " + date.toLocaleTimeString()
}

const useStyles = makeStyles((theme) => ({
	textFieldTop: {
		width: '80%',
		marginTop: 9
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
		minHeight: 520,
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
		paddingTop: 35
	},
	dialogActions: {
		padding: "6px 8px",
	},
	formControl: {
		width: '80%'
	},
}));

const dialogTitleStyle = {
	display: 'flex',
	alignItems: 'baseline'
}