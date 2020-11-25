import React from "react";
import { Accordion, Container, Card, Row, Col, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import { CustomToggle } from "./CustomToggle";

const CourseRow = (props) => {
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
                  <p>{courseData.desc}</p>
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
