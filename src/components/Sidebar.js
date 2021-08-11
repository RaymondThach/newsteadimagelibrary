
import React from 'react'
import {Link} from 'react-router-dom'
import {SidebarData} from './SidebarData'
import { useAppContext } from './services/context.js';
import Button from 'react-bootstrap/Button';
import { Auth } from 'aws-amplify';
import './Sidebar.css'

function Sidebar() {
    const { userHasAuthenticated } = useAppContext();

    //Set the Context service to false for logging out, sign out of Amplify
    async function handleLogout() {
        await Auth.signOut();
        userHasAuthenticated(false);
    }
    return (
        <>
            <div className="navbar">
                <link to="#" className="menu-bars"></link>
            </div>
            <nav className = 'nav-menu'>
                {SidebarData.map((item, index) => {
                    return(
                        <li key={index} className={item.cName}>
                            <Link to={item.path}>
                                {item.title}
                            </Link>
                        </li>
                    )
                })}
               <div class='Sign-Out-Button'> 
                <Button onClick={handleLogout}>Logout</Button>
               </div>  
            </nav>
        </>
    )
}

export default Sidebar
