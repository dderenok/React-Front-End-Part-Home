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
		name:'',
		formErrors: {name: ''},
		nameValid: false,
		roomGuid: '',
		availableRoom: [],
		alreadyAttached: false
	}
	
	async componentDidMount() {
		console.log()
		await axios.get("http://localhost:8083/light/" + this.props.match.params.guid)
			.then(response => {
				console.log(response.data)
				if (response.data != null) {
					this.setState({
						name: response.data.name,
						roomGuid: response.data.roomGuid
					})
					if (response.data.roomGuid !== null) {
						this.setState({
							alreadyAttached: true
						})
					}
					this.getRoomInfo()
				}
			}).catch((error) => console.log(error))

		
	}

	getRoomInfo() {
	 	axios.get("http://localhost:8081/room/available-rooms/light")
			.then(({data}) => {
				this.setState({
					availableRoom: data
				})
			})
	}

	nameChangeHandler(event) {
		if (event.target.value.length === 0) {
			this.setState({
				formErrors: {
					name: "Name value cannot be empty."
				}
			})
		} else {
			this.setState({
				formErrors: {
					name: ''
				}
			})
			let lightInfo = {
				name: this.state.name
			}
			axios.put("http://localhost:8083/light/" + this.props.match.params.guid, lightInfo)
				.then(response => {
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
		
	}

	lightRoomHandler(event) {
		if (this.state.roomGuid !== null) {
			let lightInfo = {
				roomGuid: this.state.roomGuid
			}

			axios.put("http://localhost:8083/light/" + this.props.match.params.guid, lightInfo)
				.then(response => {
					console.log(response)
					if (response.data != null) {
						this.setState({
							"show": true,
							"showMessage": "Light was attached to room succesfully.",
							alreadyAttached: true
						})
						setTimeout(() => this.setState({"show": false}), 3000)
						
					} else {
						this.setState({"show": false})
					}
				})
		}
		
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
		const { formErrors, roomGuid, availableRoom, alreadyAttached } = this.state
		return (
			<div>
				<div style = {{ "display": this.state.show ? "block" : "none" }}>
					<OperationNotification show = { this.state.show } message = { this.state.showMessage } type = { "success" }/>
				</div>
				<Card>
					<Card.Header>Edit Light sensor</Card.Header>
					<Form onSubmit={this.submitForm} id="room-form">
						<Card.Body>
					 		<Form.Group as={ Col } controlId="formControlName">
						    <Form.Label>Name of Light sensor</Form.Label>
						    <Form.Control required
						    	type="text" name="name"
						    	value={this.state.name}
						    	onChange={this.nameChange}
						    	className={"bg-light text-black"}
						    	placeholder="Enter Name for Light sensor"
						    	isInvalid={!!formErrors.name}
						    	onBlur = {this.nameChangeHandler.bind(this)} />

						    <Form.Control.Feedback type="invalid">
				               {formErrors.name}
				            </Form.Control.Feedback>
						  </Form.Group>

						  { alreadyAttached === false ? 
						  	<Form.Group as={Col} controlId="formGridState">
						      <Form.Label>Attach to room</Form.Label>

						      <Form.Control 
						      	as="select" 
						      	custom={roomGuid}
						      	onChange={(e) => this.roomSelectChange(e)}
						      	value={roomGuid}
						      	onBlur = {this.lightRoomHandler.bind(this)}
						      	>
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
						    :
						    <p>This sensor already attached to room.</p>
						}
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
