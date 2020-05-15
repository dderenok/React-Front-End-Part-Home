import React, { Component } from 'react';
import { Card, Table, ButtonGroup, Button, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';
import DataTable from 'react-data-table-component';
import OperationNotification from './OperationNotification.js'; 
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Tabs } from 'antd';
import true_status from '../images/true_status.png';
import false_status from '../images/false_status.png';
import classNames from 'classnames/bind';

import '../styles/room-info.scss';

export default class RoomInfo extends Component {

	constructor(props) {
		super(props)
		this.state = this.initialState;
	};

	initialState = {
		room: {},
		temperatureSensorGuids: "",
		lightSensorGuids: "",
		temperatureSensors: [],
		lightSensors: [],
		isLoadedTemperature: true,
		isLoadedLight: true,
		temperatureColumns: [
	      {
	        name: 'Name',
	        selector: 'name',
	        width: '25%'
	      },
	      {
	        name: 'Status',
	        selector: 'status',
	        cell: (row) =>
	        	<div>
	        		{row.status}
	        		{' '}
	        		{ row.status == 'true' ? 
	        			<img src={true_status} alt="Status" className="status-icon"/>
	        			:
	        			<img src={false_status} alt="Status" className="status-icon"/>
	        		}
	        		
	        	</div>,
	        width: '25%'
	      },

	      {
	        name: 'TemperatureValue',
	        selector: 'temperatureValue',
	        width: '25%'
	      },
	      {
	      	name: 'Actions',
	      	selector: 'turnOnOff',
	      	cell: (row) =>
	      		<div>
		      		<button className = {classNames({'btn-sm': true}, {'btn-outline-success': row.status != 'true'}, {'btn-success': row.status == 'true'})} onClick={(event) => this.updateTemperatureStatus(row, event)}>
		      			{row.status == 'true' ? "Turn Off" : "Turn On"}
		      		</button>
		      		<button className = "btn-sm btn-danger" onClick={(event) => this.removeTemperatureSensorFromRoom(row, event)}>
		      			Remove from room
		      		</button>
		      	</div>
	      	,
	      	ignoreRowClick: true,
    		allowOverflow: true,
    		button: true,
    		width: '25%'
	      }
	    ],
	    lightColumns: [
	      {
	        name: 'Name',
	        selector: 'name',
	        sortable: 'asc',
	        width: '35%'
	      },
	      {
	        name: 'Status',
	        selector: 'status',
	        cell: (row) =>
	        	<div>
	        		{row.status}
	        		{' '}
	        		{ row.status == 'true' ? 
	        			<img src={true_status} alt="Status" className="status-icon"/>
	        			:
	        			<img src={false_status} alt="Status" className="status-icon"/>
	        		}
	        		
	        	</div>,
	        width: '30%'
	      },
	      {
	      	cell: (row) =>
	      		<div>
	      			<button className = {classNames({'btn-sm': true}, {'btn-outline-success': row.status != 'true'}, {'btn-success': row.status == 'true'})} onClick={(event) => this.updateLightStatus(row, event)}>
		      			{row.status == 'true' ? "Turn Off" : "Turn On"}
		      		</button>
		      		<button className = "btn-sm btn-danger" onClick={(event) => this.removeLightSensorFromRoom(row, event)}>
		      			Remove from room
		      		</button>
		      	</div>
	      	,
    		ignoreRowClick: true,
    		allowOverflow: true,
    		button: true,
    		name: 'Turn On/Off',
    		width: '40%'
	      }
	    ]
	}

	async componentDidMount() {
		await axios.get(
				`http://localhost:8081/room/${this.props.match.params.guid}`
			).then(({ data }) => {
				this.setState({ 
					room: data
				})
				this.parseSensorGuids()
				console.log(this.state.lightSensorGuids)
			})

		await axios.get(
					"http://localhost:8082/temperature/list", 
					{params: {guids: this.state.temperatureSensorGuids} 
				}).then(({ data }) => {
					console.log(data)
					this.setState({
						temperatureSensors: data.map((sensor, index) => {
							return {
								id: index,
								name: sensor.name,
								status: sensor.status.toString(),
								temperatureValue: sensor.temperatureValue,
								guid: sensor.guid
							}
						}),
					})
				});

		await axios.get("http://localhost:8083/light/list", 
					{params: {guids: this.state.lightSensorGuids} 
				}).then(({ data }) => {
					console.log(data)
					this.setState({
						lightSensors: data.map((sensor, index) => {
							return {
								id: index,
								name: sensor.name,
								status: sensor.status.toString(),
								guid: sensor.guid
							}
						}),
					})
				});

		this.setState({
			isLoadedLight: false,
			isLoadedTemperature: false
		})
	}

	parseSensorGuids() {
		console.log(this.state.room)
	    for (let j = 0; j < this.state.room.sensors.length ; j++) {
	        if (this.state.room.sensors[j].type === "TEMPERATURE" ) {
	            this.state.temperatureSensorGuids += this.state.room.sensors[j].guid + ","
	        } else if (this.state.room.sensors[j].type === "LIGHT" ) {
	            this.state.lightSensorGuids += this.state.room.sensors[j].guid + ","
	        } 
	    } 
		this.state.temperatureSensorGuids = this.state.temperatureSensorGuids.substring(0, this.state.temperatureSensorGuids.length - 1)
		this.state.lightSensorGuids = this.state.lightSensorGuids.substring(0, this.state.lightSensorGuids.length - 1)
	};

	updateTemperatureStatus = (sensor, event) => {
		let temperature = {
			guid: sensor.guid,
			roomGuid: this.props.match.params.guid
		}
		console.log(temperature)
		axios.put(`http://localhost:8082/temperature/status/${temperature.guid}/${temperature.roomGuid}`)
			.then(({ data }) => {
				console.log(data)
				this.setState({
					"show": true,
					"showMessage": "Sensor ".concat(sensor.name, " was ", sensor.status == 'true' ? "diactivated" : "activated", " succesfully."),
					"typeMessage": sensor.status == 'true' ? "danger" : "success"
				})
				setTimeout(() => this.setState({"show": false}), 30000)
				this.setState({
					temperatureSensors: [{
						name: data.name,
						status: data.status.toString(),
						temperatureValue: data.temperatureValue,
						guid: data.guid
					}]
				})
				console.log(this.state.temperatureSensors)
			})
	}

	updateLightStatus = (sensor, event) => {
		let light = {
			guid: sensor.guid,
			roomGuid: this.props.match.params.guid
		}
		console.log(light)
		axios.put(`http://localhost:8083/light/status/${light.guid}/${light.roomGuid}`)
			.then(({ data }) => {
				console.log(data)
				this.setState({
					"show": true,
					"showMessage": "Sensor ".concat(sensor.name, " was ", sensor.status == 'true' ? "diactivated" : "activated", " succesfully."),
					"typeMessage": sensor.status == 'true' ? "danger" : "success"
				})
				setTimeout(() => this.setState({"show": false}), 300000)
				this.setState({
					lightSensors: this.state.lightSensors.map(function(sensor) {
						if (sensor.guid === data.guid) {
							return {
								name: data.name,
								status: data.status.toString(),
								guid: data.guid
							}
						} else {
							return sensor
						}
				})
				})
				console.log(this.state.lightSensors)
			})
	}

	removeLightSensorFromRoom = (sensor, event) => {
		let sensors = [{
			guid: sensor.guid,
			type: "LIGHT",
			roomGuid: sensor.roomGuid
		}]
		axios.put("http://localhost:8081/room/remove-sensors", sensors)
			.then(({data}) => {
				this.setState({
					"show": true,
					"showMessage": "Sensor was remove from room.",
					"typeMessage": "success"
				})
				setTimeout(() => this.setState({"show": false}), 30000)
				this.setState({
					lightSensors: this.state.lightSensors.filter(sensorLight => sensorLight.guid !== sensor.guid)
				})
			})
	}

	removeTemperatureSensorFromRoom = (sensor, event) => {
		let sensors = [{
			guid: sensor.guid,
			type: "TEMPERATURE",
			roomGuid: sensor.roomGuid
		}]
		
		axios.put("http://localhost:8081/room/remove-sensors", sensors)
			.then(({data}) => {
				this.setState({
					"show": true,
					"showMessage": "Sensor was remove from room.",
					"typeMessage": "success"
				})
				setTimeout(() => this.setState({"show": false}), 30000)
				this.setState({
					temperatureSensors: this.state.temperatureSensors.filter(sensorTemperature => sensorTemperature.guid !== sensor.guid)
				})
			})
	}

	toSensorList = () => {
		return this.props.history.push("/list-room");
	}

	render() {
		const { room } = this.state
		const { TabPane } = Tabs;
		return (
			<Container>
				<div style = {{ "display": this.state.show ? "block" : "none" }} className="notification">
					<OperationNotification show = { this.state.show } message = { this.state.showMessage } type = { this.state.typeMessage } iconType = {"faTasks"}/>
				</div>
				<div className = "room-title">
					<h4>Information about {room.name} sensors</h4>
				</div>
				<Tabs defaultActiveKey="1">
				    <TabPane tab="Temperature sensors" key="1">
				      <DataTable
				      		noHeader = {true}
						    columns={this.state.temperatureColumns}
						    data={this.state.temperatureSensors}
						    progressPending = {this.state.isLoadedTemperature}
						 />
				    </TabPane>
				    <TabPane tab="Light sensors" key="2">
				      <DataTable
				      		noHeader = {true}
						    columns={this.state.lightColumns}
						    data={this.state.lightSensors}
						    progressPending = {this.state.isLoadedLight}
						 />
				    </TabPane>
			  	</Tabs>
			  	<div className = "footer-button">
			  		<button className = "btn-sm btn-outline-primary" onClick = {this.toSensorList.bind()} >
				    	<FontAwesomeIcon icon={ faList } /> To room list
				  	</button> 
			  	</div>
			</Container>
		)
	}
}
