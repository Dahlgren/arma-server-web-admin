import React, { Component } from 'react'
import { Nav, NavItem, NavLink } from 'reactstrap'
import { Route, Switch } from 'react-router'
import { NavLink as RRNavLink } from 'react-router-dom'

import ServersContext from '../contexts/Servers'

class ServerInfo extends Component {
  render () {
    return 'ServerInfo'
  }
}

class ServerMissions extends Component {
  render () {
    return 'ServerMissions'
  }
}

class ServerMods extends Component {
  render () {
    return 'ServerMods'
  }
}

class ServerPlayers extends Component {
  render () {
    return 'ServerPlayers'
  }
}

class ServerSettings extends Component {
  render () {
    return 'ServerSettings'
  }
}

export default class Server extends Component {
  renderServer (server) {
    const { path, url } = this.props.match
    return (
      <>
        <Nav tabs>
          <NavItem>
            <NavLink activeClassName='active' tag={RRNavLink} exact to={`${url}`}>
              Info
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink activeClassName='active' tag={RRNavLink} exact to={`${url}/mods`}>
              Mods
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink activeClassName='active' tag={RRNavLink} exact to={`${url}/missions`}>
              Missions
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink activeClassName='active' tag={RRNavLink} exact to={`${url}/players`}>
              Players
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink activeClassName='active' tag={RRNavLink} exact to={`${url}/settings`}>
              Settings
            </NavLink>
          </NavItem>
        </Nav>
        <Switch>
          <Route exact path={`${path}`}>
            <ServerInfo />
          </Route>
          <Route exact path={`${path}/missions`}>
            <ServerMissions />
          </Route>
          <Route exact path={`${path}/mods`}>
            <ServerMods />
          </Route>
          <Route exact path={`${path}/players`}>
            <ServerPlayers />
          </Route>
          <Route exact path={`${path}/settings`}>
            <ServerSettings />
          </Route>
        </Switch>
      </>
    )
  }

  renderNotFound () {
    return 'Not Found'
  }

  render () {
    const serverId = this.props.match.params.id

    return (
      <ServersContext.Consumer>
        {servers => {
          const server = servers.find(server => server.id === serverId)

          if (server) {
            return this.renderServer(server)
          }

          return this.renderNotFound()
        }}
      </ServersContext.Consumer>
    )
  }
}
