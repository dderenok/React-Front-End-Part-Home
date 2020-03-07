import React, { Component } from 'react';

import { Navbar, Container, Col } from 'react-bootstrap';

export default class Footer extends Component {
	render() {
		return (
			<Navbar fixed="bottom" bg="light" variant="light">
				<Container>
					<Col lg={12} className="text-center text-muted">
						<div>Developed student by BSU</div>
					</Col>
				</Container>
			</Navbar>
		)
	}
}
