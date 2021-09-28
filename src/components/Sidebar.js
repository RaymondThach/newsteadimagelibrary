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
    const { userHasAuthenticated } = useAppContext();
    const history = useHistory();

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
                         <a href="#">Alphabetically</a>
                         <a href="#">Recently Added</a>
                         <a href="#">Earliest Added</a>
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
