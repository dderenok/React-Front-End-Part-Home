import React, { Component } from 'react';
import { Toast } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTrash, faTasks } from '@fortawesome/free-solid-svg-icons';

import '../styles/notification.scss';

export default class CreateNotification extends Component {
	render() {
		return (
			<div className = {this.props.show ? "toast-block": "" }>
				<Toast className = {this.props.show ? `border text-white ${this.props.type === "success" ? "border-success bg-success" : "border-danger bg-danger"} toast-block-content`: "" } show = { this.props.show }>
					<div>
						<Toast.Header className = { `text-white ${this.props.type === "success" ? "bg-success" : "bg-danger"}` } closeButton = { false }>
							{ this.props.iconType === "faTasks" ? 
								<FontAwesomeIcon icon={ faTasks } />
								:
								this.props.type === "success" ?
									<FontAwesomeIcon icon={ faCheckCircle } /> :
								  	<FontAwesomeIcon icon={ faTrash } />
							}
							<strong className = "mr-auto">Success</strong>
						</Toast.Header>
						<Toast.Body className = "notification-text">
							{ this.props.message }
						</Toast.Body>
					</div>	
				</Toast>
			</div>
		);
	}
} 
