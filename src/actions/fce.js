const setInstructor = (instructor) => {
  return {
    type: "SET_INSTRUCTOR",
    instructor: instructor,
  };
};

const setSemesterCount = (semesterCount) => {
  return {
    type: "SET_SEMESTER_COUNT",
    semesterCount: semesterCount,
  };
};

const setSemesters = (fall, spring, summer) => {
  return {
    type: "SET_SEMESTERS",
    semesters: {
      fall: fall,
      spring: spring,
      summer: summer,
    },
  };
};

export default {
  setInstructor,
  setSemesterCount,
  setSemesters,
};
