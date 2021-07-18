import React, { Component } from 'react'
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap'
import { NavLink as RRNavLink } from 'react-router-dom'

export default class Navigation extends Component {
  constructor (props) {
    super(props)

    this.handleNavbarToggle = this.handleNavbarToggle.bind(this)
    this.state = {
      isOpen: false
    }
  }

  handleNavbarToggle () {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render () {
    return (
      <Navbar color='light' light expand='md'>
        <NavbarBrand>Arma Admin</NavbarBrand>
        <NavbarToggler onClick={this.handleNavbarToggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className='ml-auto' navbar>
            <NavItem>
              <NavLink activeClassName='active' tag={RRNavLink} to='/logs'>
                Logs
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink activeClassName='active' tag={RRNavLink} to='/missions'>
                Missions
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink activeClassName='active' tag={RRNavLink} to='/mods'>
                Mods
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink activeClassName='active' tag={RRNavLink} to='/servers'>
                Servers
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    )
  }
}
