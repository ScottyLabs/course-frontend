import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Row,
  Col,
  Container
} from 'react-bootstrap';
import Info from './components/Info';

function App() {
  return (
    <div className="App">
      <Container>
        <Row className="mt-3">
          <Col>
           <h2>ScottyLabs Course API</h2>
          </Col>
        </Row>
        <Info />
      </Container>
    </div>
  );
}

export default App;
