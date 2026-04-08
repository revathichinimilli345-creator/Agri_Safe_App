import React, { useMemo } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const STATE_COORDINATES = {
    'Andhra Pradesh': { latitude: 15.9129, longitude: 79.7400, delta: 6 },
    'Arunachal Pradesh': { latitude: 28.2180, longitude: 94.7278, delta: 5 },
    'Assam': { latitude: 26.2006, longitude: 92.9376, delta: 5 },
    'Bihar': { latitude: 25.0961, longitude: 85.3131, delta: 4 },
    'Chhattisgarh': { latitude: 21.2787, longitude: 81.8661, delta: 5 },
    'Goa': { latitude: 15.2993, longitude: 74.1240, delta: 1 },
    'Gujarat': { latitude: 22.2587, longitude: 71.1924, delta: 5 },
    'Haryana': { latitude: 29.0588, longitude: 76.0856, delta: 3 },
    'Himachal Pradesh': { latitude: 31.1048, longitude: 77.1734, delta: 3 },
    'Jharkhand': { latitude: 23.6102, longitude: 85.2799, delta: 4 },
    'Karnataka': { latitude: 15.3173, longitude: 75.7139, delta: 6 },
    'Kerala': { latitude: 10.8505, longitude: 76.2711, delta: 4 },
    'Madhya Pradesh': { latitude: 22.9734, longitude: 78.6569, delta: 6 },
    'Maharashtra': { latitude: 19.7515, longitude: 75.7139, delta: 6 },
    'Manipur': { latitude: 24.6637, longitude: 93.9063, delta: 2 },
    'Meghalaya': { latitude: 25.4670, longitude: 91.3662, delta: 2 },
    'Mizoram': { latitude: 23.1645, longitude: 92.9376, delta: 2 },
    'Nagaland': { latitude: 26.1584, longitude: 94.5624, delta: 2 },
    'Odisha': { latitude: 20.9517, longitude: 85.0985, delta: 5 },
    'Punjab': { latitude: 31.1471, longitude: 75.3412, delta: 3 },
    'Rajasthan': { latitude: 27.0238, longitude: 74.2179, delta: 6 },
    'Sikkim': { latitude: 27.5330, longitude: 88.5122, delta: 1 },
    'Tamil Nadu': { latitude: 11.1271, longitude: 78.6569, delta: 5 },
    'Telangana': { latitude: 18.1124, longitude: 79.0193, delta: 4 },
    'Tripura': { latitude: 23.9408, longitude: 91.9882, delta: 2 },
    'Uttar Pradesh': { latitude: 26.8467, longitude: 80.9462, delta: 6 },
    'Uttarakhand': { latitude: 30.0668, longitude: 79.0193, delta: 3 },
    'West Bengal': { latitude: 22.9868, longitude: 87.8550, delta: 5 },
};

export default function MapScreen({ route }) {
    const { t } = useTranslation();
    const data = route.params?.data || { state: 'India', country: 'India', prediction: { is_suitable: true } };

    const { region, isSuitable } = useMemo(() => {
        const stateName = data.state || '';
        // Find state in a case-insensitive way
        const matchedState = Object.keys(STATE_COORDINATES).find(
            key => key.toLowerCase() === stateName.toLowerCase()
        );

        const coords = STATE_COORDINATES[matchedState] || { latitude: 20.5937, longitude: 78.9629, delta: 15 };
        return {
            region: {
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: coords.delta,
                longitudeDelta: coords.delta,
            },
            isSuitable: data.prediction?.is_suitable ?? true
        };
    }, [data.state, data.prediction]);

    const mapColor = isSuitable ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)';
    const strokeColor = isSuitable ? '#2E7D32' : '#C62828';

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={region}
                region={region}
            >
                <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }}>
                    <View style={[styles.customMarker, { backgroundColor: strokeColor }]}>
                        <Ionicons name={isSuitable ? "checkmark-circle" : "close-circle"} size={24} color="#fff" />
                    </View>
                </Marker>
                <Circle
                    center={{ latitude: region.latitude, longitude: region.longitude }}
                    radius={region.latitudeDelta * 50000}
                    fillColor={mapColor}
                    strokeColor={strokeColor}
                    strokeWidth={2}
                />
            </MapView>

            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
                    <Text style={styles.legendText}>{t('suitable_land')}</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: '#F44336' }]} />
                    <Text style={styles.legendText}>{t('unsuitable_land')}</Text>
                </View>
            </View>

            <View style={styles.overlay}>
                <Text style={styles.overlayTitle}>{data.state || data.country || "Analysis"}</Text>
                <Text style={styles.overlayText}>
                    {isSuitable ? t('potential_text') : t('challenge_text')}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    customMarker: {
        padding: 5,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    legend: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 10,
        borderRadius: 8,
        gap: 5,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
    },
    overlay: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 10,
    },
    overlayTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#1B5E20',
    },
    overlayText: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
    }
});

