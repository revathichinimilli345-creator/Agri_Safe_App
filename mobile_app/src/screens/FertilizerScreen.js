import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';
import { theme } from '../theme';

export default function FertilizerScreen({ route, navigation }) {
    const { t } = useTranslation();
    const { prediction } = route.params.data;

    return (
        <GradientBackground>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={28} color="#1565C0" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t('fertilizer_btn')}</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    {/* Hero Section */}
                    <AnimatedCard style={styles.heroCard} delay={100}>
                        <LinearGradient
                            colors={['#42A5F5', '#1565C0']}
                            style={styles.heroGradient}
                        >
                            <Ionicons name="flask" size={50} color="#fff" />
                            <Text style={styles.heroTitle}>Soil Nutrition Plan</Text>
                            <Text style={styles.heroSubtitle}>Balanced fertilization for crop health</Text>
                        </LinearGradient>
                    </AnimatedCard>

                    {/* Recommendation Box */}
                    <AnimatedCard style={styles.recCard} delay={200}>
                        <Text style={styles.sectionTitle}>{t('fertilizer_rec_label')}</Text>
                        <View style={styles.valueBox}>
                            <Text style={styles.valueText}>{prediction.fertilizer_recommendation || t('standard_npk')}</Text>
                        </View>
                    </AnimatedCard>

                    {/* Dosage Breakdown */}
                    <AnimatedCard style={styles.infoCard} delay={300}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="calculator-outline" size={24} color="#1565C0" />
                            <Text style={styles.cardTitle}>Dosage Principles</Text>
                        </View>
                        <Text style={styles.cardContent}>
                            **The 4Rs of Fertilization**:{"\n"}
                            1. **Right Source**: Match fertilizer type to crop needs.{"\n"}
                            2. **Right Rate**: Apply based on soil test results.{"\n"}
                            3. **Right Time**: Provide nutrients when crops need them most.{"\n"}
                            4. **Right Place**: Place where roots can easily absorb them.
                        </Text>
                    </AnimatedCard>

                    {/* Micro-Nutrients */}
                    <AnimatedCard style={styles.infoCard} delay={400}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="shapes-outline" size={24} color="#1565C0" />
                            <Text style={styles.cardTitle}>Micro-Nutrient Advice</Text>
                        </View>
                        <Text style={styles.cardContent}>
                            Don't forget trace elements like Zinc, Boron, and Sulphur. Deficiencies in these can limit the effectiveness of NPK fertilizers. Apply 25kg/ha Zinc Sulphate once every 3 seasons for better results.
                        </Text>
                    </AnimatedCard>

                    <AnimatedCard style={[styles.infoCard, styles.alertCard]} delay={500}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="alert-circle" size={24} color="#D32F2F" />
                            <Text style={[styles.cardTitle, { color: '#D32F2F' }]}>Caution</Text>
                        </View>
                        <Text style={[styles.cardContent, { color: '#C62828' }]}>
                            Over-application of Urea can cause pest outbreaks and groundwater pollution. Always prioritize soil health over immediate growth.
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
        color: '#0D47A1',
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
    recCard: {
        padding: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    valueBox: {
        backgroundColor: '#1E88E5',
        padding: 20,
        borderRadius: 15,
        borderLeftWidth: 6,
        borderLeftColor: '#0D47A1',
    },
    valueText: {
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
        color: '#0D47A1',
    },
    cardContent: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
    },
    alertCard: {
        backgroundColor: '#FFEBEE',
        borderWidth: 1,
        borderColor: '#FFCDD2',
    }
});
