import React from "react";
import { Row, Col, Table } from "react-bootstrap";
import { useSelector } from "react-redux";

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
          // Skip CMU Qatar sections
          if (fce.section === "W") return;
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
  const {
    courseID,
    courseName,
    averageHrs,
    averageTeachingRate,
    averageCourseRate,
    fceData,
    semesters,
  } = data.data;
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
            Average Hours per Week: <b>{averageHrs.toFixed(2)}</b>
          </h5>
        </Col>
      </Row>
      <Row>
        <Col>
          <h5>
            Average Teaching Rate: <b>{averageTeachingRate.toFixed(2)}</b>
          </h5>
        </Col>
      </Row>
      <Row>
        <Col>
          <h5>
            Average Course Rate: <b>{averageCourseRate.toFixed(2)}</b>
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
  const averages = getAverages(collatedData);
  const averageHrs = averages.hours;
  const averageTeachingRate = averages.teachingRate;
  const averageCourseRate = averages.courseRate;

  if (collatedData.length == 1) {
    const courseInfo = courseData[0];
    const courseID = courseInfo.courseID;
    const courseName = courseInfo.name;
    const data = {
      courseID: courseID,
      courseName: courseName,
      averageHrs: averageHrs,
      averageTeachingRate: averageTeachingRate,
      averageCourseRate: averageCourseRate,
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
      avgHours: getAverages([course]).hours,
    };
    courseInfo.push(entry);
  }
  const data = {
    totalHrs: averageHrs,
    courseData: courseInfo,
    semesters: fceQuery.semesterCount,
  };
  return <LayoutMultiple data={data} />;
};

export default FCE;
