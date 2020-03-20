import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Row,
  Container
} from 'react-bootstrap';
import Info from './components/Info';

function App() {
  return (
    <div className="App">
      <Container>
        <Row className="mt-3">
          <h3>Query Course Info</h3>
        </Row>
        <Info />
      </Container>
    </div>
  );
}

export default App;
