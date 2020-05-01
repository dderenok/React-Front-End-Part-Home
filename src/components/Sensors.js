import React, { Component } from 'react';

import { Container, Row, Col } from 'react-bootstrap';
import AddTemperature from './AddTemperature';

export default class Sensors extends Component {
	render () {
		return (
			<Container>
				<Row>
					<Col sm={4}>
						<AddTemperature />
					</Col>
					<Col sm={8}>

					</Col>
				</Row>
			</Container>
		)
	}
}
