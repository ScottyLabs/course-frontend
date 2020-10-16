import React from "react";
import {
  Form,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  ButtonToolbar,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faLock } from "@fortawesome/free-solid-svg-icons";
import Course from "./Course";
import FCEForm from "./FCEForm";
import FCE from "./FCE";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as actions from "../actions";
import { Snackbar } from "@material-ui/core";
import { PopupAlert } from "./Alert";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;
const axiosInstance = axios.create({
  validateStatus: (status) => true,
  headers: {
    "x-access-token": process.env.REACT_APP_API_TOKEN,
  },
});

const Info = (props) => {
  const dispatch = useDispatch();

  const [courseID, setCourseID] = useState("");
  const [fceMode, setFCEMode] = useState((prev) => {
    if (!prev || (prev == true && !props.loggedIn)) {
      return false;
    }
    return true;
  });
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("An error occured!");
  const [notFound, setNotFound] = useState(false);

  const queryCourse = async (courseIDs) => {
    const url = BASE_URL + "/courses/courseID/";
    try {
      const courseData = [];
      for (const courseID of courseIDs) {
        const response = await axiosInstance.get(url + courseID);
        if (response.status == 200) {
          const data = response.data;
          courseData.push(data);
        } else if (response.status == 404) {
          setNotFound(true);
        } else {
          setError(true);
          setErrorMessage("Unknown course ID: " + courseID);
        }
      }
      dispatch(actions.info.setCourseData(courseData));
    } catch (e) {
      setError(true);
      console.log(e);
    }
  };
  const queryFCE = async (courseIDs) => {
    const url = BASE_URL + "/fces/courseID/";
    try {
      const fceData = [];
      for (const courseID of courseIDs) {
        const response = await axiosInstance.get(url + courseID);
        if (response.status == 200) {
          const data = response.data;
          fceData.push(data);
        } else if (response.status == 404) {
          setNotFound(true);
        } else {
          setError(true);
          setErrorMessage("Unknown course ID: " + courseID);
        }
      }
      dispatch(actions.info.setFCEData(fceData));
    } catch (e) {
      setError(true);
      console.log(e);
    }
  };

  const handleFieldChange = (e) => {
    setCourseID(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const courseIDs = courseID.split(" ");
    queryFCE(courseIDs);
    queryCourse(courseIDs);
    dispatch(actions.info.setCourseIDs(courseIDs));
  };

  const handleSwitch = (e) => {
    setFCEMode(e.target.value === "true");
  };

  const handleCloseNotFound = (event, reason) => {
    setNotFound(false);
  };

  const handleCloseError = (event, reason) => {
    setError(false);
    setErrorMessage("An error occured!");
  };

  return props.loading ? (
    <div></div>
  ) : (
    <>
      <Row>
        <Col md={8}>
          <Form onSubmit={handleFormSubmit}>
            <h5>Course IDs</h5>
            <ButtonToolbar
              className="mb-3"
              aria-label="Toolbar with Button groups"
            >
              <InputGroup className="mr-3">
                <FormControl
                  placeholder="e.g. 21127 15-112"
                  aria-label="Course ID"
                  aria-describedby="course-id"
                  value={courseID}
                  onChange={handleFieldChange}
                />
                <InputGroup.Append>
                  <Button variant="outline-secondary" type="submit">
                    <FontAwesomeIcon icon={faSearch} />
                  </Button>
                </InputGroup.Append>
              </InputGroup>
              <ToggleButtonGroup
                type="radio"
                name="fceToggle"
                defaultValue="false"
              >
                <ToggleButton
                  variant="outline-primary"
                  value="false"
                  onChange={handleSwitch}
                >
                  Course
                </ToggleButton>
                <ToggleButton
                  disabled={!props.loggedIn}
                  variant="outline-primary"
                  value="true"
                  onChange={handleSwitch}
                >
                  {props.loggedIn ? null : <FontAwesomeIcon icon={faLock} />}{" "}
                  FCE
                </ToggleButton>
              </ToggleButtonGroup>
            </ButtonToolbar>
          </Form>
        </Col>
      </Row>
      <Snackbar open={error} autoHideDuration={3000} onClose={handleCloseError}>
        <PopupAlert severity="error" onClose={handleCloseError}>
          {errorMessage}
        </PopupAlert>
      </Snackbar>
      <Snackbar
        open={notFound}
        autoHideDuration={3000}
        onClose={handleCloseNotFound}
      >
        <PopupAlert severity="warning" onClose={handleCloseNotFound}>
          Course not found!
        </PopupAlert>
      </Snackbar>
      {fceMode ? <FCEForm /> : null}
      {fceMode ? <FCE /> : null}
      {fceMode ? null : <Course />}
    </>
  );
};

export default Info;
