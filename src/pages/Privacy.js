import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export const Privacy = () => {
  return (
    <Container className="h-100">
      <Row className="align-items-center h-100">
        <Col className="col-lg-6 col-md-8 col-12 col-sm-12 mx-auto text-center">
          <img
            src={process.env.PUBLIC_URL + "/images/scotty-circle.svg"}
            className="w-25 mt-5 mb-4"
          />
          <div className="jumbotron py-4 mb-0">
            <p className="h2">ScottyLabs Course Tool</p>
            <p className="lead">
              Your <strong>privacy</strong> is important to us
            </p>
            <hr className="my-4" />
            <p className="h5">What information do we collect?</p>
            <p className="my-0">Name*</p>
            <p className="my-0">Email Address (Andrew ID)*</p>
            <p className="mt-2 mb-0">
              <em>
                <small>* Collected through ScottyLabs Login</small>
              </em>
            </p>
            <hr className="my-4" />
            <p className="h5">What do we use this for?</p>
            <p className="mt-0 mb-3">
              We request this information in order to ensure your identity as a
              member of the Carnegie Mellon University community.
            </p>
            <p className="my-0">
              The FCE data is not meant to be publicly displayed on a website
              since it contains sensitive information about instructors and
              courses.
            </p>
          </div>
          <ul className="list-inline mt-2">
            <li className="list-inline-item">
              <a href="/">ScottyLabs Course Tool</a>
            </li>
            <li className="list-inline-item ml-3">
              <a href="https://scottylabs.org/">Who are we?</a>
            </li>
            <li className="list-inline-item ml-3">
              <a href="/privacy">Privacy</a>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
};
