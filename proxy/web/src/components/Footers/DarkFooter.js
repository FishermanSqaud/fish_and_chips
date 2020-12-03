/*eslint-disable*/
import React from "react";
import { makeStyles } from '@material-ui/core/styles';

function DarkFooter() {
  const classes = useStyles()

  return (
    <footer className={classes.footer} data-background-color="black">
      <div className={classes.container}>
        <nav className={classes.footerNav}>
          <ul style={{
            display: 'inline-block',
            listStyle : 'none',
            margin: 0
          }}>
            <li>
              <a
                // href="https://github.com/team-CamelCase"
                style={{
                  color : 'white'
                }}
                target="_blank"
              >
                Team Legday
              </a>
            </li>
            
          </ul>
        </nav>
        <div className={classes.copyright} id="copyright">
          © {new Date().getFullYear()}, Designed by{" "}
          <a
            style={{
              color : 'white'
            }}
            href="https://www.invisionapp.com?ref=nukr-dark-footer"
            target="_blank"
          >
            Invision
          </a>
          . Template supported by{" "}
          <a
            style={{
              color : 'white'
            }}
            href="https://www.creative-tim.com?ref=nukr-dark-footer"
            target="_blank"
          >
            Creative Tim
          </a>
          .
        </div>
      </div>
    </footer>
  );
}

export default DarkFooter;


const useStyles = makeStyles(theme => ({
  footer : {
    padding : '24px 0',
    color : 'white',
    background : '#2c2c2c',
    fontFamily : '"Montserrat", "Helvetica Neue", Arial, sans-serif'
  },
  container : {
    maxWidth : '80%',
    width : '100%',
    paddingRight : 15,
    paddingLeft : 15,
    marginRight : 'auto',
    marginElft : 'auto'
  },
  footerNav : {
    display : 'inline-block',
    float : 'left'
  },
  copyright : {
    textAlign : 'right',
    fontSize : '0.8571em',
  }
}))