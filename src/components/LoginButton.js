import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const LoginButton = (props) => {
  const login = (res) => {
    if (res.accessToken) {
      props.setState.setLoggedIn(true);
      if (props.state.loading) {
        props.setState.setLoading(false);
      }
    }
  };

  const logout = (res) => {
    window.localStorage.removeItem('accessToken');
    props.setState.setLoading(true);
    props.setState.setLoggedIn(false);
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
        <Button
          className="float-right"
          variant="outline-primary"
          size="sm"
          onClick={logout}
        >
          Logout
        </Button>
      ) : (
        <Button
          className="float-right"
          variant="outline-primary"
          size="sm"
          as="a"
          href={
            process.env.REACT_APP_LOGIN_API +
            encodeURIComponent(window.location.href)
          }
        >
          Log In to Access FCE Data
        </Button>
      )}
    </div>
  );
};

export default LoginButton;
