import React, { useEffect } from 'react';
import { observer, inject } from "mobx-react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// require('dotenv').config();

const DeleteUserDialog = inject("store")(
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
				"isDeleteUserOpen",
				false
			)
		}

		const handleUserDelete = async () => {

			try {

				const userId = props.store.targetUserForDetails.id

				await props.store.deleteUser(userId)

				props.store.set(
					"targetUserForDetails",
					{}
				  )

				handleClose()

			} catch (e) {

			}
		}

		return (
			<div>
				{props.store.isDeleteUserOpen &&
					<Dialog
						open={props.store.isDeleteUserOpen}
						onClose={handleClose}
						style={{
							minWidth: 350
						}}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description"
					>
						<DialogTitle id="alert-dialog-title">
							{`사용자 탈퇴`}
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
									{`사용자 명 : ${props.store.targetUserForDetails.name}`}
								</div>
								<div style={{ marginTop: 10 }}>
									{`사용자 이메일 : ${props.store.targetUserForDetails.email}`}
								</div>

								<div style={{ marginTop: 10 }}>
									해당 사용자를 정말로 탈퇴시키겠습니까?
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
								onClick={handleUserDelete}
								color="primary"
								autoFocus>
								탈퇴
              </Button>
						</DialogActions>
					</Dialog>}
			</div>
		);
	}))

export default DeleteUserDialog;
