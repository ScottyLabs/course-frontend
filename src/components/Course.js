import React from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";

const CourseRow = (data) => {
  const courseData = data.data;
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
    <>
      <Row className="mt-5">
        <Col>
          <h3 className="mb-3">
            {courseID} {courseData.name}
          </h3>
          <h5>Description:</h5>
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
    </>
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
