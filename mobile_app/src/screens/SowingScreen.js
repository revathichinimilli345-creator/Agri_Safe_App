import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';
import { theme } from '../theme';

export default function SowingScreen({ route, navigation }) {
    const { t } = useTranslation();
    const { prediction } = route.params.data;

    return (
        <GradientBackground>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={28} color="#2E7D32" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t('sowing_btn')}</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    {/* Hero Section */}
                    <AnimatedCard style={styles.heroCard} delay={100}>
                        <LinearGradient
                            colors={['#81C784', '#2E7D32']}
                            style={styles.heroGradient}
                        >
                            <Ionicons name="calendar" size={50} color="#fff" />
                            <Text style={styles.heroTitle}>Sowing Timeline</Text>
                            <Text style={styles.heroSubtitle}>Precision timing for maximum yield</Text>
                        </LinearGradient>
                    </AnimatedCard>

                    {/* Optimal Window */}
                    <AnimatedCard style={styles.windowCard} delay={200}>
                        <Text style={styles.sectionTitle}>{t('optimal_sowing_window')}</Text>
                        <View style={styles.badge}>
                            <Ionicons name="time" size={24} color="#fff" />
                            <Text style={styles.badgeText}>{prediction.sowing_window || t('seasonal')}</Text>
                        </View>
                    </AnimatedCard>

                    {/* Sowing Techniques */}
                    <AnimatedCard style={styles.infoCard} delay={300}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="construct-outline" size={24} color="#2E7D32" />
                            <Text style={styles.cardTitle}>Sowing Techniques</Text>
                        </View>
                        <View style={styles.bulletBox}>
                            <View style={styles.bulletItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}>**Line Sowing**: Maintain recommended spacing (e.g., 30cm x 15cm) for better sunlight and aeration.</Text>
                            </View>
                            <View style={styles.bulletItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}>**Depth Control**: Sow seeds at a depth 2.5x their size to ensure optimal moisture contact.</Text>
                            </View>
                            <View style={styles.bulletItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}>**Seed Rate**: Follow regional recommendations (e.g., 8-10 kg/acre) to avoid overcrowding.</Text>
                            </View>
                        </View>
                    </AnimatedCard>

                    {/* Checklist */}
                    <AnimatedCard style={styles.infoCard} delay={400}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="checkbox-outline" size={24} color="#2E7D32" />
                            <Text style={styles.cardTitle}>Preparation Checklist</Text>
                        </View>
                        <Text style={styles.cardContent}>
                        1. **Tillage**: Plough the field 2-3 times to achieve a fine tilth.{"\n"}
                        2. **Basal Application**: Mix FYM or Compost into the soil 2 weeks before sowing.{"\n"}
                        3. **Moisture Check**: Ensure soil "Vapsa" condition (optimal moisture) to prevent seed rot.
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
    windowCard: {
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 15,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#2E7D32',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 16,
        width: '100%',
        gap: 12,
    },
    badgeText: {
        color: '#fff',
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '500',
        flex: 1,
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
    },
    bulletBox: {
        gap: 10,
    },
    bulletItem: {
        flexDirection: 'row',
        gap: 8,
    },
    bullet: {
        color: '#2E7D32',
        fontWeight: 'bold',
    },
    bulletText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
        flex: 1,
    }
});
