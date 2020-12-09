import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import backgroundImage from '../../assets/img/squad_1.jpg'
import { observer, inject } from "mobx-react";
import Snackbars from '../../components/Snackbars/Snackbars'
import { useHistory } from "react-router-dom";

const riotPoliceImg = require("../../assets/img/riot-police.png")

const ENTER_KEY_CODE = 13

const LoginPage = inject("store")(
	observer((props) => {

		const classes = useStyles();
		const history = useHistory();

		const [email, setEmail] = useState("")
		const [password, setPassword] = useState("")

		useEffect(() => {

			if (props.store.isLoggedIn) {
				if (props.store.isAdmin){
					history.push('/admin')
					return
				}
				
				history.push('/')
				return
			}

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


		const handleEmailInput = (e) => {
			setEmail(e.target.value)
		}

		const handlePasswordInput = e => {
			setPassword(e.target.value)
		}

		const isRequiredFilled = (email, password) => {
			return (email != "") && (password != "")
		}

		const requestSignIn = async () => {
			try {
				if (!isRequiredFilled(email, password)) {
					props.store.set(
						"snackbarMsg",
						"아이디와 비밀번호를 모두 입력해주세요."
					)

					props.store.set(
						"snackbarWarningOpen",
						true
					)
					return
				}

				const requestBody = {
					email: email,
					password: password
				}

				const isLoggedIn = await props.store.signIn(requestBody)
				
				if (isLoggedIn){

					props.store.set(
						"snackbarMsg",
						"로그인 성공!"
					)

					props.store.set(
						"snackbarInfoOpen",
						true
					)

					if (props.store.isAdmin){
						history.push('/admin')

					}else {

						history.push('/')
					}


				} else {

					props.store.set(
						"snackbarMsg",
						"로그인 정보가 잘못되었습니다."
					)

					props.store.set(
						"snackbarErrorOpen",
						true
					)
				}

			} catch (e) {

			}
		}

		const handleNotSupported = () => {
			props.store.set(
				"snackbarMsg",
				"곧 지원 예정입니다 😊"
			)

			props.store.set(
				"snackbarInfoOpen",
				true
			)
		}


		return (
			<React.Fragment>
				<Snackbars></Snackbars>
				<Grid container component="main" className={classes.root}>
					<CssBaseline />
					<Grid id="background" item xs={false} sm={4} md={7} className={classes.image} />
					<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
						<div className={classes.paper}>
							<Avatar className={classes.avatar}>
								<img
									className={classes.icon}
									src={riotPoliceImg}
								/>
							</Avatar>

							<Typography component="h1" variant="h5">
								피쉬앤칩스 로그인
                        </Typography>
							<form className={classes.form} noValidate>
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									id="email"
									label="이메일"
									name="email"
									autoComplete="email"
									autoFocus
									onChange={handleEmailInput}
								/>

								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									name="password"
									label="비밀번호"
									type="password"
									id="password"
									autoComplete="current-password"
									onChange={handlePasswordInput}
								/>

								<FormControlLabel
									control={<Checkbox disabled checked value="remember" color="primary" />}
									label="자동로그인"
								/>

								<Button
									id="submit"
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
									onClick={requestSignIn}
								>
									로그인
                            </Button>

								<Grid container>
									<Grid item xs>
										<Link
											onClick={handleNotSupported}
											href="#"
											variant="body2">
											비밀번호 찾기?
                                        </Link>
									</Grid>
									<Grid item>
										<Link href="/signUp" variant="body2">
											{"회원가입"}
										</Link>
									</Grid>
								</Grid>
								<Box mt={5}>
									<Copyright />
								</Box>
							</form>
						</div>
					</Grid>
				</Grid>
			</React.Fragment>
		);
	}))

export default LoginPage;


function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="https://github.com/FishermanSqaud">
				Team Fisherman Squad
      </Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}


const useStyles = makeStyles((theme) => ({
	root: {
		height: '100vh',
	},
	image: {
		backgroundImage: `url(${backgroundImage})`,
		backgroundRepeat: 'no-repeat',
		backgroundColor:
			theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	},
	paper: {
		margin: theme.spacing(8, 4),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		background: 'none',
		borderRadius: "0"
	},
	icon: {
		width: "100%",
		height: "100%"
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));
