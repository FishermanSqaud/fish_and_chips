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
                "isCheckDialogOpen",
                false
            )
        }

        const handleConfirm = async () => {


            props.store.set(
                "isLoggedIn",
                false
            )

            props.store.set(
                "accessToken",
                null
            )

            props.store.set(
                "userName",
                null
            )

            props.store.set(
                "userId",
                null
            )

            localStorage.removeItem("accessToken")
            localStorage.removeItem("userName")
            localStorage.removeItem("userId")

            props.store.set(
                "snackbarMsg",
                "로그아웃 성공!"
            )

            props.store.set(
                "snackbarInfoOpen",
                true
            )

            handleClose()
        }

        return (
            <div>
                {props.store.isCheckDialogOpen &&
                    <Dialog
                        open={props.store.isCheckDialogOpen}
                        onClose={handleClose}
                        style={{
                            minWidth: 350
                        }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {`로그아웃`}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText 
                                style={{color : "#555555"}}
                                id="alert-dialog-description">
                                {`${props.store.userName}님 정말로 로그아웃하시겠습니까?😢`}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={handleClose}
                                color="primary">
                                취소
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                color="primary"
                                autoFocus>
                                확인
                            </Button>
                        </DialogActions>
                    </Dialog>}
            </div>
        );
    }))

export default DeleteDialog;
