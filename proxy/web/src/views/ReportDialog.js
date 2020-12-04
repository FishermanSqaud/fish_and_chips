import React, { useRef, useState, useEffect } from "react";
import { observer, inject } from "mobx-react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField"
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
// require('dotenv').config();

const PAYMENT = 0
const PERSONAL_INFO = 1
const ETC = 2

const CreateDialog = inject("store")(
	observer((props) => {
		const [inputType, setInputType] = useState(PAYMENT)

		const [reportDomain, setReportDomain] = useState(props.store.reportDomain)		
		const [inputTitle, setInputTitle] = useState("")
		const [inputContent, setInputContent] = useState("")

		const [domainErr, setDomainErr] = useState(false)
		const [inputTitleErr, setInputTitleErr] = useState(false)
		const [inputContentErr, setInputContentErr] = useState(false)


		useEffect(() => {
			const domain = localStorage.getItem("spam_domain")

			if (domain) {
				setReportDomain(domain)
			}
		}, [])

		const classes = useStyles()

		const makeRequestJsonBody = (domain, title, content) => {

			return {
				spam_domain : domain,
				user_id : props.store.userId,
				title : title,
				content : content
			}
		}

		const stringInputCheck = (str) => {
			return str == null || str == undefined || str == ""
		}

		const isOkToRequestReport = () => {

			if (stringInputCheck(reportDomain)) {
				props.store.set(
					"snackbarMsg",
					"신고 도메인을 입력해주세요"
				)
				return false
			}

			if (stringInputCheck(inputTitle)) {
				props.store.set(
					"snackbarMsg",
					"제목을 입력해주세요"
				)
				return false
			}

			if (stringInputCheck(inputContent)) {
				props.store.set(
					"snackbarMsg",
					"내용을 입력해주세요"
				)
				return false
			}

			return true
		}

		const handleReport = async () => {

			try {
				const backendUrl = process.env.REACT_APP_BACKEND_URL

				if (!isOkToRequestReport()) {
					props.store.set(
						"snackbarWarningOpen",
						true
					)
					return
				}

				const requestBody = makeRequestJsonBody(
					reportDomain,
					inputTitle,
					inputContent,
				)

				const response = await fetch(
					`${backendUrl}/reports`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(requestBody)
					},
				)

				console.log("신고 결과 ", response)

				if (response.ok) {

					props.store.set(
						reportDomain,
						null
					)

					props.store.set(
						"snackbarMsg",
						"신고가 접수되었습니다."
					)

					props.store.set(
						"snackbarInfoOpen",
						true
					)

				} else {

					props.store.set(
						"snackbarMsg",
						"신고가 실패했습니다"
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
					"신고가 실패했습니다"
				)

				props.store.set(
					"snackbarErrorOpen",
					true
				)
			}

			handleClose()
		}

		const handleInput = (valueSetter, type) =>
			(e) => {
				valueSetter(type(e.target.value))
			}

		const handleClose = () => {
			props.store.set(
				"isReportDialogOpen",
				false
			)
		}
		
		const handleInputTypeChange = (e) => {
			setInputType(Number(e.target.value))
		};

		return (
			<Dialog
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
				open={props.store.isReportDialogOpen}
				onClose={handleClose}
				className={classes.dialog}
				classes={{ paperScrollPaper: classes.dialog }}
			>
				<div
					className={classes.dialogTitle}>
					<div className={classes.newsTitle}>
						{`피싱 의심 신고하기`}
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
							<FormControl 
								classes={{root : classes.select}} 
								className={classes.formControl}>

								<InputLabel htmlFor="age-native-simple">
									피싱 종류
								</InputLabel>
								<Select
									native
									value={inputType}
									onChange={handleInputTypeChange}
									inputProps={{
										name: '신고 종류',
										id: 'age-native-simple',
									}}
								>
									<option value={PAYMENT}>
										결제
									</option>
									<option value={PERSONAL_INFO}>
										개인정보
									</option>
									<option value={ETC}>
										기타
									</option>
								</Select>
							</FormControl>
						</div>
						<div>
							<TextField
								className={classes.textFieldTop}
								id="standard-required"
								label="신고 도메인"
								value={reportDomain}
								onChange={handleInput(
									setReportDomain,
									String
								)}
								error={domainErr}
							/>

						</div>
						<div>
							<TextField
								id="standard-number"
								className={classes.textFieldElse}
								label="제목"
								onChange={handleInput(
									setInputTitle,
									String
								)}
								error={inputTitleErr}
							/>
						</div>

						<div>
							<TextField
								className={classes.textArea}
								classes={{ root : classes.textAreaRoot}}
								id="outlined-multiline-static"
								label="내용"
								multiline
								rows={4}
								variant="outlined"
								onChange={handleInput(
									setInputContent,
									String
								)}
								error={inputContentErr}
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
						onClick={handleReport}>
						신고
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
		width: '90%',
		marginTop: 9
	},
	textFieldElse: {
		width: '90%',
		marginTop: 9
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
	select: {
		width : '90%'
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
	textArea : {
		marginTop : 27,
		width : '90%'
	},
	textAreaRoot : {
		width : '90%'
	}
}));

const dialogTitleStyle = {
	display: 'flex',
	alignItems: 'baseline'
}