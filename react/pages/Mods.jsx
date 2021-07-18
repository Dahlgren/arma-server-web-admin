import React, { Component } from 'react'
import { Table } from 'reactstrap'

import ModsContext from '../contexts/Mods'

export default class Mods extends Component {
  renderRow (mod) {
    return (
      <tr key={mod.name}>
        <td>{mod.name}</td>
      </tr>
    )
  }

  render () {
    return (
      <Table>
        <thead>
          <tr>
            <th>Mod</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <ModsContext.Consumer>
            {mods => (
              mods.map(this.renderRow)
            )}
          </ModsContext.Consumer>
        </tbody>
      </Table>
    )
  }
}
