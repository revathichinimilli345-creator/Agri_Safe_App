import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getAdminStats, getAllUserHistory } from '../api/client';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';
import { theme } from '../theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// StatCard and Indicators moved to Analysis where appropriate.
// Keeping StatCard for dashboard overview.

export default function AdminDashboardScreen({ navigation }) {
    const { t } = useTranslation();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const statsData = await getAdminStats();
            setStats(statsData);
        } catch (error) {
            console.error("FETCH ERROR:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
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


    return (
        <GradientBackground>
            {/* Main Content */}
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
            >
                    <View style={styles.container}>
                        {/* Glassmorphism Header */}
                        <View style={styles.header}>
                            <View>
                                <Text style={styles.brandText}>AgriSafe Intelligence</Text>
                                <Text style={styles.title}>Admin Panel</Text>
                            </View>
                        </View>

                    {/* Quick Overview Grid */}
                    <View style={styles.statsGrid}>
                        <StatCard 
                            title="Total Users" 
                            value={stats?.total_users || 0} 
                            icon="people" 
                            color="#3498db" 
                        />
                        <StatCard 
                            title="Predictions" 
                            value={stats?.total_predictions || 0} 
                            icon="analytics" 
                            color="#2ecc71" 
                        />
                    </View>

                    {/* Big Action Button for Predictions */}
                    <TouchableOpacity 
                        style={styles.predictionsBtn} 
                        onPress={() => navigation.navigate('AdminAllHistory')}
                    >
                        <LinearGradient colors={['#2ecc71', '#27ae60']} style={styles.predictionsGradient}>
                            <Ionicons name="list" size={24} color="#fff" />
                            <Text style={styles.predictionsBtnText}>View All Predictions</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Activity Feed */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Latest Activity Feed</Text>
                    </View>
                    
                    {stats?.recent_activity?.map((item, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={styles.recentItem}
                            onPress={() => { navigation.navigate('Result', { result: item }); }}
                        >
                            <View style={styles.recentIcon}>
                                <View style={[styles.statusDot, { backgroundColor: item.is_suitable ? '#2ecc71' : '#e74c3c' }]} />
                                <MaterialCommunityIcons name="map-marker-radius" size={24} color={theme.colors.primary} />
                            </View>
                            <View style={styles.recentTextContainer}>
                                <Text style={styles.recentTitle}>{item.state} - {item.soil_type}</Text>
                                <Text style={styles.recentMeta}>{new Date(item.created_at).toLocaleString()}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    ))}
                    
                    <View style={styles.bottomGap} />
                </View>
            </ScrollView>

            {/* Bottom Navigation Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.bottomBarItem}>
                    <View style={[styles.bottomBarIconActive]}>
                        <Ionicons name="home" size={24} color={theme.colors.primary} />
                    </View>
                    <Text style={[styles.bottomBarText, { color: theme.colors.primary, fontWeight: 'bold' }]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.bottomBarItem}
                    onPress={() => navigation.navigate('AdminUserManagement')}
                >
                    <Ionicons name="people-outline" size={24} color={theme.colors.textSecondary} />
                    <Text style={styles.bottomBarText}>Users</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.bottomBarItem}
                    onPress={() => navigation.navigate('AdminAnalysis')}
                >
                    <Ionicons name="analytics-outline" size={24} color={theme.colors.textSecondary} />
                    <Text style={styles.bottomBarText}>Analysis</Text>
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

const StatCard = ({ title, value, icon, color }) => (
    <AnimatedCard style={[styles.statCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
        <View style={styles.statIconContainer}>
            <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
    </AnimatedCard>
);

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
        paddingBottom: 24, // extra padding for bottom safe area
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
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 16,
        ...theme.shadows.light,
    },
    logoutText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#e74c3c',
        marginLeft: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.md,
    },
    statCard: {
        width: (width - theme.spacing.lg * 2.5) / 2,
        padding: theme.spacing.md,
        alignItems: 'center',
    },
    statIconContainer: {
        marginBottom: 8,
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    statTitle: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
        marginTop: theme.spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing.lg,
    },
    viewMore: {
        color: theme.colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
    predictionsBtn: {
        marginTop: theme.spacing.lg,
        borderRadius: 20,
        overflow: 'hidden',
        ...theme.shadows.medium,
    },
    predictionsGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 10,
    },
    predictionsBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.lg,
        paddingTop: 60,
        backgroundColor: 'rgba(255,255,255,0.7)',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    modalCloseBtn: {
        padding: 8,
    },
    modalList: {
        padding: theme.spacing.lg,
        paddingBottom: 40,
    },
    historyCard: {
        marginBottom: theme.spacing.md,
        padding: theme.spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 8,
    },
    stateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginLeft: 4,
    },
    dateText: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    cardBody: {
        marginTop: 4,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    label: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
    },
    userBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        opacity: 0.6,
    },
    userText: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginLeft: 4,
    },
    arrow: {
        position: 'absolute',
        right: 0,
        top: '50%',
        marginTop: -10,
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: theme.spacing.md,
        borderRadius: 20,
        marginBottom: 10,
        ...theme.shadows.small,
    },
    recentIcon: {
        position: 'relative',
        marginRight: 15,
    },
    statusDot: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#fff',
        zIndex: 1,
    },
    recentTextContainer: {
        flex: 1,
    },
    recentTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    recentMeta: {
        fontSize: 12,
        color: theme.colors.textSecondary,
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
        height: 40,
    }
});
