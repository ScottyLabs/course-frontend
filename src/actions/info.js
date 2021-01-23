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

const setScheduleData = (scheduleData) => {
  return {
    type: "SET_SCHEDULE_DATA",
    scheduleData: scheduleData,
  };
};

export default {
  setCourseIDs,
  setCourseData,
  setFCEData,
  setScheduleData,
};
