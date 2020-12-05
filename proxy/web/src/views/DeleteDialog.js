import React from 'react';
import { observer, inject } from "mobx-react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// require('dotenv').config();

const DeleteDialog = inject("store")(
	observer((props) => {

		const handleClose = () => {
			props.store.set(
				"isDeleteDialogOpen",
				false
			)
		}

		const handleLocationDelete = async () => {

			try {

				const response = await fetch(
					`${props.store.backendUrl}/reports/${props.store.deleteReport.id}`,
					{
						headers: {
							'Authorization': `Bearer ${props.store.accessToken}`
						},
						method: "DELETE"
					}
				)

				if (response.ok) {
					props.store.set(
						"snackbarMsg",
						'신고 내역 삭제 성공'
					)

					props.store.set(
						"snackbarInfoOpen",
						true
					)

					const remained = props.store.myReports.filter(
						(rep) => rep.id != props.store.deleteReport.id
					)

					props.store.set(
						"myReports",
						remained
					)

				} else {
					props.store.set(
						"snackbarMsg",
						`신고내역 삭제 실패`
					)

					props.store.set(
						"snackbarErrorOpen",
						true
					)
				}

			} catch (err) {

				props.store.set(
					"snackbarMsg",
					`신고내역 삭제 실패`
				)

				props.store.set(
					"snackbarErrorOpen",
					true
				)
			}
		}

		return (
			<div>
				{props.store.isDeleteDialogOpen &&
					<Dialog
						open={props.store.isDeleteDialogOpen}
						onClose={handleClose}
						style={{
							minWidth: 350
						}}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description"
					>
						<DialogTitle id="alert-dialog-title">
							{`신고 내역 삭제`}
						</DialogTitle>

						<div style={{
							flex: "1 1 auto",
							padding: "8px 24px",
							overflowY: "auto",
						}}>
							<div style={{
								fontSize: "1rem",
								fontWeight: 400,
								lineHeight: 1.5,
								letterSpacing: "0.00938em",
								margin: 0,
								marginBottom: 12,
								color: "rgba(0,0,0,0.84)"
							}}>

								<div>
									{`👮‍♀️신고 도메인 : ${props.store.deleteReport.spam_domain}`}
								</div>
								<div style={{ marginTop: 10 }}>
									{`✉️ 신고 제목 : ${props.store.deleteReport.title}`}
								</div>
								<div style={{ marginTop: 10 }}>
									해당 신고 내역을 정말로 삭제하시겠습니까?
                </div>
							</div>

						</div>

						<DialogActions>
							<Button
								onClick={handleClose}
								color="primary">
								취소
              </Button>
							<Button
								onClick={handleLocationDelete}
								color="primary"
								autoFocus>
								삭제
              </Button>
						</DialogActions>
					</Dialog>}
			</div>
		);
	}))

export default DeleteDialog;
