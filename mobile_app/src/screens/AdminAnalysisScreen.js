import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getAdminStats } from '../api/client';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';
import { theme } from '../theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const SoilHealthIndicator = ({ label, value, icon, unit, color }) => (
    <View style={styles.soilIndicator}>
        <View style={[styles.indicatorIcon, { backgroundColor: color + '20' }]}>
            <MaterialCommunityIcons name={icon} size={20} color={color} />
        </View>
        <View style={styles.indicatorText}>
            <Text style={styles.indicatorValue}>{value}<Text style={styles.indicatorUnit}> {unit}</Text></Text>
            <Text style={styles.indicatorLabel}>{label}</Text>
        </View>
    </View>
);

export default function AdminAnalysisScreen({ navigation }) {
    const { t } = useTranslation();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchStats = async () => {
        try {
            const data = await getAdminStats();
            setStats(data);
        } catch (error) {
            console.error("STATS FETCH ERROR:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchStats();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'username', 'is_admin']);
        navigation.replace('Login');
    };

    if (loading && !stats) {
        return (
            <GradientBackground>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            </GradientBackground>
        );
    }

    const pieData = stats?.suitability_dist?.map(item => ({
        name: item.name,
        count: item.count,
        color: item.color,
        legendFontColor: theme.colors.text,
        legendFontSize: 12,
    })) || [];

    return (
        <GradientBackground>
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.brandText}>AgriSafe Intelligence</Text>
                            <Text style={styles.title}>Data Analysis</Text>
                        </View>
                    </View>

                    {/* Suitability Analytic Chart */}
                    <Text style={styles.sectionTitle}>Suitability Analysis</Text>
                    <AnimatedCard style={styles.chartCard}>
                        {pieData.length > 0 ? (
                            <View style={styles.pieContainer}>
                                <PieChart
                                    data={pieData}
                                    width={width - 80}
                                    height={180}
                                    chartConfig={{
                                        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                                    }}
                                    accessor="count"
                                    backgroundColor="transparent"
                                    paddingLeft="15"
                                    absolute
                                />
                            </View>
                        ) : (
                            <Text style={styles.emptyText}>No data available for analysis</Text>
                        )}
                    </AnimatedCard>

                    {/* Regional Soil Health Profile */}
                    <Text style={styles.sectionTitle}>Average Regional Soil Profile</Text>
                    <AnimatedCard style={styles.soilCard}>
                        <View style={styles.soilGrid}>
                            <SoilHealthIndicator label="Nitrogen" value={stats?.soil_health?.n || 0} icon="molecule" unit="mg/kg" color="#3498db" />
                            <SoilHealthIndicator label="Phosphorus" value={stats?.soil_health?.p || 0} icon="shaker" unit="mg/kg" color="#e67e22" />
                            <SoilHealthIndicator label="Potassium" value={stats?.soil_health?.k || 0} icon="shaker-outline" unit="mg/kg" color="#8e44ad" />
                            <SoilHealthIndicator label="Soil pH" value={stats?.soil_health?.ph || 0} icon="test-tube" unit="" color="#2ecc71" />
                        </View>
                    </AnimatedCard>

                    {/* Regional Activity Breakdown */}
                    <Text style={styles.sectionTitle}>Regions Activity</Text>
                    <AnimatedCard style={styles.regionsCard}>
                        {stats?.top_regions?.map((region, index) => (
                            <View key={index} style={styles.regionRow}>
                                <View style={styles.regionNameContainer}>
                                    <Ionicons name="location-sharp" size={16} color={theme.colors.primary} />
                                    <Text style={styles.regionName}>{region.state}</Text>
                                </View>
                                <View style={styles.regionBarContainer}>
                                    <View style={styles.regionBarBase}>
                                        <View style={[styles.regionBar, { width: `${(region.count / stats.total_predictions) * 100}%` }]} />
                                    </View>
                                    <Text style={styles.regionCount}>{region.count}</Text>
                                </View>
                            </View>
                        ))}
                    </AnimatedCard>

                    {/* Top Crop Trends */}
                    <Text style={styles.sectionTitle}>Global Crop Trends</Text>
                    <AnimatedCard style={styles.cropsCard}>
                        {stats?.top_recommended_crops?.map((crop, index) => (
                            <View key={index} style={styles.cropItem}>
                                <Text style={styles.cropName}>{crop.suggested_crops || 'General'}</Text>
                                <View style={styles.cropBarContainer}>
                                    <View style={styles.cropBarBase}>
                                        <View style={[styles.cropBar, { width: `${(crop.count / stats.total_predictions) * 100}%`, backgroundColor: '#3498db' }]} />
                                    </View>
                                    <Text style={styles.cropCount}>{crop.count} recs</Text>
                                </View>
                            </View>
                        ))}
                    </AnimatedCard>

                    <View style={styles.bottomGap} />
                </View>
            </ScrollView>

            {/* Bottom Navigation Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity 
                    style={styles.bottomBarItem}
                    onPress={() => navigation.navigate('AdminDashboard')}
                >
                    <Ionicons name="home-outline" size={24} color={theme.colors.textSecondary} />
                    <Text style={styles.bottomBarText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.bottomBarItem}
                    onPress={() => navigation.navigate('AdminUserManagement')}
                >
                    <Ionicons name="people-outline" size={24} color={theme.colors.textSecondary} />
                    <Text style={styles.bottomBarText}>Users</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomBarItem}>
                    <View style={[styles.bottomBarIconActive]}>
                        <Ionicons name="analytics" size={24} color={theme.colors.primary} />
                    </View>
                    <Text style={[styles.bottomBarText, { color: theme.colors.primary, fontWeight: 'bold' }]}>Analysis</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.bottomBarItem}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
                    <Text style={[styles.bottomBarText, { color: '#e74c3c' }]}>Logout</Text>
                </TouchableOpacity>
            </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    container: {
        padding: theme.spacing.lg,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        ...theme.shadows.medium,
    },
    bottomBarItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    bottomBarIconActive: {
        padding: 8,
        backgroundColor: theme.colors.primary + '15',
        borderRadius: 20,
    },
    bottomBarText: {
        fontSize: 10,
        color: theme.colors.textSecondary,
        marginTop: 4,
    },
    brandText: {
        fontSize: 12,
        color: theme.colors.primary,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: theme.colors.text,
        letterSpacing: -1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
        marginTop: theme.spacing.lg,
    },
    chartCard: {
        padding: theme.spacing.md,
        alignItems: 'center',
    },
    pieContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    soilCard: {
        padding: theme.spacing.md,
    },
    soilGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    soilIndicator: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    indicatorIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    indicatorValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    indicatorUnit: {
        fontSize: 10,
        color: theme.colors.textSecondary,
    },
    indicatorLabel: {
        fontSize: 11,
        color: theme.colors.textSecondary,
    },
    regionsCard: {
        padding: theme.spacing.md,
    },
    regionRow: {
        marginBottom: 12,
    },
    regionNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    regionName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginLeft: 6,
    },
    regionBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    regionBarBase: {
        flex: 1,
        height: 6,
        backgroundColor: '#f0f0f0',
        borderRadius: 3,
        marginRight: 10,
        overflow: 'hidden',
    },
    regionBar: {
        height: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: 3,
    },
    regionCount: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        fontWeight: 'bold',
    },
    cropsCard: {
        padding: theme.spacing.md,
    },
    cropItem: {
        marginBottom: 12,
    },
    cropName: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 4,
    },
    cropBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cropBarBase: {
        flex: 1,
        height: 6,
        backgroundColor: '#f0f0f0',
        borderRadius: 3,
        marginRight: 10,
    },
    cropBar: {
        height: '100%',
        borderRadius: 3,
    },
    cropCount: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        fontWeight: '700',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        color: theme.colors.textSecondary,
        fontStyle: 'italic',
    },
    bottomGap: {
        height: 80,
    }
});
