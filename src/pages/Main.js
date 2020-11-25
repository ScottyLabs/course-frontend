import React, { useState } from "react";
import LoginButton from "../components/LoginButton";
import { Row, Col, Container, Spinner, Alert } from "react-bootstrap";
import Info from "../components/Info";
import { Snackbar } from "@material-ui/core";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { checkAccessToken } from "../util/authUtils";
import { PopupAlert } from "../components/Alert";

export const Main = (props) => {
  const history = useHistory();
  const location = useLocation();
  const { courseIDs } = useParams();
  const [loggedIn, setLoggedIn] = useState(checkAccessToken(location));
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [logoutError, setLogoutError] = useState(false);

  if (location.search) {
    console.log(history);
    history.push("/course");
  }

  const handleCloseLoginError = (event, reason) => {
    setLoginError(false);
  };

  const handleCloseLogoutError = (event, reason) => {
    setLogoutError(false);
  };

  return (
    <div className="App">
      <Container className="pb-5">
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
          <Info
            loggedIn={loggedIn}
            loading={loading}
            fce={props.fce}
            courseIDs={courseIDs}
          />
        )}
      </Container>
    </div>
  );
};
