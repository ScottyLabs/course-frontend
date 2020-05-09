import React from "react"
import { Row, Col } from "react-bootstrap"
import { useSelector } from "react-redux"

const getAverageHrs = (data, query) => {
  if (!data) return 0
  let semesterCount = query?.semesterCount
  const instructor = query?.instructor
  const enabledSemesters = query?.semesters

  if (!Number.isInteger(semesterCount)) semesterCount = 2
  else semesterCount = Number.parseInt(semesterCount)

  let fces = []
  let semCount = 0

  data.fce.every((year) => {
    let labels = ["fall", "summer", "spring"]
    for (let label of labels) {
        if (!year[label]) continue
        if (!enabledSemesters[label]) continue
        year[label].forEach((fce) => {
           fces.push(fce)
        })
        if (++semCount >= semesterCount) return false
    }
  })

  if (fces.length === 0) return 0
  const count = fces.length
  let average = 0
  fces.forEach((fce) => {
    average += fce.hrsPerWeek
  })
  average /= count
  return average
}

const FCE = () => {
  const fceData = useSelector(state => state.fceData)
  const fceQuery = useSelector(state => state.fceQuery)

  if (!fceData || !fceData.fce) return null;

  const averageHrs = getAverageHrs(fceData, fceQuery)
  return (
    <>
      <Row className="mt-5">
        <Col>
          <h5>Average Hours per Week:</h5>
        </Col>
        <Col>
          <p>{averageHrs.toFixed(2)}</p>
        </Col>
      </Row>
      <Row className="mt-4"></Row>
    </>
  )
}

export default FCE
