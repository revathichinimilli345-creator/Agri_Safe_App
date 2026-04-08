import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

export default function SeedInfoScreen({ route, navigation }) {
    const { t } = useTranslation();
    const { prediction } = route.params.data;
    const seedVarieties = prediction.seed_recommendation ? prediction.seed_recommendation.split(',') : [];

    return (
        <GradientBackground>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={28} color="#2E7D32" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t('seed_btn')}</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    {/* Hero Section */}
                    <AnimatedCard style={styles.heroCard} delay={100}>
                        <LinearGradient
                            colors={['#4CAF50', '#2E7D32']}
                            style={styles.heroGradient}
                        >
                            <Ionicons name="leaf" size={50} color="#fff" />
                            <Text style={styles.heroTitle}>Premium Seed Selection</Text>
                            <Text style={styles.heroSubtitle}>Optimized for your soil analysis</Text>
                        </LinearGradient>
                    </AnimatedCard>

                    {/* Varieties Grid */}
                    <Text style={styles.sectionTitle}>{t('recommended_varieties')}</Text>
                    <View style={styles.varietyContainer}>
                        {seedVarieties.length > 0 ? (
                            seedVarieties.map((variety, index) => (
                                <AnimatedCard key={index} style={styles.varietyItem} delay={200 + (index * 50)}>
                                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                                    <Text style={styles.varietyText}>{variety.trim()}</Text>
                                </AnimatedCard>
                            ))
                        ) : (
                            <Text style={styles.noDataText}>{t('info_pending')}</Text>
                        )}
                    </View>

                    {/* Sourcing & Treatment */}
                    <AnimatedCard style={styles.infoCard} delay={400}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="cart-outline" size={24} color="#2E7D32" />
                            <Text style={styles.cardTitle}>Sourcing Advice</Text>
                        </View>
                        <Text style={styles.cardContent}>
                            Purchase only "Certified Seeds" with valid tags from government-authorized agencies (NSC, State Seed Corp) or reputable private companies. Avoid using loose seeds from previous harvests for commercial crops.
                        </Text>
                    </AnimatedCard>

                    <AnimatedCard style={styles.infoCard} delay={500}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="flask-outline" size={24} color="#2E7D32" />
                            <Text style={styles.cardTitle}>Pre-Sowing Treatment</Text>
                        </View>
                        <Text style={styles.cardContent}>
                            1. **Fungicide**: Treat seeds with Thiram or Captan (2.5g/kg) to prevent soil-borne diseases.{"\n"}
                            2. **Rhizobium**: For pulses, use Rhizobium culture for better nitrogen fixation.{"\n"}
                            3. **Soaking**: Some crops benefit from 12-hour soaking in water to break dormancy.
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
        color: '#1B5E20',
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 15,
        marginLeft: 4,
    },
    varietyContainer: {
        flexDirection: 'column',
        gap: 10,
        marginBottom: 25,
    },
    varietyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        gap: 8,
        width: '100%',
    },
    varietyText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
        flex: 1,
    },
    noDataText: {
        color: '#999',
        fontStyle: 'italic',
        textAlign: 'center',
        width: '100%',
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
        color: '#1B5E20',
    },
    cardContent: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
    }
});
