
import './App.css';
import React from 'react';
import { Router, Route, Switch } from "react-router-dom";

import Amplify from "aws-amplify";
import { AmplifyAuthenticator} from '@aws-amplify/ui-react';


import awsExports from "./aws-exports";

import { createBrowserHistory as createHistory } from 'history'
//import Navbar from 'react-bootstrap/Navbar';
//import Nav from 'react-bootstrap/Nav';

import Sidebar from './components/Sidebar'
import UploadMediaFile from './components/pages/UploadFile';
import HomePage from './components/pages/HomePage';

Amplify.configure(awsExports);


const history = createHistory();

function App() {
  return (
    <AmplifyAuthenticator>
    <div className="App">
      <Router history={history}>
        <Sidebar/>
        <Switch>
          
          <Route path="/upload-item" component={UploadMediaFile}/>
          <Route path="/" exact component = {HomePage}/>
        </Switch>
      </Router>
    </div>
    </AmplifyAuthenticator>
    
  );
}

export default App;
