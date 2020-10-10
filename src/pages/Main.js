import React, { useState } from "react";
import LoginButton from "../components/LoginButton";
import { Row, Col, Container, Spinner, Alert } from "react-bootstrap";
import Info from "../components/Info";
import { Snackbar } from "@material-ui/core";
import jwt from "jsonwebtoken";
import { useHistory } from "react-router-dom";
import MuiAlert from "@material-ui/lab/Alert";

const PopupAlert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const readQuery = (query) => {
  if (query) {
    const queryArray = query.slice(query.indexOf("?") + 1).split("&");
    let result = {};
    for (let item of queryArray) {
      let tmp = item.split("=");
      result[tmp[0]] = tmp[1];
    }
    return result;
  }
};

const checkAccessToken = (props) => {
  const getNewToken = (search) => {
    const query = readQuery(search);
    try {
      jwt.verify(query.accessToken, process.env.REACT_APP_JWT_SECRET);
      window.localStorage.setItem("accessToken", query.accessToken);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const accessToken = window.localStorage.getItem("accessToken");
  if (accessToken) {
    try {
      jwt.verify(accessToken, process.env.REACT_APP_JWT_SECRET);
      return true;
    } catch (err) {
      console.log(err);
      return getNewToken(props?.location?.search);
    }
  } else if (!accessToken) {
    return getNewToken(props?.location?.search);
  }
};

export const Main = (props) => {
  const history = useHistory();
  const [loggedIn, setLoggedIn] = useState(checkAccessToken(props));
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [logoutError, setLogoutError] = useState(false);

  if (props.location.search) {
    history.push("/");
  }

  const handleCloseLoginError = (event, reason) => {
    setLoginError(false);
  };

  const handleCloseLogoutError = (event, reason) => {
    setLogoutError(false);
  };

  return (
    <div className="App">
      <Container>
        <Alert variant="warning" className="mt-3">
          We have received feedback regarding the availability of Spring 2020
          FCEs and are working to add them as soon as possible. Meanwhile, feel
          free to query data from 2019 and earlier. Stay safe!
        </Alert>
        <Row className="my-3">
          <Col>
            <h2>ScottyLabs Course Tool</h2>
          </Col>
          <Col className="my-auto">
            <LoginButton
              state={{
                loggedIn: loggedIn,
                loading: loading,
              }}
              setState={{
                setLoggedIn: setLoggedIn,
                setLoading: setLoading,
                setLoginError: setLoginError,
                setLogoutError: setLogoutError,
              }}
            />
          </Col>
        </Row>
        <Snackbar
          open={loginError}
          autoHideDuration={3000}
          onClose={handleCloseLoginError}
        >
          <PopupAlert severity="error" onClose={handleCloseLoginError}>
            Failed to log in!
          </PopupAlert>
        </Snackbar>
        <Snackbar
          open={logoutError}
          autoHideDuration={3000}
          onClose={handleCloseLogoutError}
        >
          <PopupAlert severity="error" onClose={handleCloseLogoutError}>
            Failed to log out!
          </PopupAlert>
        </Snackbar>
        {loading ? (
          <Spinner animation="border" variant="primary" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        ) : (
          <Info loggedIn={loggedIn} loading={loading} />
        )}
      </Container>
    </div>
  );
};
