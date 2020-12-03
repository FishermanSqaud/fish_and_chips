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

                const backendUrl = process.env.REACT_APP_BACKEND_URL
                const targetUrl = backendUrl + `/${props.store.deleteLocation.key}`

                const response = await fetch(
                    targetUrl,
                    {
                        method: "DELETE"
                    }
                )

                if (response.ok) {
                    props.store.set(
                        "snackbarMsg",
                        `${props.store.deleteLocation.message} 삭제 성공`
                    )

                    props.store.set(
                        "snackberInfoMsg",
                        true
                    )

                    const idx = props.store.allLocations.indexOf(props.store.deleteLocation)

                    if (idx > -1){
                        props.store.allLocations.splice(idx, 1)
                    }

                } else {
                    props.store.set(
                        "snackbarMsg",
                        `${props.store.deleteLocation.message} 삭제 실패`
                    )

                    props.store.set(
                        "snackberErrorMsg",
                        true
                    )
                }

            } catch (err) {

                props.store.set(
                    "snackbarMsg",
                    `${props.store.deleteLocation.message} 삭제 실패`
                )

                props.store.set(
                    "snackberErrorMsg",
                    true
                )
            }

            handleClose()
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
                            {`위치 데이터 삭제`}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                {`${props.store.deleteLocation.message}를 정말로 삭제하시겠습니까?`}
                            </DialogContentText>
                        </DialogContent>
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
