import React from 'react';
import {
  Form,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Course from './Course';

class Info extends React.Component {
  constructor(props) {
    super(props);

    this.state = { courseID: '', data: null };

    // Bind methods
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }
  handleFieldChange(e) {
    let value = e.target.value;
    this.setState(state => ({
      data: state.data,
      courseID: value
    }));
  }
  handleFormSubmit(e) {
    e.preventDefault();
    let query = this.state.courseID;
    if (query == '') {
      query = 'null';
    }
    let url = 'https://cmucourseapi/courses/courseID/';
    fetch(url + query, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    }).then(response => {
      response.json().then(data => {
        this.setState(state => ({
          data: data,
          courseID: state.courseID
        }));
      });
    });
  }
  render() {
    return (
      <>
        <Row>
          <Col xs={2} md={4} lg={6} className="px-0">
            <Form onSubmit={this.handleFormSubmit}>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Course ID"
                  aria-label="Course ID"
                  aria-describedby="course-id"
                  value={this.state.courseID}
                  onChange={this.handleFieldChange}
                />
                <InputGroup.Append>
                  <Button variant="outline-secondary" type="submit">
                    <FontAwesomeIcon icon={faSearch} />
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Form>
          </Col>
        </Row>
        <Course data={this.state.data} />
      </>
    );
  }
}

export default Info;
