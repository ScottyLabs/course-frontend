export const setCourseIDs = (courseIDs) => {
  return {
    type: "SET_COURSE_IDs",
    courseIDs: courseIDs,
  };
};

export const setCourseData = (courseData) => {
  return {
    type: "SET_COURSE_DATA",
    courseData: courseData,
  };
};

export const setFCEData = (fceData) => {
  return {
    type: "SET_FCE_DATA",
    fceData: fceData,
  };
};

export default {
  setCourseIDs,
  setCourseData,
  setFCEData,
};
