import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

const LoginButton = (props) => {
  const logout = () => {
    window.localStorage.removeItem("accessToken");
    props.setState.setLoading(true);
    props.setState.setLoggedIn(false);
    props.setState.setLoading(false);
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
