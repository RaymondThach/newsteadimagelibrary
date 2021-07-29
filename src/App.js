
import './App.css';
import React from 'react';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//Import Pages
import Home from "./pages/Home";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import Login from "./pages/Login";



//Import Components
import Footer from "./components/Footer";
import Header from "./components/Header";



function App() {
  return (
    <Router>
      <div className="App">
        <Header />

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

           <Route path="/page1">
            <Page1 />
          </Route>
    
          <Route path="/page2">
            <Page2 />
          </Route>

          <Route path="/login">
            <Login />
          </Route> 

        </Switch>

        <Footer />
      </div>
    </Router>
  )
}

export default App;
