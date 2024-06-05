import React from 'react';
import { Paper, Container, Text } from '@mantine/core';

interface ResultsProps {
    estimatedPanels: number;
    yearlyProducedEnergy: number;
}

export const Results: React.FC<ResultsProps> = ({ estimatedPanels, yearlyProducedEnergy }) => {
    return (
        <Container size="sm">
            <Paper>
                <Text ta="center" size="lg">Results</Text>
                <Text ta="center">Recommended number of panels: {estimatedPanels}</Text>
                <Text ta="center">Estimated energy production: {yearlyProducedEnergy} kWh</Text>
            </Paper>
        </Container>
    );
};
