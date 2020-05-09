export const setCourseID = (courseID) => {
  return {
    type: 'SET_COURSE_ID',
    courseID: courseID
  }
}

export const setCourseData = (courseData) => {
  return {
    type: 'SET_COURSE_DATA',
    courseData: courseData
  }
}

export const setFCEData = (fceData) => {
  return {
    type: 'SET_FCE_DATA',
    fceData: fceData
  }
}

export default {
  setCourseID,
  setCourseData,
  setFCEData
}