import React, { useEffect } from 'react';
import { observer, inject } from "mobx-react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

const DeleteReportDialog = inject("store")(
	observer((props) => {

		useEffect(() => {
			const ENTER_KEY_CODE = 13

			const enterSubmit = (e) => {
				if (e.keyCode == ENTER_KEY_CODE) {
					const submitBtn = document.getElementById("submit")
					submitBtn.click()
				}
			}

			window.addEventListener('keyup', enterSubmit)

			return function cleanup() {
				window.removeEventListener('keyup', enterSubmit)
			}

		}, [])

		const handleClose = () => {
			props.store.set(
				"isDeleteReportOpen",
				false
			)
		}

		const handleReportDelete = async () => {

			try {

				const url = props.store.backendUrl
				const reportId = props.store.deleteReport.id
				
				const response = await fetch(
					`${url}/reports/${reportId}`,
					{
						headers: {
							'Authorization': `Bearer ${props.store.accessToken}`
						},
						method: "DELETE"
					}
				)

				if (response.ok) {


					const accessToken = response.headers.get(
						"Authorization"
					)

					props.store.set(
						"accessToken",
						accessToken
					)

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

			handleClose()
		}

		return (
			<div>
				{props.store.isDeleteReportOpen &&
					<Dialog
						open={props.store.isDeleteReportOpen}
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
								id="submit"
								onClick={handleReportDelete}
								color="primary"
								autoFocus>
								삭제
              </Button>
						</DialogActions>
					</Dialog>}
			</div>
		);
	}))

export default DeleteReportDialog;
