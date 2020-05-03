import React, { Component } from 'react';

import { Card, Button, Form, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faList } from '@fortawesome/free-solid-svg-icons';
import OperationNotification from './OperationNotification.js'; 

import axios from 'axios';

export default class EditLight extends Component {

	constructor (props) {
		super(props);

		this.state = this.initialState;
		this.state.show = false
		this.nameChange = this.nameChange.bind(this);
		this.nameChangeHandler = this.nameChangeHandler.bind(this)
	}

	initialState = {
		name:''
	}
	
	componentDidMount() {
		console.log()
		axios.get("http://localhost:8083/light/" + this.props.match.params.guid)
			.then(response => {
				console.log(response.data)
				if (response.data != null) {
					this.setState({
						name: response.data.name
					})
				}
			}).catch((error) => console.log(error))
	}

	nameChangeHandler() {
		let lightInfo = {
			name: this.state.name
		}
		console.log(this.props.match.params.guid)
		console.log(this.state.name)
		axios.put("http://localhost:8083/light/" + this.props.match.params.guid, lightInfo)
				.then(response => {
					console.log(response)
					if (response.data != null) {
						this.setState({
							"show": true,
							"showMessage": "Light name: " + response.data.name + ", was succesfully updated."
						})
						setTimeout(() => this.setState({"show": false}), 3000)
						
					} else {
						this.setState({"show": false})
					}
				})
	}

	nameChange(event) {
		this.setState({
			name: event.target.value
		});
	}

	backToSensorList = () => {
		return this.props.history.push("/sensors");
	}

	render() {
		return (
			<div>
				<div style = {{ "display": this.state.show ? "block" : "none" }}>
					<OperationNotification show = { this.state.show } message = { this.state.showMessage } type = { "success" }/>
				</div>
				<Card>
					<Card.Header><FontAwesomeIcon icon={ faPlusSquare } /> Add Light sensor</Card.Header>
					<Form onSubmit={this.submitForm} id="room-form">
						<Card.Body>
						 	<Form.Row>
						 		<Form.Group as={ Col } controlId="formControlName">
							    <Form.Label>Name of Light sensor</Form.Label>
							    <Form.Control required
							    	type="text" name="name"
							    	value={this.state.name}
							    	onChange={this.nameChange}
							    	className={"bg-light text-black"}
							    	placeholder="Enter Name for Light sensor"
							    	onBlur = {this.nameChangeHandler.bind(this)} />
							  </Form.Group>
						 	</Form.Row>
						</Card.Body>

						<Card.Footer>
							<Button size="sm" variant="info" type="button" onClick = {this.backToSensorList.bind()} >
						    	<FontAwesomeIcon icon={ faList } /> Back to sensor list
						  	</Button>
						</Card.Footer>
					</Form> 
				</Card>
			</div>
		)
	}
}
