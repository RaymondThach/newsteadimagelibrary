import React from 'react'
import {Link} from 'react-router-dom'
import {SidebarData} from './SidebarData'
import { useAppContext } from './services/context.js';
import { Auth } from 'aws-amplify';
import './Sidebar.css'
import { useHistory, useLocation } from 'react-router-dom';
import transparentLogo from './images/transparentLogo.png';

//Routes that don't render the Sidebar
const noSidebarRoutes = ['/login'];

function Sidebar() {
    //Context to check that user session is valid
    const { userHasAuthenticated } = useAppContext();
    
    //Initiate history for redirection when navigating backwards and forwards
    const history = useHistory();

    //Context State array for storing all categories lifted to App.js level
    //Used to sort the categories fetched initially from the categories.js (sorting alphabetical, newest, oldest)
    const { categories, setCategories } = useAppContext();

    //Context state array for items of a selected category lifted to App.js
    //Used to sort category items fetched initially by alphabetical, newest and oldest from categoryItem.js
    const { items, setItems } = useAppContext();

    //Context state array for storing all collections used in sorting by alphabetical
    const { collectionNames, setCollectionNames } = useAppContext();

    //Use declared context variables to track delete mode
    const { deleteMode, setDeleteMode } = useAppContext();

    //Get the current URL route
    const { pathname } = useLocation();

    //Set the Context service to false for logging out, sign out of Amplify
    async function handleLogout() {
        await Auth.signOut();
        userHasAuthenticated(false);
        history.push('/login');
    }

    //Change the deleteMode from the previous state
    function switchDeleteMode() {
        setDeleteMode(!deleteMode);
    }

    /* Sort by alphabetical */
    //Ordering categories alphabetically based on integer returned (categories.js)
    function sortCatAlphabetically() {
        const sortedArr = categories.sort(function(a, b) {
            var catNameA = a.categoryName.toUpperCase();
            var catNameB = b.categoryName.toUpperCase();
            return (catNameA < catNameB) ? -1 : (catNameA > catNameB) ? 1 : 0;
        });
        setCategories(sortedArr);
    }

    //Ordering collections alphabetically based on integer returned (collections.js)
    function sortColAlphabetically() {
        const sortedArr = collectionNames.sort(function(a, b) {
            var colNameA = a.name.toUpperCase();
            var colNameB = b.name.toUpperCase();
            return (colNameA < colNameB) ? -1 : (colNameA > colNameB) ? 1 : 0;
        });
        setCollectionNames(sortedArr);
    }

    //Ordering items alphabetically based on integer returned, functionality shared by category and collection items
    function sortItemsAlphabetically() {
        const sortedArr = items.sort(function(a, b) {
            var itemNameA = a.name.toUpperCase();
            var itemNameB = b.name.toUpperCase();
            return (itemNameA < itemNameB) ? -1 : (itemNameA > itemNameB) ? 1 : 0;
        });
        setItems(sortedArr);
    }

    //Handler for choosing which function to use based on which state array is populated for sorting alphabetically
    function sortByAlphabetical() {
        if (categories.length > 0) {
            sortCatAlphabetically();
        }
        else if (collectionNames.length > 0) {
            sortColAlphabetically();
        }
        else if (items.length > 0) {
            sortItemsAlphabetically();
        }
    }

    /* Sort by Newest */
    //Ordering categories, collections, category items, collection items by newest
    function sortAllNewest(array) {
        array.sort(function(a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }
    //Handler for choosing which array to pass to the sorting function based on which is populated
    function sortByNewest() {
        if (categories.length > 0) {
            sortAllNewest(categories);
        }
        else if (collectionNames.length > 0) {
            sortAllNewest(collectionNames);
        }
        else if (items.length > 0) {
            sortAllNewest(items);
        }
    }

    /* Sort by Oldest */
    //Ordering categories, collections, category items, collection items by oldest
    function sortAllOldest(array) {
        array.sort(function(a, b) {
            return new Date(a.createdAt) - new Date(b.createdAt);
        });
    }
    //Handler for choosing which array to pass to the sorting function based on which is populated
    function sortByOldest() {
        if (categories.length > 0) {
            sortAllOldest(categories);
        }
        else if (collectionNames.length > 0) {
            sortAllOldest(collectionNames);
        }
        else if (items.length > 0) {
            sortAllOldest(items);
        }
    }

    //If the route is included in the noSidebarRoutes array return null instead of rendering the Sidebar
    if (noSidebarRoutes.some((item) => pathname === item)) {
        return null
    }
    else
    {
        return (
            <>
                <div className="navbar">
                    <link to="#" className="menu-bars"></link>
                </div>
                <nav className = 'nav-menu'>
                <img class="logo" src={transparentLogo}>
                </img>
                <div class="dropdown">
                    <button class="dropbtn">Sort By</button>
                     <div class="dropdown-content">
                         <a href="#" onClick={() => {sortByAlphabetical();}}>Alphabetically</a>
                         <a href="#" onClick={() => {sortByNewest();}}>Newest</a>
                         <a href="#" onClick={() => {sortByOldest();}}>Oldest</a>
                         </div>
                </div>
                    {SidebarData.map((item, index) => {
                            return(
                                <li key={index} className={item.cName}>
                                    <Link to={item.path}>
                                        {item.title}
                                    </Link>
                                </li>
                            )
                        })
                    }
                    <div class='Delete' > 
                        <button onClick={handleLogout} onClick={switchDeleteMode} class='deleteBtn'>Delete Mode</button>
                    </div>
                    <div class='Sign-Out-Button' > 
                        <button onClick={handleLogout} class='signOut'>Logout</button>
                    </div>
                </nav> 
            </>
        )
    }  
}

export default Sidebar
