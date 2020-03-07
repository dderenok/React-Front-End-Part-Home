import React, { Component } from 'react';
import '../styles/home.scss';
import { Container, Row, Col } from 'react-bootstrap';

import Welcome from './Welcome';

export default class HomeBlock extends Component {
	render () {
		return (
			<Container className="main-info">
				<Row>
					<Col lg={12}>
						<Welcome />
					</Col>
				</Row>
			</Container>
		)
	}
}
