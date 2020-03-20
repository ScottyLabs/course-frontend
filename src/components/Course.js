import React from 'react';
import { Row, Col } from 'react-bootstrap';

const Course = props => {
  if (props.data === null) {
    return null;
  }
  if (props.data.prereqs === null) {
    var prereqs = 'none';
  } else {
    var prereqs = props.data.prereqs.join(', ');
  }
  if (props.data.coreqs === null) {
    var coreqs = 'none';
  } else {
    var coreqs = props.data.coreqs.join(', ');
  }
  return (
    <>
      <Row className="mt-5">
        <Col>
          <h3 className="mb-3">
            {props.data.courseID} {props.data.name}
          </h3>
          <h5>Description:</h5>
          <p>{props.data.desc}</p>
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

export default Course;
