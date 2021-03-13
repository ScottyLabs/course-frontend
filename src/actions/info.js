const setCourseIDs = (courseIDs) => {
  return {
    type: "SET_COURSE_IDs",
    courseIDs: courseIDs,
  };
};

const setCourseData = (courseData) => {
  return {
    type: "SET_COURSE_DATA",
    courseData: courseData,
  };
};

const setFCEData = (fceData) => {
  return {
    type: "SET_FCE_DATA",
    fceData: fceData,
  };
};

const addCourseData = (courseData) => {
  return {
    type: "ADD_COURSE_DATA",
    courseData: courseData[0],
  };
};

const addFCEData = (fceData) => {
  return {
    type: "ADD_FCE_DATA",
    fceData: fceData[0],
  };
};

export default {
  setCourseIDs,
  setCourseData,
  setFCEData,
  addCourseData,
  addFCEData,
};
