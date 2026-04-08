import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';

export default function ResultScreen({ route, navigation }) {
    const { t } = useTranslation();
    const { result } = route.params;

    const isSuitable = result.prediction.is_suitable;
    const explanation = result.prediction.explanation;
    const recommendations = result.prediction.recommendations;

    return (
        <GradientBackground>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <AnimatedCard style={[styles.predictionCard, isSuitable ? styles.successGlow : styles.errorGlow]}>
                    <Ionicons
                        name={isSuitable ? "checkmark-circle" : "alert-circle"}
                        size={80}
                        color={isSuitable ? "#2E7D32" : "#C62828"}
                    />
                    <Text style={[styles.predictionText, { color: isSuitable ? "#1B5E20" : "#B71C1C" }]}>
                        {isSuitable ? t('suitable') : t('not_suitable')}
                    </Text>
                </AnimatedCard>

                <AnimatedCard style={styles.section} delay={200}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="information-circle-outline" size={24} color="#2E7D32" />
                        <Text style={styles.sectionTitle}>{t('explanation')}</Text>
                    </View>
                    <Text style={styles.sectionContent}>{explanation}</Text>
                </AnimatedCard>

                <AnimatedCard style={styles.section} delay={400}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="bulb-outline" size={24} color="#2E7D32" />
                        <Text style={styles.sectionTitle}>{t('recommendations')}</Text>
                    </View>
                    {recommendations.split('|').map((item, index) => (
                        <View key={index} style={styles.bulletItem}>
                            <Ionicons name="caret-forward" size={16} color="#4CAF50" />
                            <Text style={styles.sectionContent}>{item.trim()}</Text>
                        </View>
                    ))}
                </AnimatedCard>
                <View style={styles.recommenderGrid}>
                    <TouchableOpacity
                        style={[styles.gridButton, { backgroundColor: '#43A047' }]}
                        onPress={() => navigation.navigate('SeedInfo', { data: result })}>
                        <Ionicons name="leaf" size={24} color="#fff" />
                        <Text style={styles.gridButtonText}>{t('seed_btn')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.gridButton, { backgroundColor: '#2E7D32' }]}
                        onPress={() => navigation.navigate('Sowing', { data: result })}>
                        <Ionicons name="calendar" size={24} color="#fff" />
                        <Text style={styles.gridButtonText}>{t('sowing_btn')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.gridButton, { backgroundColor: '#1E88E5' }]}
                        onPress={() => navigation.navigate('Fertilizer', { data: result })}>
                        <Ionicons name="flask" size={24} color="#fff" />
                        <Text style={styles.gridButtonText}>{t('fertilizer_btn')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.gridButton, { backgroundColor: '#0288D1' }]}
                        onPress={() => navigation.navigate('Irrigation', { data: result })}>
                        <Ionicons name="water" size={24} color="#fff" />
                        <Text style={styles.gridButtonText}>{t('irrigation_btn')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('Graphs', { data: result })}>
                        <Ionicons name="bar-chart-outline" size={20} color="#fff" />
                        <Text style={styles.actionButtonText}>{t('graphs')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    predictionCard: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    successGlow: {
        borderBottomWidth: 5,
        borderBottomColor: '#4CAF50',
    },
    errorGlow: {
        borderBottomWidth: 5,
        borderBottomColor: '#F44336',
    },
    predictionText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 15,
        textAlign: 'center',
    },
    section: {
        marginBottom: 16,
        padding: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    sectionContent: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
        flex: 1,
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: 8,
    },
    buttonContainer: {
        gap: 12,
        marginTop: 10,
    },
    actionButton: {
        backgroundColor: '#00796B', // Deep Teal for variety
        padding: 18,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
        marginBottom: 10,
    },
    recommenderGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20,
    },
    gridButton: {
        flex: 1,
        minWidth: '45%',
        height: 100,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    gridButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 8,
        textAlign: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    actionButtonSecondary: {
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#2E7D32',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    actionButtonTextSecondary: {
        color: '#2E7D32',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

