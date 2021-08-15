import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Amplify, { Auth } from 'aws-amplify';
import awsExports from './aws-exports';
//import HomePage from './components/pages/HomePage';
import { createBrowserHistory as createHistory } from 'history'
//import Navbar from 'react-bootstrap/Navbar';
//import Nav from 'react-bootstrap/Nav';
import Sidebar from './components/Sidebar'
import UploadMediaFile from './components/pages/UploadFile';
import Categories from './components/pages/Categories';
import Login from './components/pages/LoginPage'
import Collections from './components/pages/Collections';

import { Context } from './components/services/context';

Amplify.configure(awsExports);

const history = createHistory();

function App() {
  //Tracks if the user is logged in
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  //sessionCheck() executes once on first render
  useEffect(() => {
    sessionCheck();
  }, []);
  //Checks if a session with this user already exists on Amplify
  async function sessionCheck() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
  }

  return (
    <div className='App'>
        <Context.Provider value={{ isAuthenticated, userHasAuthenticated }}>
          { isAuthenticated ?
            <BrowserRouter history={history}>
              <Sidebar/>
              <Switch>
                <Route path='/collections' component={Collections}/>
                <Route path='/upload-item' component={UploadMediaFile}/>
                <Route path='/' exact component = {Categories}/>
              </Switch>
            </BrowserRouter>
          : <Login/> }
        </Context.Provider>
    </div> 
  );
}

export default App;
