import openSocket from 'socket.io-client';
import React, { Component } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

import { computeDistanceMovedByDrone, timeTakenByDrone } from './utility';

export default class DashBoard extends Component {
    state = {
        dataFromDrones: []
    }
    componentDidMount() {
        const socket = openSocket('http://localhost:40001');
        socket.on('parsedLocation', data => {
            let droneId = data.droneId;
            for (let item of this.state.dataFromDrones) {
                if (item.droneId === droneId) {
                    const droneCoordinateDiff = computeDistanceMovedByDrone(data.location, item.location);
                    const timeTaken = timeTakenByDrone(droneCoordinateDiff, data.speed);
                    if (droneCoordinateDiff > 0.0001 && timeTaken > 10 * 1000) {
                        this.updateDroneData(data);
                    }
                } else {
                    this.state.dataFromDrones.push(data);
                }
            }

        });
    }

    updateDroneData = data => {
        this.setState(prevState => {
            const updatedDataFromDrones = [...prevState.dataFromDrones];
            const updatedDataFromDroneIndex = updatedDataFromDrones.findIndex(item => item.droneId === data.droneId);
            if (updatedDataFromDroneIndex > -1) {
                updatedDataFromDrones[updatedDataFromDroneIndex] = data;
            }

            return {
                dataFromDrones: updatedDataFromDrones
            };
        });
    };

    getLocationDataItems(keyPhrase) {
        for (let item of this.state.dataFromDrones) {
            if (typeof item !== 'object') {
                throw Error('Location data item must be an object');
            }

            if (keyPhrase === 'droneId') {
                return (
                    <Td>
                        {item.droneId}
                    </Td>
                );
            } else if (keyPhrase === 'latitude') {
                return (
                    <Td>
                        {item.location[0]}
                    </Td>
                );
            } else if (keyPhrase === 'longitutde') {
                return (
                    <Td>
                        {item.location[1]}
                    </Td>
                )
            } else if (keyPhrase === 'speed'){
                return (
                    <Td>
                        {item.speed}
                    </Td>
                )
            } else {
                throw Error('invalid key phrase');
            }

        }
    }




    render() {
        return (
            <div>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Drone ID</Th>
                            <Th>Latitude</Th>
                            <Th>Longitude</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            {this.getLocationDataItems('droneId')}
                        </Tr>
                        <Tr>
                            {this.getLocationDataItems('latitude')}
                        </Tr>
                        <Tr>
                            {this.getLocationDataItems('longitude')}
                        </Tr>
                        <Tr>
                            {this.getLocationDataItems('speed')}
                        </Tr>
                    </Tbody>
                </Table>
            </div>
        );
    }
}