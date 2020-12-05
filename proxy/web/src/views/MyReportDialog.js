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
import CloseIcon from '@material-ui/icons/Close'
import ReportsTable from "./ReportsTable";
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import DeleteDialog from "./DeleteDialog";
import DetailDialog from "./DetailDialog";

// require('dotenv').config();

const PAYMENT = 0
const PERSONAL_INFO = 1
const ETC = 2

const ENTER_KEY_CODE = 13

const MyReportDialog = inject("store")(
	observer((props) => {
		const [inputType, setInputType] = useState(PAYMENT)

		const [reportDomain, setReportDomain] = useState(props.store.reportDomain)
		const [inputTitle, setInputTitle] = useState("")
		const [inputContent, setInputContent] = useState("")

		const [domainErr, setDomainErr] = useState(false)
		const [inputTitleErr, setInputTitleErr] = useState(false)
		const [inputContentErr, setInputContentErr] = useState(false)


		const [isLoading, setIsLoading] = useState(true)

		const classes = useStyles()

		useEffect(() => {
			async function init() {

				await props.store.getMyReports()

				setIsLoading(false)
			}

			init()
		}, [])


		const handleClose = () => {
			props.store.set(
				"isMyReportOpen",
				false
			)
		}


		return (
			<React.Fragment>

				{isLoading ?
					<CircularProgress />
					:
					<Dialog
						aria-labelledby="simple-modal-title"
						aria-describedby="simple-modal-description"
						open={props.store.isMyReportOpen}
						onClose={handleClose}
						className={classes.dialog}
						classes={{ paperScrollPaper: classes.dialog }}
					>
						<div
							className={classes.dialogTitle}>
							<div className={classes.newsTitle}>
								<div style={{ width: '100%' }}>
									{`나의 신고내역`}
								</div>

								<IconButton onClick={handleClose}>
									<CloseIcon/>
								</IconButton>
							</div>
						</div>

						<ReportsTable></ReportsTable>

						{props.store.isDeleteDialogOpen &&
							<DeleteDialog />}

						{props.store.isReportDetailDialogOpen &&
							<DetailDialog/>}

					</Dialog>
				}
			</React.Fragment>
		)

	}))

export default MyReportDialog

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
		width: '90%'
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
		maxWidth: "unset"
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
		display: 'flex',
		alignItems: 'center',
		width: '100%'
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
	textArea: {
		marginTop: 27,
		width: '90%'
	},
	textAreaRoot: {
		width: '90%'
	}
}));

const dialogTitleStyle = {
	display: 'flex',
	alignItems: 'baseline'
}