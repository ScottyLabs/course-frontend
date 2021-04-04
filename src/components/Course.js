import React from "react";
import { Accordion, Container, Card, Row, Col, Badge } from "react-bootstrap";
import { useSelector } from "react-redux"; //for redux state retrieval
import { CustomToggle } from "./CustomToggle";
import rsreplace from "react-string-replace";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import * as actions from "../actions";

const BASE_URL = process.env.REACT_APP_API_URL;
const axiosInstance = axios.create({
  validateStatus: (status) => true,
  headers: {
    "x-access-token": process.env.REACT_APP_API_TOKEN,
  },
});

const getCoreq = (coreqs) => {
  let coreqStr = "";
  if (coreqs.length === 0) return coreqStr;
  for (var i = 0; i < coreqs.length - 1; i++) {
    coreqStr += coreqs[i] + " or ";
  }
  coreqStr += coreqs[coreqs.length - 1];
  return coreqStr;
};

const CourseRow = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [search, setSearch] = props.courseID;
  const [setError, setErrorMessage, setNotFound] = props.errorHandler;

  const courseData = props.data;
  let prereqs = "none";
  if (courseData.prereqs) {
    //edit this lol
    prereqs = courseData.prereqString;
  }
  let coreqs = "none";
  if (courseData.coreqs) {
    coreqs = getCoreq(courseData.coreqs);
  }
  const courseID = courseData.courseID;

  const queryCourse = async (courseID) => {
    const url = BASE_URL + "/courses/courseID/";
    try {
      const courseData = [];
      const response = await axiosInstance.get(url + courseID);
      if (response.status === 200) {
        const data = response.data;
        courseData.push(data);
        dispatch(actions.info.addCourseData(courseData));
        return true;
      }
      else if (response.status === 404) {
        setNotFound(true);
        return false;
      } else {
        setError(true);
        setErrorMessage("Unknown course ID: " + courseID);
        return false;
      }
    } catch (e) {
      setError(true);
      console.log(e);
      return false;
    }
  };

  const queryFCE = async (courseID) => {
    const url = BASE_URL + "/fces/courseID/";
    try {
      const fceData = [];
      const response = await axiosInstance.get(url + courseID);
      if (response.status === 200) {
        const data = response.data;
        let course = { courseID: courseID, data: [] };
        for (const row of data) {
          course.data.push(row);
        }
        fceData.push(course);
        dispatch(actions.info.addFCEData(fceData));
        return true;
      }
      else if (response.status === 404) {
        setNotFound(true);
        return false;
      } else {
        setError(true);
        setErrorMessage("Unknown course ID: " + courseID);
        return false;
      }
    } catch (e) {
      setError(true);
      console.log(e);
      return false;
    }
  };

  const courseIDLinker = (text, history) => {
    const handleLinkClick = (id) => {
      let newLocation = {};
      const pathname = history.location.pathname;
      if (pathname.match(/\d/g)) {
        newLocation.pathname = pathname + " " + id;
      } else if (pathname[pathname.length - 1] === "/") {
        newLocation.pathname = pathname + id;
      } else {
        newLocation.pathname = pathname + "/" + id;
      }
      if (queryCourse(id) || queryFCE(id)) {
        history.push(newLocation);
        setSearch(`${search} ${id}`);
      }
    };

    return rsreplace(text, /(\d{2}-\d{3}|\d{5})/gm, (match, index, offset) => {
      if (match.match(/\d{5}/gm)) {
        match = match.slice(0, 2) + "-" + match.slice(2, 5);
      }
      return (
        <Button
          onClick={() => handleLinkClick(match)}
          as={Badge}
          pill
          variant="info"
        >
          {match}
        </Button>
      );
    });
  };

  const removeCourse = (id) => {
    dispatch(actions.info.removeCourseData(id));
    dispatch(actions.info.removeFCEData(id));
    const pathname = history.location.pathname.split("/").pop();
    const searches = pathname.split(" ");
    const newSearches = [];
    for (let search of searches) {
      console.log(search, id);
      if (search !== id && search.slice(0,2) + "-" + search.slice(2,5) !== id) {
        newSearches.push(search);
      }
    }
    console.log(newSearches)
    setSearch(newSearches.join(" "));
    history.push("/course/" + encodeURIComponent(newSearches.join(" ")));
  };

  return (
    <Row className="mt-3 mx-0">
      <Accordion defaultActiveKey="0" className="w-100">
        <Card bg="light">
          <CustomToggle eventKey="0" callback={() => removeCourse(courseID)}>
            {courseID} {courseData.name}{" "}
            <Badge variant="info" className="ml-2">
              {courseData.department}
            </Badge>
          </CustomToggle>
          <Accordion.Collapse eventKey="0">
            <Container>
              <Row className="mt-3">
                <Col>
                  <h5>Description</h5>
                  <p>{courseIDLinker(courseData.desc, history)}</p>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col>
                  <h5>Prerequisites</h5>
                  <p>{prereqs ? courseIDLinker(prereqs, history) : "None"}</p>
                </Col>
                <Col>
                  <h5>Corequisites</h5>
                  <p>{coreqs ? courseIDLinker(coreqs, history) : "None"}</p>
                </Col>
              </Row>
            </Container>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </Row>
  );
};

const Course = (props) => {
  const courseData = useSelector((state) => state.courseData);

  if (!courseData) return null;
  const rows = [];
  let id = 0;
  for (const course of courseData) {
    rows.push(
      <CourseRow
        data={course}
        key={id++}
        courseID={props.courseID}
        errorHandler={props.errorHandler}
      />
    );
  }
  return <>{rows}</>;
};

export default Course;
