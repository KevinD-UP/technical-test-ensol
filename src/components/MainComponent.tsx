import React, { useState } from 'react';
import {Container, Title} from '@mantine/core';
import {InputForm} from './InputForm';
import {Results} from './Results';
import axios from 'axios';

interface LossData {
    orientation: string;
    inclination: number;
    value: number;
}

// Données de pertes typiques en fonction de l'orientation et de l'inclinaison
const lossData: LossData[] = [
    { orientation: 'S', inclination: 10, value: 7.00 },
    { orientation: 'S', inclination: 20, value: 2.00 },
    { orientation: 'S', inclination: 30, value: 0.00 },
    { orientation: 'S', inclination: 40, value: 0.00 },
    { orientation: 'S', inclination: 50, value: 3.00 },
    { orientation: 'S', inclination: 60, value: 7.00 },
    { orientation: 'S', inclination: 70, value: 14.00 },
    { orientation: 'S', inclination: 80, value: 23.00 },

    { orientation: 'E', inclination: 10, value: 14.00 },
    { orientation: 'E', inclination: 20, value: 16.00 },
    { orientation: 'E', inclination: 30, value: 19.00 },
    { orientation: 'E', inclination: 40, value: 23.00 },
    { orientation: 'E', inclination: 50, value: 28.00 },
    { orientation: 'E', inclination: 60, value: 33.00 },
    { orientation: 'E', inclination: 70, value: 38.00 },
    { orientation: 'E', inclination: 80, value: 44.00 },

    { orientation: 'W', inclination: 10, value: 14.00 },
    { orientation: 'W', inclination: 20, value: 16.00 },
    { orientation: 'W', inclination: 30, value: 19.00 },
    { orientation: 'W', inclination: 40, value: 23.00 },
    { orientation: 'W', inclination: 50, value: 28.00 },
    { orientation: 'W', inclination: 60, value: 33.00 },
    { orientation: 'W', inclination: 70, value: 38.00 },
    { orientation: 'W', inclination: 80, value: 44.00 },

    { orientation: 'SE', inclination: 10, value: 10.00 },
    { orientation: 'SE', inclination: 20, value: 7.00 },
    { orientation: 'SE', inclination: 30, value: 6.00 },
    { orientation: 'SE', inclination: 40, value: 9.00 },
    { orientation: 'SE', inclination: 50, value: 10.00 },
    { orientation: 'SE', inclination: 60, value: 15.00 },
    { orientation: 'SE', inclination: 70, value: 20.00 },
    { orientation: 'SE', inclination: 80, value: 28.00 },

    { orientation: 'SW', inclination: 10, value: 10.00 },
    { orientation: 'SW', inclination: 20, value: 7.00 },
    { orientation: 'SW', inclination: 30, value: 6.00 },
    { orientation: 'SW', inclination: 40, value: 9.00 },
    { orientation: 'SW', inclination: 50, value: 10.00 },
    { orientation: 'SW', inclination: 60, value: 15.00 },
    { orientation: 'SW', inclination: 70, value: 20.00 },
    { orientation: 'SW', inclination: 80, value: 28.00 },
];

// Fonction pour calculer le paramètre loss en fonction de l'inclinaison et de l'orientation
const calculateLoss = (inclination: number, orientation: string): number | undefined => {
    // Recherche de la valeur de perte correspondant à l'inclinaison et à l'orientation spécifiques
    const lossEntry = lossData.find(entry => entry.orientation === orientation && entry.inclination === inclination);
    if (lossEntry) {
        return lossEntry.value;
    } else {
        return 14
    }
};


const fetchPVGISData = async (latitude: number, longitude: number, peakPower: number, inclination: number, orientation: string) => {
    const orientationAngle = {
        S: 0,
        SW: 45,
        W: 90,
        NW: 135,
        N: 180,
        NE: 225,
        E: 270,
        SE: 315,
    }[orientation] || 0; // Default to 0 if orientation not found


    const response = await axios.get('https://re.jrc.ec.europa.eu/api/v5_2/PVcalc', {
        params: {
            lat: latitude,
            lon: longitude,
            peakpower: peakPower,
            angle: inclination,
            aspect: orientationAngle,
            loss: calculateLoss(inclination, orientation),
            outputformat: "json"
        }
    });

    return response.data;
};

export const MainComponent: React.FC = () => {
    const [estimatedPanels, setEstimatedPanels] = useState<number>(0);
    const [yearlyProducedEnergy, setYearlyProducedEnergy] = useState<number>(0);

    const handleCalculate = async (latitude: number, longitude: number, monthlyBill: number, roofInclination: number, roofOrientation: string) => {
        // Estimer la consommation annuelle d'électricité du client (en kWh)
        const yearlyConsumption = monthlyBill * 12;

        // Définir la puissance crête d'un panneau en kWc
        const panelPower = 425 / 1000; // 425 Wc = 0.425 kWc

        // Appel à l'API PVGIS pour obtenir l'énergie produite par un panneau
        const data = await fetchPVGISData(latitude, longitude, panelPower, roofInclination, roofOrientation);

        // Extraire l'énergie produite annuellement par un panneau (en kWh)
        const yearlyProductionPerPanel = data.outputs.totals.fixed.E_y;

        // Calculer le nombre de panneaux nécessaires pour produire 85% de la consommation annuelle du client
        const requiredPanels = Math.ceil((yearlyConsumption * 0.85) / yearlyProductionPerPanel);

        // Calculer l'énergie produite annuellement par le nombre estimé de panneaux
        const totalYearlyProduction = requiredPanels * yearlyProductionPerPanel;

        setEstimatedPanels(requiredPanels);
        setYearlyProducedEnergy(totalYearlyProduction);
    };

    return (
        <Container size="xl">
            <Title order={1}>Solar Installation Estimator</Title>
            <InputForm onSubmit={handleCalculate} />
            {estimatedPanels > 0 && yearlyProducedEnergy > 0 && (
                <Container mt="md">
                    <Results estimatedPanels={estimatedPanels} yearlyProducedEnergy={yearlyProducedEnergy} />
                </Container>
            )}
        </Container>
    );
};
