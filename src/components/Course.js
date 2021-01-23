import React, { useState } from "react";
import { Accordion, Container, Card, Row, Col, Badge, Modal, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { CustomToggle } from "./CustomToggle";
import { Schedule } from "./Schedule";

const ScheduleModal = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Schedule
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.children}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

const CourseRow = (props) => {
  const [viewSchedule, setViewSchedule] = useState(false);
  const courseData = props.data;
  const courseID = courseData.courseID;
  let prereqs = "None";
  if (courseData.prereqs) {
    prereqs = courseData.prereqs.join(", ");
  }
  let coreqs = "None";
  if (courseData.coreqs) {
    coreqs = courseData.coreqs.join(", ");
  }
  let crosslisted = "None";
  if (courseData.crosslisted) {
    const courseIndex = courseData.crosslisted.indexOf(courseID);
    if (courseIndex > -1) {
      courseData.crosslisted.splice(courseIndex, 1);
    }
    crosslisted = courseData.crosslisted.join(", ");
  }

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
                  <h5>Prerequisite Courses</h5>
                  <p>{prereqs ? prereqs : "None"}</p>
                </Col>
                <Col>
                  <h5>Corequisite Courses</h5>
                  <p>{coreqs ? prereqs : "None"}</p>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col>
                  <h5>Cross-listed Courses</h5>
                  <p>{crosslisted ? crosslisted : "None"}</p>
                </Col>
                <Col>
                  <h5>Units</h5>
                  <p>{courseData.units}</p>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col>
                  <Button variant="primary" onClick={() => setViewSchedule(true)}>
                    View Schedule
                  </Button>
                  <ScheduleModal
                    show={viewSchedule}
                    onHide={() => setViewSchedule(false)}
                  >
                    <Schedule schedules={props.schedules} />
                  </ScheduleModal>
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
  const scheduleData = useSelector((state) => state.scheduleData);

  if (!courseData || !scheduleData) return null;
  const rows = [];
  let id = 0;
  for (const course of courseData) {
    let schedules = [];
    for (const schedule of scheduleData) {
      if (schedule.courseID === course.courseID) {
        schedules.push(schedule);
      }
    }
    rows.push(<CourseRow data={course} schedules={schedules} key={id++} />);
  }
  return <>{rows}</>;
};

export default Course;
