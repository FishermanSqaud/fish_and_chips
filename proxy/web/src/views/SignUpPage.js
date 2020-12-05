import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { observer, inject } from "mobx-react";
import Snackbars from 'views/Snackbars'

const ENTER_KEY_CODE = 13

const SignUp = inject("store")(
  observer((props) => {

    const classes = useStyles();

    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")

    useEffect(()=>{

      const enterSubmit = (e) => {
        if (e.keyCode == ENTER_KEY_CODE){
          const submitBtn = document.getElementById("submit")
          submitBtn.click()
        }
      }

      window.addEventListener('keyup', enterSubmit)

      return function cleanup() {
        window.removeEventListener('keyup', enterSubmit)
      }

    },[])

    const isRequiredFilled = (email, name, password) => {
      return (email != "") && (name != "") && (password != "")
    }

    const requestSignUp = async () => {
      try {
        if (!isRequiredFilled(email, name, password)) {

          props.store.set(
            "snackbarMsg",
            "회원정보를 모두 입력해주세요"
          )

          props.store.set(
            "snackbarWarningOpen",
            true
          )

          return
        }

        const backendUrl = process.env.REACT_APP_BACKEND_URL

        const requestBody = {
          email: email,
          name: name,
          password: password,
        }

        const response = await fetch(
          `${backendUrl}/users`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
          }
        )

        console.log("회원가입 결과", response)

        if (response.ok) {

          const loginResponse = await fetch(
            `${backendUrl}/users/signIn`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(requestBody)
            }
          )

          if (loginResponse.ok) {

            props.store.set(
              "isLoggedIn",
              true
            )

            const accessToken = response.headers.get(
              "Authorization"
            )

            props.store.set(
              "accessToken",
              accessToken
            )

            const responseJson = await loginResponse.json()

            props.store.set(
              "userName",
              responseJson.userName
            )

            props.store.set(
              "userId",
              responseJson.userId
            )

            localStorage.setItem("accessToken", accessToken)
            localStorage.setItem("userName", responseJson.userName)
            localStorage.setItem("userId", responseJson.userId)
          }

          props.store.set(
            "snackbarMsg",
            "회원가입 성공!"
          )

          props.store.set(
            "snackbarInfoOpen",
            true
          )

          props.history.push('/')

        } else {

          if (response.status == 400) {

            props.store.set(
              "snackbarMsg",
              "이미 존재하는 이메일 아이디입니다."
            )

            props.store.set(
              "snackbarWarningOpen",
              true
            )

          } else {

            props.store.set(
              "snackbarMsg",
              "회원가입에 실패하였습니다"
            )

            props.store.set(
              "snackbarErrorOpen",
              true
            )
          }

        }

      } catch (e) {

        props.store.set(
          "snackbarMsg",
          "회원가입에 실패하였습니다"
        )

        props.store.set(
          "snackbarErrorOpen",
          true
        )
      }
    }

    const handleEmailInput = (e) => {
      setEmail(e.target.value)
    }

    const handlePasswordInput = e => {
      setPassword(e.target.value)
    }

    const handleNameInput = e => {
      setName(e.target.value)
    }

    return (
      <React.Fragment>
        <Snackbars></Snackbars>

        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <img
                className={classes.icon}
                src={require('../assets/img/riot-police.png')}></img>
            </Avatar>
            <Typography component="h1" variant="h5">
              피쉬앤칩스 회원가입
        </Typography>

            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="이메일 ID"
                    name="email"
                    autoFocus
                    autoComplete="email"
                    onChange={handleEmailInput}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    autoComplete="fname"
                    name="이름"
                    variant="outlined"
                    fullWidth
                    id="name"
                    label="이름"
                    onChange={handleNameInput}
                  />
                </Grid>


                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="비밀번호"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={handlePasswordInput}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                    label="(선택) 개인정보 약관에 동의하겠습니다."
                  />
                </Grid>
              </Grid>

              <Button
                id="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={requestSignUp}
              >
                회원가입
          </Button>

              <Grid container justify="flex-end">
                <Grid item>
                  <Link href="/signIn" variant="body2">
                    이미 회원이신가요? 로그인
              </Link>
                </Grid>
              </Grid>
            </form>
          </div>
          <Box mt={5}>
            <Copyright />
          </Box>
        </Container>
      </React.Fragment>
    );
  }))

export default SignUp;


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
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    background: "none",
    borderRadius: "0"
    // backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  icon: {
    width: '100%',
    height: '100%'
  }
}));
