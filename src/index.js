import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import './index.css';
import { PandaAja } from './components/PandaAja';


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <PandaAja />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

