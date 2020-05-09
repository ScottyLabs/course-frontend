import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useStore, useSelector } from 'react-redux'

const Course = () => {
  const store = useStore()
  const state = store.getState()
  
  const courseData = useSelector(state => state.courseData)
  const courseID = state.courseID

  if (!courseData) return null
  let prereqs = 'none';
  if (courseData.prereqs) {
    prereqs = courseData.prereqs.join(', ');
  }
  let coreqs = 'none'
  if (courseData.coreqs) {
    coreqs = courseData.coreqs.join(', ');
  }
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

export default Course;
