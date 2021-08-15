
import React from 'react'
import {Link} from 'react-router-dom'
import {SidebarData} from './SidebarData'
import { useAppContext } from './services/context.js';
import Button from 'react-bootstrap/Button';
import { Auth } from 'aws-amplify';
import './Sidebar.css'
import { useHistory, useLocation } from 'react-router-dom';






//Routes that don't render the Sidebar
const noSidebarRoutes = ['/login', '/first-time-login'];

function Sidebar() {
    
    const { userHasAuthenticated } = useAppContext();
    const history = useHistory();

    //Get the current URL route
    const { pathname } = useLocation();

    //Set the Context service to false for logging out, sign out of Amplify
    async function handleLogout() {
        await Auth.signOut();
        userHasAuthenticated(false);
        history.push('/login');
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
                <img class="logo" src="https://pbs.twimg.com/media/E8wDtRBUUAMgRPV?format=jpg&name=240x240">
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
                    <div class='Sign-Out-Button'> 
                        <Button onClick={handleLogout}>Logout</Button>
                    </div> 
                </nav>
            </>
        )
    }  
}

export default Sidebar
