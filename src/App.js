import React, { useState } from 'react';
import './App.css';
import LoginButton from './components/LoginButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Container, Spinner } from 'react-bootstrap';
import Info from './components/Info';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState(false);
  const [logoutError, setLogoutError] = useState(false);

  const handleCloseLoginError = (event, reason) => {
    setLoginError(false);
  };

  const handleCloseLogoutError = (event, reason) => {
    setLogoutError(false);
  };

  return (
    <div className="App">
      <Container>
        <Row className="my-3">
          <Col>
            <h2>ScottyLabs Course API</h2>
          </Col>
          <Col className="my-auto">
            <LoginButton
              state={{
                loggedIn: loggedIn,
                accessToken: accessToken,
                loading: loading,
              }}
              setState={{
                setLoggedIn: setLoggedIn,
                setAccessToken: setAccessToken,
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
          <Alert severity="error" onClose={handleCloseLoginError}>
            Failed to log in!
          </Alert>
        </Snackbar>
        <Snackbar
          open={logoutError}
          autoHideDuration={3000}
          onClose={handleCloseLogoutError}
        >
          <Alert severity="error" onClose={handleCloseLogoutError}>
            Failed to log out!
          </Alert>
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
}

export default App;
