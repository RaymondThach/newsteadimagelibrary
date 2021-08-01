
import './App.css';
import {React, useState, useEffect }from 'react';
import { Router, Route, Switch } from 'react-router-dom';
//import { AmplifyAuthenticator, AmplifySignIn } from '@aws-amplify/ui-react'; ONLY USED for default UI components.
import awsExports from './aws-exports';

import { createBrowserHistory as createHistory } from 'history';
//import Navbar from 'react-bootstrap/Navbar';
//import Nav from 'react-bootstrap/Nav';

import Sidebar from './components/Sidebar'
import UploadMediaFile from './components/pages/UploadFile';
import HomePage from './components/pages/HomePage';
import Login from './components/pages/LoginPage'

//AWS Library for event listeners
import Amplify, { Hub } from 'aws-amplify';

Amplify.configure(awsExports);

const history = createHistory();

function App() {
  //Log the current user. Use the router only if currentUser exists, else show the Login component.
  const[currentUser, setCurrentUser] = useState();
  useEffect(() => {
    Hub.listen('auth', (event) => {
      setCurrentUser(event.payload.data);
    });
  });
  return (
    <div className='App'>
        {currentUser ?
        <Router history={history}>
          <Sidebar/>
          <Switch>
            <Route path='/upload-item' component={UploadMediaFile}/>
            <Route path='/' exact component = {HomePage}/>
          </Switch>
        </Router>
        : <Login/>}
    </div> 
  );
}

export default App;
