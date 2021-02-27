import React from "react";
import { Accordion, Container, Card, Row, Col, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import { CustomToggle } from "./CustomToggle";
import rsreplace from "react-string-replace";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const courseIDLinker = (text, history) => {
  const handleLinkClick = (id) => {
    console.log(history.location)
    let newLocation = {};
    const pathname = history.location.pathname;
    if (pathname.match(/\d/g)) {
      newLocation.pathname = pathname + " " + id;
    } else if (pathname[pathname.length - 1] === "/") {
      newLocation.pathname = pathname + id;
    } else {
      newLocation.pathname = pathname + "/" + id;
    }
    history.push(newLocation);
    history.go(0);
  }

  return rsreplace(text, /(\d{2}-\d{3}|\d{5})/gm, (match, index, offset) => {
    if (match.match(/\d{5}/gm)) {
      match = match.slice(0, 2) + "-" + match.slice(2, 5);
    }
    return (
      <Button onClick={() => handleLinkClick(match)} as={Badge} pill variant="info">
        {match}
      </Button>
    );
  });
};

const CourseRow = (props) => {
  const history = useHistory();

  const courseData = props.data;
  console.log(courseData);
  let prereqs = "none";
  if (courseData.prereqs) {
    prereqs = courseData.prereqs.join(", ");
  }
  let coreqs = "none";
  if (courseData.coreqs) {
    coreqs = courseData.coreqs.join(", ");
  }
  const courseID = courseData.courseID;

  return (
    <Row className="mt-3 mx-0">
      <Accordion defaultActiveKey="0" className="w-100">
        <Card bg="light">
          <CustomToggle eventKey="0">
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
                  <p>{prereqs}</p>
                </Col>
                <Col>
                  <h5>Corequisites</h5>
                  <p>{coreqs}</p>
                </Col>
              </Row>
            </Container>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </Row>
  );
};

const Course = () => {
  const courseData = useSelector((state) => state.courseData);

  if (!courseData) return null;
  const rows = [];
  let id = 0;
  for (const course of courseData) {
    rows.push(<CourseRow data={course} key={id++} />);
  }
  return <>{rows}</>;
};

export default Course;
