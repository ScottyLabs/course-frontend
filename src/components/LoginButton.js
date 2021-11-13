import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;
const axiosInstance = axios.create({
  validateStatus: (status) => true,
  headers: {
    "x-access-token": process.env.REACT_APP_API_TOKEN,
  },
});

const LoginButton = (props) => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (window.localStorage.getItem("course_token")) {
      props.setState.setLoggedIn(true);
    }
  }, []);

  const popupCenter = (title, w, h) => {
    const dualScreenLeft =
      window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop =
      window.screenTop !== undefined ? window.screenTop : window.screenY;

    const width = window.innerWidth
      ? window.innerWidth
      : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : window.screen.width;
    const height = window.innerHeight
      ? window.innerHeight
      : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : window.screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft;
    const top = (height - h) / 2 / systemZoom + dualScreenTop;
    const newWindow = window.open(
      "about:blank",
      title,
      `
      scrollbars=yes,
      width=${w / systemZoom}, 
      height=${h / systemZoom}, 
      top=${top}, 
      left=${left}
      `
    );

    newWindow?.focus();
    return newWindow;
  };

  return (
    <div>
      {props.state.loggedIn ? (
        <Button className="float-right" variant="outline-primary" size="sm" onClick={() => {
          localStorage.removeItem("course_token");
          window.location.reload();
        }}>
          Logout
        </Button>
      ) : (
        <Button
          className="float-right"
          variant="outline-primary"
          size="sm"
          as="a"
          onClick={() => {
            setLoading(true);
            const loginWindow = popupCenter("Login with CMU Email", 400, 600);
            axiosInstance
              .get(BASE_URL + "/auth/signRequest")
              .then((response) => {
                if (response.data.token) {
                  if (loginWindow) {
                    loginWindow.location.href =
                      "https://login.scottylabs.org/login/" +
                      response.data.token;
                  } else {
                    alert("Unable to create login request");
                  }
                }
              });
            window.addEventListener(
              "message",
              (event) => {
                if (event.origin !== "https://login.scottylabs.org") {
                  return;
                } else {
                  window.localStorage.setItem("course_token", event.data);
                  axiosInstance
                    .post(BASE_URL + "/auth/login", {
                      token: event.data,
                    })
                    .then(() => {
                      props.setState.setLoggedIn(true);
                      setLoading(false);
                    })
                    .catch(() => {
                      setLoading(false);
                      alert("Failed to log in");
                    });
                }
              },
              false
            );
          }}
        >
          Log In to Access FCE Data
        </Button>
      )}
    </div>
  );
};

export default LoginButton;
