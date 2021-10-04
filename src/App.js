import './App.css';
import React, { useState, useEffect } from 'react';
import { Redirect, BrowserRouter, Route, Switch } from 'react-router-dom';
import Amplify, { Auth } from 'aws-amplify';
import awsExports from './aws-exports';
import { createBrowserHistory as createHistory } from 'history'
import Sidebar from './components/Sidebar'
import UploadMediaFile from './components/pages/UploadFile';
import Categories from './components/pages/Categories';
import Login from './components/pages/LoginPage'
import Collections from './components/pages/Collections';
import { Context } from './components/services/context';
import CollectionItem from './components/pages/CollectionItem.js';
import CategoryItem from './components/pages/CategoryItem.js';
import UserManagement from './components/pages/UserManagement.js';

Amplify.configure(awsExports);

const history = createHistory();

function App() {
  //Context varaible that tracks if the user is logged in
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  //Context variable that tracks if gallery modal is open
  const [ galleryIsOpen, galleryHasOpened ] = useState(false);

  //Context variable that tracks delete mode to show delete buttons or not for categories and items
  const [ deleteMode, setDeleteMode ] = useState(false);

  //State array for storing all categories and their random photo
  const [ categories, setCategories ] = useState([]);

  //State array of media files of selected category
  const [ items, setItems ] = useState([]);

  //State array of collections 
  const [ collectionNames, setCollectionNames ] = useState([]);

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
        <Context.Provider value={{ isAuthenticated, userHasAuthenticated, categories, setCategories, items, setItems, collectionNames, setCollectionNames, galleryIsOpen, galleryHasOpened, deleteMode, setDeleteMode}}>
            <BrowserRouter history={history}>
              {
                galleryIsOpen ? null : <Sidebar/>
              }
              <Switch>
                <Route path='/categories/:categoryName/:id' component={CategoryItem}/>
                <Route path='/categories' component={Categories}/>
                <Route path="/collections/:name/:id" component={CollectionItem}/> 
                <Route path='/collections' component={Collections}/>
                <Route path='/login' component={Login}/>
                <Route path='/upload-item' component={UploadMediaFile}/>
                <Route path='/admin-user-accounts' component={UserManagement}/>
                <Route path='/' render= {() => {
                    return (
                      isAuthenticated ? 
                      <Redirect to='/categories'/> :
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
