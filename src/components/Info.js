import React, { useEffect } from "react";
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
import { useHistory } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_URL;
const axiosInstance = axios.create({
  validateStatus: (status) => true,
  headers: {
    "x-access-token": process.env.REACT_APP_API_TOKEN,
  },
});

const Info = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [courseID, setCourseID] = useState("");
  const [fceMode, setFCEMode] = useState((prev) => {
    if (!prev || (prev === true && !props.loggedIn)) {
      return false || props.fce;
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
        if (response.status === 200) {
          const data = response.data;
          courseData.push(data);
        } else if (response.status === 404) {
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
        const response = await axiosInstance({
          method: 'post',
          url: url + courseID,
          data: {
            token: localStorage.getItem("course_token")
          }
        });
        if (response.status === 200) {
          const data = response.data;
          let course = { courseID: courseID, data: [] };
          for (const row of data) {
            course.data.push(row);
          }
          fceData.push(course);
        } else if (response.status === 404) {
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

  const handleFormSubmit = (e, loggedIn) => {
    e.preventDefault();
    const courseIDs = courseID.split(" ");
    if (loggedIn) queryFCE(courseIDs);
    queryCourse(courseIDs);
    dispatch(actions.info.setCourseIDs(courseIDs));

    let redirectURL;
    if (history.location.pathname.includes("/course")) {
      redirectURL = "/course/" + encodeURIComponent(courseID);
    } else {
      redirectURL = "/fce/" + encodeURIComponent(courseID);
    }
    history.push(redirectURL);
  };

  const handleSwitch = (e) => {
    setFCEMode(e.target.value === "true");
    let searchParams = "";
    const patharray = history.location.pathname.split("/");
    if (patharray.length > 2) {
      searchParams = patharray[2];
    }

    if (e.target.value === "true") {
      if (searchParams.length > 0) {
        history.push("/fce/" + encodeURIComponent(searchParams));
      } else {
        history.push("/fce");
      }
    } else {
      if (searchParams.length > 0) {
        history.push("/course/" + encodeURIComponent(searchParams));
      } else {
        history.push("/course");
      }
    }
  };

  const handleCloseNotFound = (event, reason) => {
    setNotFound(false);
  };

  const handleCloseError = (event, reason) => {
    setError(false);
    setErrorMessage("An error occured!");
  };

  useEffect(() => {
    if (props.courseIDs) {
      const courseIDs = props.courseIDs.split(" ");
      queryFCE(courseIDs);
      queryCourse(courseIDs);
      dispatch(actions.info.setCourseIDs(courseIDs));
      setCourseID(props.courseIDs);
    }
  }, []);

  return props.loading ? (
    <div></div>
  ) : (
    <>
      <Row>
        <Col>
          <Form onSubmit={(e) => handleFormSubmit(e, props.loggedIn)}>
            <h5>Course IDs</h5>
            <Row className="mx-0">
              <div className="search-row">
                <div>
                  <InputGroup>
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
                </div>
                <ButtonToolbar aria-label="Toolbar with Button groups">
                  <ToggleButtonGroup
                    type="radio"
                    name="fceToggle"
                    defaultValue={fceMode ? "true" : "false"}
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
                      {props.loggedIn ? null : (
                        <FontAwesomeIcon icon={faLock} />
                      )}{" "}
                      FCE
                    </ToggleButton>
                  </ToggleButtonGroup>
                </ButtonToolbar>
              </div>
            </Row>
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
      {fceMode ? <FCE search={[courseID, setCourseID]} /> : null}
      {fceMode ? null : (
        <Course
          courseID={[courseID, setCourseID]}
          errorHandler={[setError, setErrorMessage, setNotFound]}
        />
      )}
    </>
  );
};

export default Info;
