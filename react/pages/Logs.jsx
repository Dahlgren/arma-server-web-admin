import React, { Component } from 'react'
import { Table } from 'reactstrap'

export default class Logs extends Component {
  constructor (props) {
    super(props)
    this.state = { logs: [] }
  }

  componentDidMount () {
    this.requestLogs()
  }

  requestLogs () {
    fetch('/api/logs')
      .then(response => response.json())
      .then(data => this.setState({ logs: data }))
  }

  renderRow (log) {
    return (
      <tr key={log.name}>
        <td>{log.name}</td>
        <td>{log.formattedSize}</td>
        <td>{new Date(log.created).toLocaleString()}</td>
        <td>{new Date(log.modified).toLocaleString()}</td>
      </tr>
    )
  }

  render () {
    return (
      <Table>
        <thead>
          <tr>
            <th>Mission</th>
            <th>Size</th>
            <th>Created</th>
            <th>Updated</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {this.state.logs.map(this.renderRow)}
        </tbody>
      </Table>
    )
  }
}
