import React, { Component } from 'react';

import { Card, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';

export default class Rooms extends Component {
	render() {
		return (
			<Card>
				<Card.Header><FontAwesomeIcon icon={ faList } /> List of rooms</Card.Header>
				<Card.Body>
					<Table bordered hover striped variant="light">
						<thead>
					    <tr>
					      <th>Room Name</th>
					      <th>Temperature</th>
					      <th>Light Status</th>
					    </tr>
					  </thead>
					  <tbody>
					    <tr align="center">
					      <td colSpan="6">No rools available</td>
					    </tr>
					  </tbody>
					</Table>
				</Card.Body>
			</Card>
		)
	}	
}
