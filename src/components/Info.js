import React from "react";
import {
  Form,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import Course from "./Course";
import FCEForm from "./FCEForm";
import FCE from "./FCE";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as actions from "../actions";
import { Snackbar } from "@material-ui/core"
import MuiAlert from '@material-ui/lab/Alert';

const BASE_URL = "https://apis.scottylabs.org/course-api"

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Info = () => {
  const dispatch = useDispatch();

  const [courseID, setCourseID] = useState("");
  const [fceMode, setFCEMode] = useState(true);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const queryCourse = async (query) => {
    const url = BASE_URL + "/courses/courseID/";
    try {
      const response = await fetch(url + query);
      if (response.status == 200) {
        const data = await response.json();
        dispatch(actions.info.setCourseData(data));
      } else if (response.status == 404) {
        
      }
    } catch (e) {
      console.log(e);
    }
  };
  const queryFCE = async (query) => {
    const url = BASE_URL + "/fces/courseID/";
    try {
      const response = await fetch(url + query);
      if (response.status == 200) {
        const data = await response.json();
        dispatch(actions.info.setFCEData(data));
      } else if (response.status == 404) {
        setNotFound(true)
      } else {
        // Error occured
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleFieldChange = (e) => {
    setCourseID(e.target.value);
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    queryFCE(courseID);
    queryCourse(courseID);
    dispatch(actions.info.setCourseID(courseID));
  };
  const handleSwitch = (checked) => {
    setFCEMode(checked);
  };

  const handleCloseNotFound = (event, reason) => {
    setNotFound(false)
  }

  const handleCloseError = (event, reason) => {
    setError(false)
  }

  const fceFormComponent = fceMode ? <FCEForm /> : null;
  const fceComponent = fceMode ? <FCE /> : null;
  const courseComponent = fceMode ? null : <Course />;

  return (
    <>
      <Row>
        <Col md={6}>
          <Form onSubmit={handleFormSubmit}>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Course ID"
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
              <BootstrapSwitchButton
                checked={fceMode}
                onlabel="FCE"
                onstyle="success"
                offlabel="Course"
                offstyle="warning"
                style="w-25 mx-4"
                onChange={handleSwitch}
              />
            </InputGroup>
          </Form>
        </Col>
      </Row>
      <Snackbar open={error} autoHideDuration={3000} onClose={handleCloseError}>
        <Alert severity="error" onClose={handleCloseError}>
          An error occured!
        </Alert>
      </Snackbar>
      <Snackbar open={notFound} autoHideDuration={3000} onClose={handleCloseNotFound}>
        <Alert severity="warning" onClose={handleCloseNotFound}>
          Course not found!
        </Alert>
      </Snackbar>
      {fceFormComponent}
      {fceComponent}
      {courseComponent}
    </>
  );
};

export default Info;
