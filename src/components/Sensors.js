import React, { Component } from 'react';

import { Container, Row, Col, Button } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { Link } from 'react-router-dom';
import OperationNotification from './OperationNotification.js'; 

import '../styles/sensors.scss';

export default class Sensors extends Component {

	constructor(props) {
		super(props)
		this.state = this.initialState;
		this.state.show = false;
		this.state.showMessage = '';
	};

	initialState = {
		isLoadedTemperature: true,
		isLoadedLight: true,
		temperatureColumns: [
	      {
	        name: 'Name',
	        selector: 'name',
	        sortable: 'asc',
	      },
	      {
	        name: 'Status',
	        selector: 'status',
	        sortable: 'asc'
	      },
	      {
	        name: 'TemperatureValue',
	        selector: 'temperatureValue',
	        sortable: 'asc'
	      },
	      {
	      	cell: (row) =>
	      		<div>
	      			<Link to = { "edit-temperature/"+row.guid } className="btn btn-sm btn-outline-primary">
						Edit
					</Link>
		      		<Button size="sm" variant = "outline-danger" type="button" onClick={(event) => this.deleteTemperatureSensor(row, event)}>Delete</Button>
		      	</div>
	      	,
    		ignoreRowClick: true,
    		allowOverflow: true,
    		button: true,
    		name: 'Actions'
	      }
		],
		lightColumns: [
	      {
	        name: 'Name',
	        selector: 'name',
	        sortable: 'asc',
	      },
	      {
	        name: 'Status',
	        selector: 'status',
	        sortable: 'asc'
	      },
	      {
	      	cell: (row) =>
	      		<div>
	      			<Link to = { "edit-light/"+row.guid } className="btn btn-sm btn-outline-primary">
						Edit
					</Link>
		      		<Button size="sm" variant="outline-danger" type="button" onClick={(event) => this.deleteLightSensor(row, event)}>Delete</Button>
		      	</div>
	      	,
    		ignoreRowClick: true,
    		allowOverflow: true,
    		button: true,
    		name: 'Actions'
	      }
		],
		temperatureData: [],
		lightData: [],
		temperatureSensors: [],
		lightSensors: []
	}

	componentDidMount() {
		axios.get("http://localhost:8083/light")
				.then(({ data }) => {
					this.setState({
						lightSensors: data,
						lightData: data.map((sensor, index) => {
									return {
										id: index,
										name: sensor.name,
										status: sensor.status.toString(),
										guid: sensor.guid
									}
								}),
						isLoadedLight: false
					})

				});

		axios.get("http://localhost:8082/temperature")
				.then(({ data }) => {
					this.setState({
						temperatureSensors: data,
						temperatureData: data.map((sensor, index) => {
									return {
										id: index,
										name: sensor.name,
										status: sensor.status.toString(),
										temperatureValue: sensor.temperatureValue,
										guid: sensor.guid
									}
								}),
						isLoadedTemperature: false
					})
				});
	};

	handleButtonClick() {

	}

	deleteLightSensor = (row, event) => {
		axios.delete("http://localhost:8083/light/"+row.guid)
			.then(response => {
				if (response.data !== null) {
					this.setState({
						"show": true,
						"showMessage": "Light sensor " + row.name + " was successfully deleted."
					})
					setTimeout(() => this.setState({"show": false}), 3000)
					this.setState({
						lightData: this.state.lightData.filter(lightSensor => lightSensor.guid !== row.guid)
					})
				} else {
					this.setState({"show": false})
				}
			})
	}

	deleteTemperatureSensor = (row, event) => {
		console.log(row)
		axios.delete("http://localhost:8082/temperature/"+row.guid)
			.then(response => {
				if (response.data !== null) {
					this.setState({
						"show": true,
						"showMessage": "Temperature sensor " + row.name + " was successfully deleted."
					})
					setTimeout(() => this.setState({"show": false}), 3000)
					this.setState({
						temperatureData: this.state.temperatureData.filter(temperatureSensor => temperatureSensor.guid !== row.guid)
					})
				} else {
					this.setState({"show": false})
				}
			})
	}
	
	render () {
		return (
			<div>
				<div style = {{ "display": this.state.show ? "block" : "none" }}>
					<OperationNotification show = { this.state.show } message = { this.state.showMessage } type = { "danger" }/>
				</div>
				<Container className = "sensor-list-container">
					<Row>
						<Col sm={6} >
							<DataTable
							    title="Temperature sensors"
							    actions = {
							    	<Link to = { "add-temperature" } className="btn btn-sm btn-outline-primary">
			    						Add new
			    					</Link>
							    }
							    columns={this.state.temperatureColumns}
							    data={this.state.temperatureData}
							    progressPending = {this.state.isLoadedTemperature}
							    pagination = {true}
							 />
						</Col>
						<Col sm={6}>
							<DataTable
							    title="Light sensors"
							    actions = {
							    	<Link to = { "add-light" } className="btn btn-sm btn-outline-primary">
			    						Add new
			    					</Link>
							    }
							    columns={this.state.lightColumns}
							    data={this.state.lightData}
							    progressPending = {this.state.isLoadedLight}
							 />
						</Col>
					</Row>
				</Container>
			</div>
			
		)
	}
}
