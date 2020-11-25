import React from "react";
import { Row, Col, FormControl } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import * as actions from "../actions";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from "@material-ui/core/styles";
import { green, orange, lightBlue } from "@material-ui/core/colors";

const SpringCheckbox = withStyles({
  root: {
    color: green[400],
    "&$checked": {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const FallCheckbox = withStyles({
  root: {
    color: orange[600],
    "&$checked": {
      color: orange[800],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const SummerCheckbox = withStyles({
  root: {
    color: lightBlue[400],
    "&$checked": {
      color: lightBlue[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

// TODO: add checkboxes for professors
const FCEForm = () => {
  const dispatch = useDispatch();
  const fceData = useSelector((state) => state.fceData);

  const fall = useSelector((state) => state.fceQuery.semesters.fall);
  const spring = useSelector((state) => state.fceQuery.semesters.spring);
  const summer = useSelector((state) => state.fceQuery.semesters.summer);

  const [instructor, setInstructor] = useState("");
  const [semesterCount, setSemesterCount] = useState("");

  const handleSemesterChange = async (e, idx) => {
    const checked = e.target.checked;
    if (idx === 0) {
      dispatch(actions.fce.setSemesters(checked, spring, summer));
    } else if (idx === 1) {
      dispatch(actions.fce.setSemesters(fall, checked, summer));
    } else if (idx === 2) {
      dispatch(actions.fce.setSemesters(fall, spring, checked));
    }
  };

  const handleInstructorChange = (e) => {
    setInstructor(e.target.value);
    dispatch(actions.fce.setInstructor(e.target.value));
  };

  const handleSemesterCountChange = (e) => {
    setSemesterCount(e.target.value);
    dispatch(actions.fce.setSemesterCount(e.target.value));
  };

  return (
    <>
      <Row className="mt-1">
        <Col md={4}>
          <h6 className="fce-semester">Semesters</h6>
        </Col>
        <Col md={4}>
          <FormGroup row>
            <FormControlLabel
              control={
                <FallCheckbox
                  checked={fall}
                  onChange={(checked) => handleSemesterChange(checked, 0)}
                  name="fall"
                />
              }
              label="Fall"
            />
            <FormControlLabel
              control={
                <SpringCheckbox
                  checked={spring}
                  onChange={(checked) => handleSemesterChange(checked, 1)}
                  name="spring"
                />
              }
              label="Spring"
            />
            <FormControlLabel
              control={
                <SummerCheckbox
                  checked={summer}
                  onChange={(checked) => handleSemesterChange(checked, 2)}
                  name="summer"
                />
              }
              label="Summer"
            />
          </FormGroup>
        </Col>
      </Row>
      <Row className="mt-1">
        <Col md={4}>
          <h6>Number of Semesters to Sample</h6>
        </Col>
        <Col md={4}>
          <FormControl
            placeholder="Default: 2"
            aria-label="Number of Semesters to Sample"
            aria-describedby="semesters"
            onChange={handleSemesterCountChange}
          />
        </Col>
      </Row>
      <Row className="mt-1">
        <Col md={4}>
          <h6>Instructor(s)</h6>
        </Col>
        <Col md={4}>
          <FormControl
            placeholder="Instructor(s)"
            aria-label="Instructor(s)"
            aria-describedby="instructor"
            onChange={handleInstructorChange}
            disabled={fceData}
          />
        </Col>
      </Row>
    </>
  );
};

export default FCEForm;
