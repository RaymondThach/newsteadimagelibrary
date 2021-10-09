import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SidebarData } from './SidebarData'
import { useAppContext } from './services/context.js';
import { Auth } from 'aws-amplify';
import './Sidebar.css'
import { useHistory, useLocation } from 'react-router-dom';
import transparentLogo from './images/transparentLogo.png';
import { FcSearch } from 'react-icons/fc';

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

    //State variable holding the search string for search field
    const [ searchTerm, setSearchTerm ] = useState('');
    
    //State array for holding original categories array to repopulate categories page upon search field reset
    const [ originalCats, setOriginalCats ] = useState([]);

    //State array for holding original collections array to repopulate collections page upon search field reset
    const [ originalCols, setOriginalCols ] = useState([]);

    //State array for holding original items array to repopulate category items and collection items page upon search field reset
    const [ originalItems, setOriginalItems ] = useState([]);

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

    /* Search Functioanlity */ 
    //Copy the original set of categories, then handle the renders after first render for search
    function searchCats() {
        if (originalCats.length === 0){
            setOriginalCats(categories);
        }
        if (searchTerm === '') {
            setCategories(originalCats);
        }
        else if (originalCats.length > 0 ) {
            let results = originalCats.filter(cat => {
                return cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
            })
            setCategories(results);
        }  
    }

    //Copy the original set of collections, then handle the renders after first render for search
    function searchCols() {
        if (originalCols.length === 0){
            setOriginalCols(collectionNames);
        }
        if (searchTerm === '') {
            setCollectionNames(originalCols);
        }
        else if (originalCols.length > 0) {
            let results = originalCols.filter(col => {
                return col.name.toLowerCase().includes(searchTerm.toLowerCase());
            })
            setCollectionNames(results);
        }  
    }

    //Copy the original set of items, then handle the renders after first render for search
    function searchItems() {
        if (originalItems.length === 0){
            setOriginalItems(items);
        }
        if (searchTerm === '') {
            setItems(originalItems);
        }
        else if (originalItems.length > 0) {
            let results = originalItems.filter(item => {
                return item.name.toLowerCase().includes(searchTerm.toLowerCase());
            })
            setItems(results);
        }  
    }

    //Search based on route accounting for pages categories, category items, collections, and collection items
    async function searchDB(){
        if (window.location.pathname.includes('categories/')) {
            try {
                searchItems();
            } catch (e) {
                history.push('/categories');
            }
        }
        else if (window.location.pathname.includes('categories')) {
            searchCats();
        }
        else if (window.location.pathname.includes('collections/')) {
            try {
                searchItems();
            } catch (e) {
                history.push('/collections');
            }
        }
        else if (window.location.pathname.includes('collections')) {
            searchCols();
        }
    }

    //Search handler for the search form of Sidebar
    function handleSubmit(event) {
        searchDB();
        //Prevent Redirection to Categories Page
        event.preventDefault();
    }

    //Handle initial re-rendering of categories for searching
    useEffect(() => {
        if (searchTerm === '') {
            setCategories(originalCats);
        }
        else if (originalCats.length > 0 ) {
            let results = originalCats.filter(cat => {
                return cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
            })
            setCategories(results);
        }  
    }, [originalCats]);
    
    //Handle initial re-rendering of collections for searching
    useEffect(() => {
        if (searchTerm === '') {
            setCollectionNames(originalCols);
        }
        else if (originalCols.length > 0) {
            let results = originalCols.filter(col => {
                return col.name.toLowerCase().includes(searchTerm.toLowerCase());
            })
            setCollectionNames(results);
        }  
    }, [originalCols]);

    //Handle initial re-rendering of items for searching
    useEffect(() => {
        if (searchTerm === '') {
            setItems(originalItems);
        }
        else if (originalItems.length > 0) {
            let results = originalItems.filter(item => {
                return item.name.toLowerCase().includes(searchTerm.toLowerCase());
            })
            setItems(results);
        }  
    }, [originalItems]);

    //If the route is included in the noSidebarRoutes array return null instead of rendering the Sidebar
    if (noSidebarRoutes.some((item) => pathname === item)) {
        return null
    }
    else
    {
        return (
            <div class='content-background'>
                <div className="navbar" >
                    <link to="#" className="menu-bars"></link>
                </div>
                <nav className = 'nav-menu'>
                    <img class="logo" src={transparentLogo}>
                    </img>
                    <form class='searchBar' onSubmit={ handleSubmit }>
                        <input id='searchField' type='search' value={searchTerm} placeholder={'Search'} onChange={(event) => { setSearchTerm(event.target.value); }}></input>
                        <FcSearch id='searchBtn' size={30} onClick={handleSubmit}/>
                    </form>
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
                                <li key={index} className={item.cName} onClick={() => setSearchTerm('')}>
                                    <Link to={item.path}>
                                        {item.title}
                                    </Link>
                                </li>
                            )
                        })
                    }
                    <div class='Delete' > 
                        <button onClick={switchDeleteMode} class='deleteBtn'>Delete Mode</button>
                    </div>
                    <div class='Sign-Out-Button' > 
                        <button onClick={handleLogout} class='signOut'>Logout</button>
                    </div>
                </nav> 
            </div>
        )
    }  
}

export default Sidebar
