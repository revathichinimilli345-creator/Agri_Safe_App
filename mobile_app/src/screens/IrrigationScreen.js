import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';
import { theme } from '../theme';

export default function IrrigationScreen({ route, navigation }) {
    const { t } = useTranslation();
    const { prediction } = route.params.data;

    return (
        <GradientBackground>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={28} color="#0277BD" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t('irrigation_btn')}</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    {/* Hero Section */}
                    <AnimatedCard style={styles.heroCard} delay={100}>
                        <LinearGradient
                            colors={['#4FC3F7', '#0277BD']}
                            style={styles.heroGradient}
                        >
                            <Ionicons name="water" size={50} color="#fff" />
                            <Text style={styles.heroTitle}>Water Management</Text>
                            <Text style={styles.heroSubtitle}>Smart irrigation for water conservation</Text>
                        </LinearGradient>
                    </AnimatedCard>

                    {/* Schedule Box */}
                    <AnimatedCard style={styles.schedCard} delay={200}>
                        <Text style={styles.sectionTitle}>{t('irrigation_sched_label')}</Text>
                        <View style={styles.waterBadge}>
                            <Text style={styles.waterText}>{prediction.irrigation_schedule || t('monitor_moisture')}</Text>
                        </View>
                    </AnimatedCard>

                    {/* Critical Stages */}
                    <AnimatedCard style={styles.infoCard} delay={300}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="warning-outline" size={24} color="#0277BD" />
                            <Text style={styles.cardTitle}>Critical Growth Stages</Text>
                        </View>
                        <Text style={styles.cardContent}>
                            Crops are highly sensitive to water stress during:{"\n"}
                            • **Establishment Stage**: Early 2 weeks.{"\n"}
                            • **Flowering Stage**: Peak water demand.{"\n"}
                            • **Grain/Fruit Filling**: Impacts final yield quality.{"\n"}
                            *Avoid water stress during these periods.*
                        </Text>
                    </AnimatedCard>

                    {/* Irrigation Methods */}
                    <AnimatedCard style={styles.infoCard} delay={400}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="options-outline" size={24} color="#0277BD" />
                            <Text style={styles.cardTitle}>Recommended Methods</Text>
                        </View>
                        <View style={styles.methodBox}>
                            <View style={styles.methodItem}>
                                <Ionicons name="radio-button-on" size={16} color="#0288D1" />
                                <Text style={styles.methodText}>**Drip Irrigation**: Saves up to 60% water.</Text>
                            </View>
                            <View style={styles.methodItem}>
                                <Ionicons name="radio-button-on" size={16} color="#0288D1" />
                                <Text style={styles.methodText}>**Sprinkler**: Ideal for undulating lands.</Text>
                            </View>
                            <View style={styles.methodItem}>
                                <Ionicons name="radio-button-on" size={16} color="#0288D1" />
                                <Text style={styles.methodText}>**Furrow**: Common but uses more water.</Text>
                            </View>
                        </View>
                    </AnimatedCard>

                    <AnimatedCard style={[styles.infoCard, styles.tipCard]} delay={500}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="bulb" size={24} color="#01579B" />
                            <Text style={[styles.cardTitle, { color: '#01579B' }]}>Eco Suggestion</Text>
                        </View>
                        <Text style={[styles.cardContent, { color: '#01579B' }]}>
                            Adopt mulching techniques to reduce evaporation losses and maintain consistent soil temperature.
                        </Text>
                    </AnimatedCard>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#01579B',
        marginLeft: 12,
    },
    scrollContainer: {
        padding: 20,
    },
    heroCard: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 25,
        padding: 0,
    },
    heroGradient: {
        padding: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    heroSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginTop: 4,
    },
    schedCard: {
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 15,
    },
    waterBadge: {
        backgroundColor: '#0288D1',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 15,
        width: '100%',
    },
    waterText: {
        color: '#fff',
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '500',
        textAlign: 'left',
    },
    infoCard: {
        padding: 20,
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#01579B',
    },
    cardContent: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
    },
    methodBox: {
        gap: 10,
    },
    methodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    methodText: {
        fontSize: 14,
        color: '#555',
        flex: 1,
    },
    tipCard: {
        backgroundColor: '#E1F5FE',
        borderWidth: 1,
        borderColor: '#B3E5FC',
    }
});
