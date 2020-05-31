import React from 'react';
import {
  Form,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLock } from '@fortawesome/free-solid-svg-icons';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import Course from './Course';
import FCEForm from './FCEForm';
import FCE from './FCE';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import * as actions from '../actions';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';

const BASE_URL = 'https://apis.scottylabs.org/course-api';
const axiosInstance = axios.create({
  validateStatus: status => true
});

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const Info = (props) => {
  const dispatch = useDispatch();

  const [courseID, setCourseID] = useState('');
  const [fceMode, setFCEMode] = useState((prev) => {
    if (!prev || (prev == true && !props.loggedIn)) {
      return false;
    }
    return true;
  });
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('An error occured!');
  const [notFound, setNotFound] = useState(false);

  const queryCourse = async (courseIDs) => {
    const url = BASE_URL + '/courses/courseID/';
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
          setErrorMessage('Unknown course ID: ' + courseID);
        }
      }
      dispatch(actions.info.setCourseData(courseData));
    } catch (e) {
      setError(true);
      console.log(e);
    }
  };
  const queryFCE = async (courseIDs) => {
    const url = BASE_URL + '/fces/courseID/';
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
          setErrorMessage('Unknown course ID: ' + courseID);
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
    const courseIDs = courseID.split(' ');
    queryFCE(courseIDs);
    queryCourse(courseIDs);
    dispatch(actions.info.setCourseIDs(courseIDs));
  };

  const handleSwitch = (checked) => {
    setFCEMode(checked);
  };
  const handleCloseNotFound = (event, reason) => {
    setNotFound(false);
  };
  const handleCloseError = (event, reason) => {
    setError(false);
    setErrorMessage('An error occured!');
  };

  const fceFormComponent = fceMode ? <FCEForm /> : null;
  const fceComponent = fceMode ? <FCE /> : null;
  const courseComponent = fceMode ? null : <Course />;

  return props.loading ? (
    <div></div>
  ) : (
    <>
      <Row>
        <Col md={8}>
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
              {props.loggedIn ? (
                <BootstrapSwitchButton
                  checked={fceMode}
                  onlabel="FCE"
                  onstyle="success"
                  offlabel="Course"
                  offstyle="warning"
                  style="w-25 mx-4"
                  onChange={handleSwitch}
                />
              ) : (
                <Button
                  disabled
                  variant="secondary"
                  className="w-25 mx-4"
                ><FontAwesomeIcon icon={faLock} /> Course</Button>
              )}
            </InputGroup>
          </Form>
        </Col>
      </Row>
      <Snackbar open={error} autoHideDuration={3000} onClose={handleCloseError}>
        <Alert severity="error" onClose={handleCloseError}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={notFound}
        autoHideDuration={3000}
        onClose={handleCloseNotFound}
      >
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
