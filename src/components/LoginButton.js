import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const LoginButton = (props) => {
  const history = useHistory();

  const logout = () => {
    window.localStorage.removeItem("accessToken");
    props.setState.setLoading(true);
    props.setState.setLoggedIn(false);
    props.setState.setLoading(false);
    // Check if currently on FCE page
    if (
      history.location.pathname &&
      history.location.pathname.includes("/fce")
    ) {
      history.push("/course");
    }
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
