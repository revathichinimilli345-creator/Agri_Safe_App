import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedCard from './AnimatedCard';

// Using a simplified mock weather fetch as a placeholder for a real API
export default function WeatherWidget({ state = 'Region' }) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // wttr.in provides a free JSON format without an API key
                const response = await fetch(`https://wttr.in/${state}?format=j1`);
                const data = await response.json();

                if (data && data.current_condition && data.current_condition[0]) {
                    const current = data.current_condition[0];
                    setWeather({
                        temp: current.temp_C,
                        condition: current.weatherDesc[0].value,
                        humidity: current.humidity,
                        wind: current.windspeedKmph,
                        icon: current.weatherDesc[0].value.toLowerCase().includes('cloud') ? 'cloudy' :
                            current.weatherDesc[0].value.toLowerCase().includes('rain') ? 'rainy' : 'sunny'
                    });
                }
            } catch (error) {
                console.error("Weather fetch failed:", error);
                // Fallback to static mock if API is down
                setWeather({
                    temp: 28,
                    condition: 'Sunny',
                    humidity: 60,
                    wind: 10,
                    icon: 'sunny'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [state]);

    if (loading) {
        return (
            <AnimatedCard style={styles.container}>
                <ActivityIndicator color="#2E7D32" />
            </AnimatedCard>
        );
    }

    return (
        <AnimatedCard style={styles.container} delay={400}>
            <View style={styles.row}>
                <View>
                    <Text style={styles.stateText}>Weather in {state}</Text>
                    <Text style={styles.tempText}>{weather.temp}°C</Text>
                    <Text style={styles.conditionText}>{weather.condition}</Text>
                </View>
                <Ionicons name={weather.icon} size={48} color="#FBC02D" />
            </View>
            <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                    <Ionicons name="water-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{weather.humidity}% Humidity</Text>
                </View>
                <View style={styles.detailItem}>
                    <Ionicons name="leaf-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{weather.wind} km/h Wind</Text>
                </View>
            </View>
        </AnimatedCard>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        padding: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    stateText: {
        fontSize: 14,
        color: '#666',
    },
    tempText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#333',
    },
    conditionText: {
        fontSize: 16,
        color: '#2E7D32',
        fontWeight: '500',
    },
    detailsRow: {
        flexDirection: 'row',
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 12,
        gap: 20,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailText: {
        fontSize: 12,
        color: '#666',
    }
});
