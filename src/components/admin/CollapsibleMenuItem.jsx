import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import * as Icons from 'react-icons/bi';
import { BiChevronDown, BiChevronRight } from 'react-icons/bi';
import './CollapsibleMenuItem.css';

const CollapsibleMenuItem = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);

    const Icon = Icons[`Bi${item.icon.charAt(0).toUpperCase() + item.icon.slice(1).replace(/-./g, x => x[1].toUpperCase())}`] || Icons.BiCircle;

    const toggleSubmenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <li className="collapsible-menu-item">
            <div
                className="sidebar-nav-item collapsible-header"
                onClick={toggleSubmenu}
                role="button"
                tabIndex={0}
            >
                <div className="d-flex align-items-center">
                    <Icon size={20} />
                    <span>{item.label}</span>
                </div>
                {isOpen ? <BiChevronDown size={16} /> : <BiChevronRight size={16} />}
            </div>

            {isOpen && (
                <ul className="submenu">
                    {item.submenu.map((subItem) => {
                        const SubIcon = Icons[`Bi${subItem.icon.charAt(0).toUpperCase() + subItem.icon.slice(1).replace(/-./g, x => x[1].toUpperCase())}`] || Icons.BiCircle;
                        return (
                            <li key={subItem.path}>
                                <NavLink
                                    to={subItem.path}
                                    className={({ isActive }) =>
                                        `sidebar-nav-item submenu-item ${isActive ? 'active' : ''}`
                                    }
                                >
                                    <SubIcon size={18} />
                                    <span>{subItem.label}</span>
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            )}
        </li>
    );
};

export default CollapsibleMenuItem;
