import React, { useRef, useState, useEffect } from "react";
import { observer, inject } from "mobx-react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from '@material-ui/icons/Close'
import ReportsTable from "./ReportsTable";
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import CachedIcon from '@material-ui/icons/Cached';


const MyReportDialog = inject("store")(
	observer((props) => {

		const classes = useStyles()
		const [isLoading, setIsLoading] = useState(false)

		const handleClose = () => {
			props.store.set(
				"isMyReportOpen",
				false
			)
		}

		const handleRefresh = () => {

			setIsLoading(true)

			props.store.getMyReports()

			setIsLoading(false)
		}


		return (
			<React.Fragment>

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
								{"name" in props ?
									props.name
									:
									`나`
								}
								의 신고내역
							</div>

							{isLoading ? 
								<CircularProgress></CircularProgress>
							:
								<IconButton onClick={handleRefresh}>
									<CachedIcon />
								</IconButton>
							}

							<IconButton onClick={handleClose}>
								<CloseIcon />
							</IconButton>
						</div>
					</div>

					<ReportsTable
						reports={props.reports}
					></ReportsTable>

				</Dialog>

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