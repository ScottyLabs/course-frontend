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
    history.push("/course");
  }

  if (props.fce && !loggedIn) {
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
      <Container className="pb-5 content">
        <Alert variant="info" className="mt-3">
          Check out the Beta version of the new ScottyLabs Course Tool{" "}
          <a href="https://stg-course.scottylabs.org">here</a>!
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
      <div className="footer text-muted pt-3">
        <Container>
          <ul class="list-inline">
            <li class="list-inline-item h5">
              <a href="https://scottylabs.org">ScottyLabs</a> Course Tool
            </li>
            <li class="list-inline-item ml-3">
              <a href="/privacy">Privacy</a>
            </li>
          </ul>
        </Container>
      </div>
    </div>
  );
};
