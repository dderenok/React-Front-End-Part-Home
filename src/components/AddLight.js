import React, { Component } from 'react';

import { Card, Button, Form, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faList } from '@fortawesome/free-solid-svg-icons';
import OperationNotification from './OperationNotification.js'; 

import axios from 'axios';

import '../styles/add-light.scss';

export default class AddLight extends Component {

	constructor (props) {
		super(props);

		this.state = this.initialState;
		this.state.show = false
		this.nameChange = this.nameChange.bind(this);
		this.submitForm = this.submitForm.bind(this);
	}

	initialState = {
		name:'',
		roomGuid: '',
		availableRoom: []
	}

	async componentDidMount() {
		await axios.get("http://localhost:8081/room/available-rooms/light")
			.then(({data}) => {
				console.log(data)
				this.setState({
					availableRoom: data
				})
			})
	}

	submitForm = (event) => {
		let lightSensor = {
			name: this.state.name,
			roomGuid: this.state.roomGuid
		}

		console.log(lightSensor)

		axios.post("http://localhost:8083/light", lightSensor)
			.then(response => {
				console.log(response);
				if (response.data != null) {
					this.setState({"show": true})
					setTimeout(() => this.setState({"show": false}), 3000)
				} else {
					this.setState({"show": false})
				}
			});

		this.setState(this.initialState)
	}

	nameChange(event) {
		this.setState({
			name: event.target.value
		});
	}

	roomSelectChange = (event) => {
		if (event.target.value !== "Choose necessary room...") {
			this.setState({
				roomGuid: event.target.value
			});
		} else {
			this.setState({
				roomGuid: ''
			});
		}
	}

	backToSensorList = () => {
		return this.props.history.push("/sensors");
	}

	render() {
		const { 
			roomGuid,
			availableRoom
		} = this.state;
		return (
			<div>
				<div style = {{ "display": this.state.show ? "block" : "none" }}>
					<OperationNotification show = { this.state.show } message = { "Light sensor was created succesfully." } type = { "success" }/>
				</div>
				<Card>
					<Card.Header>Add Light sensor</Card.Header>
					<Form onSubmit={this.submitForm} id="room-form">
						<Card.Body>
					 		<Form.Group as={ Col } controlId="formControlName">
						    <Form.Label>Name of Light sensor</Form.Label>
						    <Form.Control required autocomplete="off"
						    	type="text" name="name"
						    	value={this.state.name}
						    	onChange={this.nameChange}
						    	className={"bg-light text-black"}
						    	placeholder="Enter Name for Light sensor" />
						  </Form.Group>

						  <Form.Group as={Col} controlId="formGridState">
						      <Form.Label>Attach to room</Form.Label>

						      <Form.Control 
						      	as="select" 
						      	custom={roomGuid}
						      	onChange={(e) => this.roomSelectChange(e)}
						      	value={roomGuid}>
						      	<option>Choose necessary room...</option>
						      	{ availableRoom.map((room) => {
						      		return(
						      			<option key={room.guid} value={room.guid}>
						      				{room.name}
						      			</option>
						      		)
						      	})}
						      </Form.Control>
						    </Form.Group>
						</Card.Body>

						<Card.Footer>
							<button className="btn-sm btn-outline-primary add-light-btn" onClick = {this.backToSensorList.bind()} >
						    	<FontAwesomeIcon icon={ faList } /> Back to sensor list
						  	</button>
							<button className="btn-sm btn-primary" type="button" onClick = {this.submitForm}>
						    	Create
						  	</button>
						</Card.Footer>
					</Form> 
				</Card>
			</div>
		)
	}
}
