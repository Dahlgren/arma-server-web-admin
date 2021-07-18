import React, { Component } from 'react'
import { Table } from 'reactstrap'

import MissionsContext from '../contexts/Missions'

export default class Missions extends Component {
  renderRow (mission) {
    return (
      <tr key={mission.name}>
        <td>{mission.name}</td>
        <td>{mission.sizeFormatted}</td>
        <td>{mission.dateModified}</td>
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
            <th>Updated</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <MissionsContext.Consumer>
            {missions => (
              missions.map(this.renderRow)
            )}
          </MissionsContext.Consumer>
        </tbody>
      </Table>
    )
  }
}
