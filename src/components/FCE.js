import React from "react";
import {
  Row,
  Col,
  Table,
  Accordion,
  Card,
  Badge,
  Container,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { CustomToggle } from "./CustomToggle";
import Rating from "@material-ui/lab/Rating";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const getAverages = (collatedData) => {
  if (!collatedData || collatedData.length === 0) return 0;
  let totalHrs = 0;
  let teachingRate = 0;
  let courseRate = 0;
  for (const entry of collatedData) {
    const fces = entry.fces;
    let average = 0;
    teachingRate = 0;
    courseRate = 0;
    for (const fce of fces) {
      average += fce.hrsPerWeek;
      teachingRate += fce.rating[7];
      courseRate += fce.rating[8];
    }
    average /= fces.length;
    teachingRate /= fces.length;
    courseRate /= fces.length;
    if (!isNaN(average)) totalHrs += average;
  }
  return {
    hours: totalHrs,
    teachingRate: teachingRate,
    courseRate: courseRate,
  };
};

const FCETable = (data) => {
  console.log(data);
  const fces = data.data.fces;
  const rows = [];
  let i = 0;
  for (const semester of fces) {
    const teachingRate = semester.rating[7];
    const courseRate = semester.rating[8];
    const row = (
      <tr key={i++}>
        <td>{semester.year}</td>
        <td>{semester.semester}</td>
        <td>{semester.instructor}</td>
        <td>
          <b>{semester.hrsPerWeek}</b>
        </td>
        <td>{teachingRate}</td>
        <td>{courseRate}</td>
        <td>{semester.numRespondents}</td>
        <td>{semester.responseRate}</td>
      </tr>
    );
    rows.push(row);
  }
  return (
    <Table bordered responsive size="md">
      <thead>
        <tr>
          <th>Year</th>
          <th>Semester</th>
          <th>Instructor</th>
          <th>FCE Hours</th>
          <th>Teaching Rate</th>
          <th>Course Rate</th>
          <th># of Respondents</th>
          <th>Response Rate</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

const CourseTable = (data) => {
  const courseData = data.data;
  if (!courseData) return null;
  const rows = [];
  let i = 0;
  for (const course of courseData) {
    const row = (
      <tr key={i++}>
        <td>{course.courseID}</td>
        <td>{course.courseName}</td>
        <td>
          <b>{course.avgHours.toFixed(2)}</b>
        </td>
      </tr>
    );
    rows.push(row);
  }
  return (
    <Table bordered responsive size="md">
      <thead>
        <tr>
          <th>Course ID</th>
          <th>Course Name</th>
          <th>Average Hours per Week</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

const trimFCEData = (courses, query) => {
  const collatedData = [];
  for (const data of courses) {
    let semesterCount = Number.parseInt(query?.semesterCount);
    if (isNaN(semesterCount)) semesterCount = 2;
    // const instructor = query?.instructor;
    const enabledSemesters = query?.semesters;

    const fces = [];
    let semCount = 0;

    data.fce.every((year) => {
      let labels = ["fall", "summer", "spring"];
      for (const label of labels) {
        if (!year[label]) continue;
        if (!enabledSemesters[label]) continue;
        let found = false;
        year[label].forEach((fce) => {
          // Skip CMU Qatar sections
          if (fce.section === "W") return;
          fce["year"] = year.year;
          fce["semester"] = label;
          if (fce.hrsPerWeek !== 0) {
            fces.push(fce);
            found = true;
          }
        });
        if (found) semCount++;
        if (semCount >= semesterCount) return false;
      }
      return true;
    });
    collatedData.push({ courseID: data.courseID, fces: fces });
  }
  return collatedData;
};

const getHoursColor = (hours) => {
  if (hours < 8) return "success";
  else if (hours < 12) return "info";
  else if (hours < 20) return "warning";
  else return "danger";
};

const FCESummary = (props) => {
  const count = Math.max.apply(
    Math,
    props.data.semesterCounts.map((x) => x.count)
  );
  return (
    <Row className="mt-3 mx-0">
      <Accordion defaultActiveKey="0" className="w-100">
        <Card bg="light">
          <CustomToggle eventKey="0">FCE Summary </CustomToggle>
          <Accordion.Collapse eventKey="0">
            <Container>
              <Row className="mt-3">
                <Col>
                  <h4>
                    Total Average Hours per Week:{" "}
                    {props.data.totalHrs.toFixed(2)}
                  </h4>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <CourseTable data={props.data.courseData} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <p className="lead">
                    Data collated across <strong>{count}</strong> semesters{" "}
                    {count < props.data.semesters ? (
                      <OverlayTrigger
                        placement={"right"}
                        overlay={
                          <Tooltip id={"warning-summary"}>
                            Unable to retrieve data from at least{" "}
                            {props.data.semesters - count} semesters!
                          </Tooltip>
                        }
                      >
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                      </OverlayTrigger>
                    ) : null}
                  </p>
                </Col>
              </Row>
            </Container>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </Row>
  );
};

const FCERow = (props) => {
  console.log(props.data);
  return (
    <Row className="mt-3 mx-0">
      <Accordion defaultActiveKey="0" className="w-100">
        <Card bg="light">
          <CustomToggle eventKey="0">
            {props.data.courseID} {props.data.courseName}{" "}
            <Badge variant="info" className="ml-2">
              {props.data.courseDept}
            </Badge>
          </CustomToggle>
          <Accordion.Collapse eventKey="0">
            <Container>
              <Row className="mt-3">
                <Col md={3}>
                  <h5>Average Hours per Week </h5>
                </Col>
                <Col md={9}>
                  <h5>
                    <Badge pill variant={getHoursColor(props.data.avgHours)}>
                      {props.data.avgHours.toFixed(2)}
                    </Badge>
                  </h5>
                </Col>
              </Row>
              <Row>
                <Col md={3}>
                  <h5>Average Teaching Rate </h5>
                </Col>
                <Col md={9}>
                  <h6
                    className="mr-2"
                    style={{
                      display: "inline",
                      position: "relative",
                      bottom: "0.25em",
                    }}
                  >
                    {props.data.avgTeachingRate.toFixed(2)}
                  </h6>
                  <div style={{ display: "inline" }}>
                    <Rating
                      name="avgTeaching"
                      value={props.data.avgTeachingRate}
                      precision={0.5}
                      readOnly
                      emptyIcon={<StarBorderIcon />}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={3}>
                  <h5>Average Course Rate </h5>
                </Col>
                <Col md={9}>
                  <h6
                    className="mr-2"
                    style={{
                      display: "inline",
                      position: "relative",
                      bottom: "0.25em",
                    }}
                  >
                    {props.data.avgCourseRate.toFixed(2)}
                  </h6>
                  <div style={{ display: "inline" }}>
                    <Rating
                      name="avgCourse"
                      value={props.data.avgCourseRate}
                      precision={0.5}
                      readOnly
                      emptyIcon={<StarBorderIcon />}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <FCETable data={props.data} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <p className="lead">
                    Data collated across{" "}
                    <strong>{props.data.semesterCount}</strong> semesters{" "}
                    {props.data.semesterCount < props.semesters ? (
                      <OverlayTrigger
                        placement={"right"}
                        overlay={
                          <Tooltip id={"warning-" + props.key}>
                            Unable to retrieve data from{" "}
                            {props.semesters - props.data.semesterCount}{" "}
                            semesters!
                          </Tooltip>
                        }
                      >
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                      </OverlayTrigger>
                    ) : null}
                  </p>
                </Col>
              </Row>
            </Container>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </Row>
  );
};

const getCourseInfo = (courseID, courseData) => {
  for (const course of courseData) {
    if (course.courseID === courseID) {
      return [course.name, course.department];
    }
  }
  return [null, null];
};

const FCE = () => {
  const rawFCEData = useSelector((state) => state.fceData);
  const fceQuery = useSelector((state) => state.fceQuery);
  const courseData = useSelector((state) => state.courseData);

  if (!rawFCEData || !courseData || !rawFCEData.length || !courseData.length)
    return null;

  const collatedData = trimFCEData(rawFCEData, fceQuery);
  const averages = getAverages(collatedData);
  const averageHrs = averages.hours;

  const courseInfo = [];
  const countObjects = [];
  for (const course of collatedData) {
    const averages = getAverages([course]);
    const [courseName, courseDept] = getCourseInfo(course.courseID, courseData);
    const semesterCount = [
      ...new Set(
        course.fces.map((x) => x.year.toString() + x.semester.toString())
      ),
    ].length;
    const entry = {
      courseID: course.courseID,
      courseName: courseName,
      courseDept: courseDept,
      avgHours: averages.hours,
      avgTeachingRate: averages.teachingRate,
      avgCourseRate: averages.courseRate,
      fces: course.fces,
      semesterCount: semesterCount,
    };
    courseInfo.push(entry);
    countObjects.push({ courseID: course.courseID, count: semesterCount });
  }
  const data = {
    totalHrs: averageHrs,
    courseData: courseInfo,
    semesters: fceQuery.semesterCount,
    semesterCounts: countObjects,
  };
  const rows = [];
  let id = 0;
  rows.push(<FCESummary data={data} key={id++} />);
  for (const course of data.courseData) {
    rows.push(<FCERow data={course} semesters={data.semesters} key={id++} />);
  }
  return <>{rows}</>;
};

export default FCE;
