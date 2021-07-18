import React, { Component } from 'react'
import Navigation from './Navigation.jsx'

import MissionsContext from './contexts/Missions'
import ModsContext from './contexts/Mods'
import ServersContext from './contexts/Servers'

export default class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      missions: [],
      mods: [],
      servers: []
    }
  }

  componentDidMount () {
    /* global io */
    const socket = io.connect()
    socket.on('missions', missions => this.setState({ missions }))
    socket.on('mods', mods => this.setState({ mods }))
    socket.on('servers', servers => this.setState({ servers }))
  }

  render () {
    return (
      <div id='app'>
        <Navigation />
        <MissionsContext.Provider value={this.state.missions}>
          <ModsContext.Provider value={this.state.mods}>
            <ServersContext.Provider value={this.state.servers}>
              {this.props.children}
            </ServersContext.Provider>
          </ModsContext.Provider>
        </MissionsContext.Provider>
      </div>
    )
  }
};
