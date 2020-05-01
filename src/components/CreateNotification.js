import React, { Component } from 'react';
import { Toast } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import '../styles/notification.scss';

export default class CreateNotification extends Component {
	render() {
		return (
			<div className = {this.props.children.show ? "toast-block": "" }>
				<Toast className = {this.props.children.show ? "border border-success bg-success text-white toast-block-content": "" } show = { this.props.children.show }>
					<div>
						<Toast.Header className = { "bg-success text-white" } closeButton = { false }>
							<FontAwesomeIcon icon={ faCheckCircle } /> 
							<strong className = "mr-auto">Success</strong>
						</Toast.Header>
						<Toast.Body>
							{ this.props.children.message }
						</Toast.Body>
					</div>	
				</Toast>
			</div>
		);
	}
} 
