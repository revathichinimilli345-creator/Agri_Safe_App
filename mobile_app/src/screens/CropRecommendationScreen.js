import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';

export default function CropRecommendationScreen({ route, navigation }) {
    const { t } = useTranslation();
    const data = route.params?.data || {
        state: 'Region',
        ph: 7.0,
        prediction: { suggested_crops: 'Generic Pulse crops', is_suitable: true }
    };

    const suggestedCrops = useMemo(() => {
        return data.prediction?.suggested_crops?.split(', ') || [];
    }, [data.prediction]);

    const prediction = data.prediction || {};

    return (
        <GradientBackground>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <AnimatedCard style={styles.headerCard} delay={100}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="leaf" size={40} color="#2E7D32" />
                    </View>
                    <Text style={styles.title}>{t('recommendation_tab')}</Text>
                    <Text style={styles.subtitle}>{t('best_results_text')}</Text>
                </AnimatedCard>

                <AnimatedCard style={styles.cropsCard} delay={200}>
                    <Text style={styles.label}>{t('suggested_crops_label')}</Text>
                    <View style={styles.cropsList}>
                        {suggestedCrops.map((crop, index) => (
                            <View key={index} style={styles.cropItem}>
                                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                                <Text style={styles.cropName}>{crop}</Text>
                            </View>
                        ))}
                    </View>
                </AnimatedCard>

                {/* Phase 2: Seed & Sowing */}
                <AnimatedCard style={[styles.infoCard, { borderLeftColor: '#4CAF50' }]} delay={300}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="flask" size={24} color="#2E7D32" />
                        <Text style={styles.cardTitle}>{t('phase2_title')}</Text>
                    </View>
                    
                    <View style={styles.infoSection}>
                        <Text style={styles.infoLabel}>{t('recommended_varieties')}</Text>
                        <Text style={styles.infoText}>{prediction.seed_recommendation || t('info_pending')}</Text>
                    </View>
                    
                    <View style={styles.infoSection}>
                        <Text style={styles.infoLabel}>{t('optimal_sowing_window')}</Text>
                        <View style={styles.badge}>
                            <Ionicons name="calendar-outline" size={16} color="#2E7D32" />
                            <Text style={styles.badgeText}>{prediction.sowing_window || t('seasonal')}</Text>
                        </View>
                    </View>
                </AnimatedCard>

                {/* Cultivation Kit: Fertilizer & Irrigation */}
                <AnimatedCard style={[styles.infoCard, { borderLeftColor: '#2196F3' }]} delay={400}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="construct" size={24} color="#1565C0" />
                        <Text style={styles.cardTitle}>{t('cultivation_kit_title')}</Text>
                    </View>
                    
                    <View style={styles.infoSection}>
                        <Text style={styles.infoLabel}>{t('fertilizer_rec_label')}</Text>
                        <Text style={styles.infoValue}>{prediction.fertilizer_recommendation || t('standard_npk')}</Text>
                    </View>
                    
                    <View style={styles.infoSection}>
                        <Text style={styles.infoLabel}>{t('irrigation_sched_label')}</Text>
                        <View style={styles.waterBadge}>
                            <Ionicons name="water" size={16} color="#0277BD" />
                            <Text style={styles.waterText}>{prediction.irrigation_schedule || t('monitor_moisture')}</Text>
                        </View>
                    </View>
                </AnimatedCard>

                <AnimatedCard style={styles.detailsCard} delay={500}>
                    <Text style={styles.label}>{t('soil_health_summary')}</Text>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>{t('ph')}:</Text>
                        <Text style={[styles.statValue, { color: data.ph < 6 || data.ph > 7.5 ? '#F44336' : '#2E7D32' }]}>
                            {data.ph}
                        </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>{t('state')}:</Text>
                        <Text style={styles.statValue}>{data.state}</Text>
                    </View>
                </AnimatedCard>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>{t('back_to_analysis')}</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    headerCard: {
        alignItems: 'center',
        padding: 24,
        marginBottom: 16,
    },
    iconContainer: {
        backgroundColor: '#E8F5E9',
        padding: 16,
        borderRadius: 50,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1B5E20',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
    cropsCard: {
        padding: 20,
        marginBottom: 16,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    cropsList: {
        gap: 12,
    },
    cropItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EDE7F6',
    },
    cropName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2E7D32',
        marginLeft: 12,
    },
    detailsCard: {
        padding: 20,
        marginBottom: 20,
    },
    infoCard: {
        padding: 20,
        marginBottom: 16,
        borderLeftWidth: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    infoSection: {
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
        fontWeight: '600',
    },
    infoText: {
        fontSize: 16,
        color: '#444',
        lineHeight: 22,
    },
    infoValue: {
        fontSize: 16,
        color: '#1565C0',
        fontWeight: '600',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        gap: 6,
    },
    badgeText: {
        color: '#2E7D32',
        fontWeight: 'bold',
        fontSize: 14,
    },
    waterBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E1F5FE',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        gap: 6,
    },
    waterText: {
        color: '#0277BD',
        fontWeight: 'bold',
        fontSize: 14,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    statLabel: {
        fontSize: 16,
        color: '#666',
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#EEE',
        marginVertical: 4,
    },
    backButton: {
        backgroundColor: '#2E7D32',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
