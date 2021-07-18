import React, { Component } from 'react'
import { Badge, Button, Table } from 'reactstrap'
import { Link } from 'react-router-dom'

import ServersContext from '../contexts/Servers'

export default class Servers extends Component {
  deleteServer (server) {
    fetch('/api/servers/' + server.id + '', { method: 'DELETE' })
  }

  startServer (server) {
    fetch('/api/servers/' + server.id + '/start', { method: 'POST' })
  }

  stopServer (server) {
    fetch('/api/servers/' + server.id + '/stop', { method: 'POST' })
  }

  renderRow (server) {
    return (
      <tr key={server.id}>
        <td>{this.renderStatus(server)}</td>
        <td>{server.port}</td>
        <td><Link to={`/servers/${server.id}`}>{server.title}</Link></td>
        <td><Button color='danger' size='sm' onClick={this.deleteServer.bind(this, server)}>Delete</Button></td>
      </tr>
    )
  }

  renderStatus (server) {
    if (server.pid) {
      const button = <Button color='primary' size='xs' onClick={this.stopServer.bind(this, server)}>Stop</Button>

      if (server.state) {
        return (
          <>
            <Badge color='success'>Online {(server.state.players || []).length} / {server.state.maxplayers}</Badge>
            {button}
          </>
        )
      }

      return (
        <>
          <Badge color='info'>Launching</Badge>
          {button}
        </>
      )
    }

    return (
      <>
        <Badge color='secondary'>Offline</Badge>
        <Button color='primary' size='sm' onClick={this.startServer.bind(this, server)}>Start</Button>
      </>
    )
  }

  render () {
    return (
      <Table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Port</th>
            <th>Title</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <ServersContext.Consumer>
            {servers => (
              servers.map(server => this.renderRow(server))
            )}
          </ServersContext.Consumer>
        </tbody>
      </Table>
    )
  }
}
