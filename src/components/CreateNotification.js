import React, { Component } from 'react';
import { Toast } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import '../styles/notification.scss';

export default class CreateNotification extends Component {
	render() {
		return (
			<div className = {this.props.children.show ? "toast-block": "" }>
				<Toast className = {this.props.children.show ? `border text-white ${this.props.children.type === "success" ? "border-success bg-success" : "border-danger bg-danger"} toast-block-content`: "" } show = { this.props.children.show }>
					<div>
						<Toast.Header className = { `text-white ${this.props.children.type === "success" ? "bg-success" : "bg-danger"}` } closeButton = { false }>
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
