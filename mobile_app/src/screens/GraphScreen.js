import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';

const screenWidth = Dimensions.get('window').width;

export default function GraphScreen({ route }) {
    const { t } = useTranslation();
    const { data } = route.params;

    const npkData = {
        labels: [t('nitrogen').split(" ")[0], t('phosphorus').split(" ")[0], t('potassium').split(" ")[0]],
        datasets: [
            {
                data: [data.nitrogen, data.phosphorus, data.potassium]
            }
        ]
    };

    const chartConfig = {
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.6,
        decimalPlaces: 0,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        propsForBackgroundLines: {
            strokeDasharray: '',
            strokeWidth: 1,
            stroke: '#E0E0E0'
        }
    };

    return (
        <GradientBackground>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <AnimatedCard style={styles.headerCard}>
                    <Text style={styles.title}>Soil Nutrient Profile</Text>
                    <Text style={styles.subtitle}>Analysis of Nitrogen, Phosphorus, and Potassium levels</Text>
                </AnimatedCard>

                <AnimatedCard style={styles.chartCard} delay={200}>
                    <BarChart
                        data={npkData}
                        width={screenWidth - 72}
                        height={240}
                        yAxisSuffix=" mg"
                        chartConfig={chartConfig}
                        verticalLabelRotation={0}
                        fromZero={true}
                        showValuesOnTopOfBars={true}
                        style={styles.chart}
                    />
                </AnimatedCard>

                <View style={styles.statsGrid}>
                    <AnimatedCard style={styles.statBox} delay={400}>
                        <Ionicons name="thermometer-outline" size={24} color="#F44336" />
                        <Text style={styles.statLabel}>{t('temperature')}</Text>
                        <Text style={styles.statValue}>{data.temperature}°C</Text>
                    </AnimatedCard>

                    <AnimatedCard style={styles.statBox} delay={500}>
                        <Ionicons name="rainy-outline" size={24} color="#2196F3" />
                        <Text style={styles.statLabel}>{t('rainfall')}</Text>
                        <Text style={styles.statValue}>{data.rainfall}mm</Text>
                    </AnimatedCard>

                    <AnimatedCard style={styles.statBox} delay={600}>
                        <Ionicons name="flask-outline" size={24} color="#9C27B0" />
                        <Text style={styles.statLabel}>{t('ph')}</Text>
                        <Text style={styles.statValue}>{data.ph}</Text>
                    </AnimatedCard>
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
    headerCard: {
        marginBottom: 16,
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1B5E20',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 4,
    },
    chartCard: {
        padding: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    chart: {
        borderRadius: 12,
        marginVertical: 8,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
    },
    statBox: {
        flex: 1,
        minWidth: '30%',
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 8,
        textAlign: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 4,
    }
});

