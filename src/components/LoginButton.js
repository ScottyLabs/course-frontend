import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const LoginButton = (props) => {
  const login = (res) => {
    if (res.accessToken) {
      props.setState.setLoggedIn(true);
      props.setState.setAccessToken(res.accessToken);
      if (props.state.loading) {
        props.setState.setLoading(false);
      }
    }
  };

  const logout = (res) => {
    props.setState.setLoading(true);
    props.setState.setLoggedIn(false);
    props.setState.setAccessToken('');
    props.setState.setLoading(false);
  };

  const handleLoginFailure = (res) => {
    props.setState.setLoginError(true);
  };

  const handleLogoutFailure = () => {
    props.setState.setLogoutError(true);
  };

  return (
    <div>
      {props.state.loggedIn ? (
        <GoogleLogout
          clientId={CLIENT_ID}
          onLogoutSuccess={logout}
          onFailure={handleLogoutFailure}
          render={(renderProps) => (
            <Button
              className="float-right"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              size="sm"
              variant="outline-primary"
            >
              Log Out
            </Button>
          )}
        ></GoogleLogout>
      ) : (
        <GoogleLogin
          clientId={CLIENT_ID}
          onSuccess={login}
          onFailure={handleLoginFailure}
          cookiePolicy={'single_host_origin'}
          responseType="code,token"
          isSignedIn={true}
          hostedDomain="andrew.cmu.edu"
          onAutoLoadFinished={(isLoggedIn) => {
            if (!isLoggedIn) {
              props.setState.setLoading(false);
            }
          }}
          render={(renderProps) => (
            <Button
              className="float-right"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              size="sm"
              variant="outline-primary"
            >
              Log In to Access FCE Data
            </Button>
          )}
        />
      )}
    </div>
  );
};

export default LoginButton;
