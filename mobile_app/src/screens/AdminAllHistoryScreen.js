import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getAllUserHistory } from '../api/client';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export default function AdminAllHistoryScreen({ navigation, route }) {
    const { t } = useTranslation();
    const { userId, username } = route.params || {};
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchHistory = async () => {
        try {
            const data = await getAllUserHistory(userId);
            setHistory(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchHistory();
    };

    const renderItem = ({ item }) => (
        <AnimatedCard style={styles.historyCard}>
            <TouchableOpacity onPress={() => navigation.navigate('Result', { result: item })}>
                <View style={styles.cardHeader}>
                    <View style={styles.stateContainer}>
                        <Ionicons name="location" size={16} color={theme.colors.primary} />
                        <Text style={styles.stateText}>{item.state}</Text>
                    </View>
                    <Text style={styles.dateText}>{new Date(item.created_at).toLocaleDateString()}</Text>
                </View>
                
                <View style={styles.cardBody}>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Soil Type:</Text>
                        <Text style={styles.value}>{item.soil_type}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Suitability:</Text>
                        <Text style={[styles.value, { color: item.prediction?.is_suitable ? '#2ecc71' : '#e74c3c' }]}>
                            {item.prediction?.is_suitable ? 'Highly Suitable' : 'Not Recommended'}
                        </Text>
                    </View>
                </View>
                
                <View style={styles.userBadge}>
                    <Ionicons name="person" size={12} color={theme.colors.textSecondary} />
                    <Text style={styles.userText}>User ID: {item.id}</Text>
                </View>
                
                <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} style={styles.arrow} />
            </TouchableOpacity>
        </AnimatedCard>
    );

    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.title}>{username ? `${username}'s Activity` : 'All Predictions'}</Text>
                        <Text style={styles.subtitle}>{username ? 'User specific logs' : 'Global Activity Log'}</Text>
                    </View>
                </View>

                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    </View>
                ) : (
                    <FlatList
                        data={history}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={styles.list}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="documents-outline" size={60} color={theme.colors.textSecondary} style={{ opacity: 0.3 }} />
                                <Text style={styles.emptyText}>No activity recorded yet.</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
    },
    backButton: {
        marginRight: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    list: {
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
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
});
