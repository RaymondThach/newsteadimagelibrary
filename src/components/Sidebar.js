
import React from 'react'
import {Link} from 'react-router-dom'
import {SidebarData} from './SidebarData'
import { AmplifySignOut } from '@aws-amplify/ui-react';
import './Sidebar.css'

function Sidebar() {
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
                
               <div class='Sign-Out-Button'> <AmplifySignOut /></div>
                
            </nav>
            
        </>
        
    )
}

export default Sidebar
