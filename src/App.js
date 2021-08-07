
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Link, Route } from "react-router-dom";

//Import Pages
import Home from "./pages/Home";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import Login from "./pages/Login";

 

//Import Components
import Footer from "./components/Footer";
import Header from "./components/Header";


<<<<<<< Updated upstream

function App() {
  return (
    <Router>
      <div className="App">
        <Header />

=======
import Sidebar from './components/Sidebar';
import UploadMediaFile from './components/pages/UploadFile';
import HomePage from './components/pages/HomePage';

import Header from './components/Header';


Amplify.configure(awsExports);


const history = createHistory();

function App() {
  return (
    //<AmplifyAuthenticator>
    

    <div className="App">
      <img src='/test.png' width="300" height="200"></img>
      <Header />
      <Router history={history}>
        <Sidebar/>
>>>>>>> Stashed changes
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <Route path="/Page1">
            <Page1 />
          </Route>

          <Route path="/Page2">
            <Page2 />
          </Route>

        </Switch>
<<<<<<< Updated upstream

        <Footer />
      </div>
    </Router>
  )}

  export default App;
=======
      </Router>
    </div>
    //</AmplifyAuthenticator>
    
  );
}

export default App;
>>>>>>> Stashed changes
