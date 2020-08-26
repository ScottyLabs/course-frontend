import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Main } from './pages/Main';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Route path="/" component={Main} />
    </Router>
  );
}

export default App;
