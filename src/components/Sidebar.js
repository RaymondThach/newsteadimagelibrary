
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
