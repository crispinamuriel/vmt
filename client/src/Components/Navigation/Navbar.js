import React from 'react';
import NavItem from './NavItem/NavItem';
import classes from './navbar.css';
const navbar = (props) => {
  return (
    <nav className={classes.NavContainer}>
      <ul className={classes.NavList}>
        <NavItem link='/users/new' name='Register' />
        <NavItem link='/profile' name='Dashboard' />
        <NavItem link='/rooms/new' name='Community' />
        <NavItem link='/logout' name='Logout' />
      </ul>
    </nav>
  )
}

export default navbar;
