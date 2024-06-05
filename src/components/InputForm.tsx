import React, { useState } from 'react';
import { TextInput, Button, Container, Grid, Paper } from '@mantine/core';

interface InputFormProps {
    onSubmit: (latitude: number, longitude: number, monthlyBill: number, roofInclination: number, roofOrientation: string) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    const [monthlyBill, setMonthlyBill] = useState<number>(0);
    const [roofInclination, setRoofInclination] = useState<number>(0);
    const [roofOrientation, setRoofOrientation] = useState<string>('');

    // Fonction de validation de la latitude
    const isValidLatitude = (lat: number): boolean => {
        return lat >= -90 && lat <= 90;
    };

    // Fonction de validation de la longitude
    const isValidLongitude = (lon: number): boolean => {
        return lon >= -180 && lon <= 180;
    };

    // Fonction de validation de l'inclinaison
    const isValidInclination = (inclination: number): boolean => {
        return inclination >= 0 && inclination <= 90;
    };

    // Fonction de validation de l'orientation
    const isValidOrientation = (orientation: string): boolean => {
        const validOrientations = ['N', 'S', 'E', 'W', 'N', 'NW', 'SE', 'SW'];
        return validOrientations.includes(orientation);
    };

    // Fonction de validation des entrées
    const validateInputs = (): boolean => {
        if (!isValidLatitude(latitude)) {
            console.error('Invalid latitude value. Latitude must be a number between -90 and 90 degrees.');
            return false;
        }
        if (!isValidLongitude(longitude)) {
            console.error('Invalid longitude value. Longitude must be a number between -180 and 180 degrees.');
            return false;
        }
        if (!isValidInclination(roofInclination)) {
            console.error('Invalid inclination value. Inclination must be a number between 0 and 90 degrees.');
            return false;
        }
        if (!isValidOrientation(roofOrientation)) {
            console.error('Invalid orientation value. Orientation must be one of: N, S, E, W, NE, NW, SE, SW.');
            return false;
        }
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateInputs()) {
            onSubmit(latitude, longitude, monthlyBill, roofInclination, roofOrientation);
        }
    };

    return (
        <Container size="sm">
            <Paper shadow="sm">
                <form onSubmit={handleSubmit}>
                    <Grid gutter="lg">
                        <Grid.Col span={12}>
                            <TextInput
                                label="Latitude"
                                type="number"
                                value={latitude}
                                onChange={e => setLatitude(parseFloat(e.target.value))}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <TextInput
                                label="Longitude"
                                type="number"
                                value={longitude}
                                onChange={e => setLongitude(parseFloat(e.target.value))}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <TextInput
                                label="Monthly Electricity Bill (€)"
                                type="number"
                                value={monthlyBill}
                                onChange={e => setMonthlyBill(parseFloat(e.target.value))}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <TextInput
                                label="Roof Inclination (°)"
                                type="number"
                                value={roofInclination}
                                onChange={e => setRoofInclination(parseFloat(e.target.value))}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <TextInput
                                label="Roof Orientation (cardinal point: N, W, NW, S, SE etc)"
                                value={roofOrientation}
                                onChange={e => setRoofOrientation(e.target.value)}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <Button type="submit" fullWidth>Launch simulation</Button>
                        </Grid.Col>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};
