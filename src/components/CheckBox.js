import React, { Component } from 'react'

export default class CheckBox extends Component {
  render() {
    const { sensor, isChecked } = this.props;

    return (
      <label>
        <input
          type="checkbox"
          value={sensor.guid}
          checked={isChecked}
          onChange={this.props.handleCheckboxClick}
        />
        {sensor.name}
      </label>
    );
  }
}
