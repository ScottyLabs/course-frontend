import React from "react";
import { Row, Col, Table } from "react-bootstrap";
import { useSelector } from "react-redux";

const getAverageHrs = (collatedData) => {
  if (!collatedData || collatedData.length === 0) return 0;
  let totalHrs = 0;
  for (const entry of collatedData) {
    const fces = entry.fces;
    const count = fces.length;
    let average = 0;
    for (const fce of fces) {
      average += fce.hrsPerWeek;
    }
    average /= count;
    if (!isNaN(average)) totalHrs += average;
  }
  return totalHrs;
};

const FCETable = (data) => {
  const fces = data.data.fces;
  const rows = [];
  let i = 0;
  for (const semester of fces) {
    const row = (
      <tr key={i++}>
        <td>{semester.year}</td>
        <td>{semester.semester}</td>
        <td>{semester.instructor}</td>
        <td>
          <b>{semester.hrsPerWeek}</b>
        </td>
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
    const instructor = query?.instructor;
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
          fce["year"] = year.year;
          fce["semester"] = label;
          if (fce.hrsPerWeek != 0) {
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

const LayoutSingle = (data) => {
  const { courseID, courseName, totalHrs, fceData, semesters } = data.data;
  return (
    <>
      <Row className="mt-5">
        <Col>
          <h3>
            FCEs for {courseID}: {courseName}
          </h3>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <h5>
            Average Hours per Week: <b>{totalHrs.toFixed(2)}</b>
          </h5>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            Across <b>{semesters}</b> semesters
          </p>
        </Col>
      </Row>
      <FCETable data={fceData} />
    </>
  );
};

const LayoutMultiple = (data) => {
  const { totalHrs, courseData, semesters } = data.data;
  return (
    <>
      <Row className="mt-5">
        <Col>
          <h4>Total Average Hours per Week: {totalHrs.toFixed(2)}</h4>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            Across <b>{semesters}</b> semesters
          </p>
        </Col>
      </Row>
      <CourseTable data={courseData} />
    </>
  );
};

const getCourseName = (courseID, courseData) => {
  for (const course of courseData) {
    if (course.courseID === courseID) return course.name;
  }
  return null;
};

const FCE = () => {
  const rawFCEData = useSelector((state) => state.fceData);
  const fceQuery = useSelector((state) => state.fceQuery);
  const courseData = useSelector((state) => state.courseData);

  if (!rawFCEData || !courseData) return null;

  const collatedData = trimFCEData(rawFCEData, fceQuery);
  const totalHrs = getAverageHrs(collatedData);

  if (collatedData.length == 1) {
    const courseInfo = courseData[0];
    const courseID = courseInfo.courseID;
    const courseName = courseInfo.name;
    const data = {
      courseID: courseID,
      courseName: courseName,
      totalHrs: totalHrs,
      fceData: collatedData[0],
      semesters: fceQuery.semesterCount,
    };

    return <LayoutSingle data={data} />;
  }
  const courseInfo = [];
  for (const course of collatedData) {
    const entry = {
      courseID: course.courseID,
      courseName: getCourseName(course.courseID, courseData),
      avgHours: getAverageHrs([course]),
    };
    courseInfo.push(entry);
  }
  const data = {
    totalHrs: totalHrs,
    courseData: courseInfo,
    semesters: fceQuery.semesterCount,
  };
  return <LayoutMultiple data={data} />;
};

export default FCE;
