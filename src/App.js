import './App.css';
import React, { useState, useEffect } from 'react';
import { Redirect, BrowserRouter, Route, Switch } from 'react-router-dom';
import Amplify, { Auth } from 'aws-amplify';
import awsExports from './aws-exports';
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
            <BrowserRouter history={history}>
              <Sidebar/>
              <Switch>
              <Route path='/collections' component={Collections}/>
                <Route path='/login' component={Login}/>
                <Route path='/home' exact component = {Categories}/>
                <Route path='/upload-item' component={UploadMediaFile}/>
                <Route path='/' render= {() => {
                    return (
                      isAuthenticated ? 
                      <Redirect to='/home'/> :
                      <Redirect to='/login'/>
                    )
                  }}
                />
              </Switch>
            </BrowserRouter>
        </Context.Provider>
    </div> 
  );
}

export default App;
