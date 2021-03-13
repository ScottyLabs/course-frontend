const initState = {
  courseID: "",
  fceMode: true,
  fceQuery: {
    instructor: null,
    semesterCount: 2,
    semesters: {
      fall: true,
      spring: true,
      summer: false,
    },
  },
};

const rootReducer = (state = initState, action) => {
  if (action.type === "SET_SEMESTER_COUNT") {
    return {
      ...state,
      fceQuery: {
        ...state.fceQuery,
        semesterCount: action.semesterCount,
      },
    };
  } else if (action.type === "SET_INSTRUCTOR") {
    return {
      ...state,
      fceQuery: {
        ...state.fceQuery,
        instructor: action.instructor,
      },
    };
  } else if (action.type === "SET_COURSE_DATA") {
    return {
      ...state,
      courseData: action.courseData,
    };
  } else if (action.type === "SET_FCE_DATA") {
    return {
      ...state,
      fceData: action.fceData,
    };
  } else if (action.type === "SET_SEMESTERS") {
    return {
      ...state,
      fceQuery: {
        ...state.fceQuery,
        semesters: action.semesters,
      },
    };
  } else if (action.type === "ADD_COURSE_DATA") {
    return {
      ...state,
      courseData: state.courseData
        ? [...state.courseData, action.courseData]
        : action.courseData,
    };
  } else if (action.type === "ADD_FCE_DATA") {
    return {
      ...state,
      fceData: state.fceData
        ? [...state.fceData, action.fceData]
        : action.fceData,
    };
  }
  return state;
};

export default rootReducer;
