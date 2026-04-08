import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { getPredictionHistory } from '../api/client';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';

export default function HistoryScreen({ navigation }) {
    const { t } = useTranslation();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchHistory = async () => {
        try {
            const data = await getPredictionHistory();
            setHistory(data);
        } catch (error) {
            console.error("Failed to fetch history:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchHistory();
        });
        return unsubscribe;
    }, [navigation]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchHistory();
    };

    const renderItem = ({ item, index }) => (
        <AnimatedCard style={styles.historyCard} delay={index * 100}>
            <TouchableOpacity
                style={styles.cardContent}
                onPress={() => navigation.navigate('Result', { result: item })}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={16} color="#2E7D32" />
                        <Text style={styles.stateText}>{item.state}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: item.prediction.is_suitable ? '#E8F5E9' : '#FFEBEE' }]}>
                        <Text style={[styles.badgeText, { color: item.prediction.is_suitable ? '#2E7D32' : '#C62828' }]}>
                            {item.prediction.is_suitable ? t('suitable') : t('unsuitable')}
                        </Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.dateText}>{new Date(item.created_at).toLocaleDateString()}</Text>
                    <Ionicons name="chevron-forward" size={18} color="#999" />
                </View>
            </TouchableOpacity>
        </AnimatedCard>
    );

    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>{t('history_title') || 'Recent Analysis'}</Text>
                    <Text style={styles.subtitle}>Your last 10 land evaluations</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={history}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2E7D32']} />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="document-text-outline" size={64} color="#CCC" />
                                <Text style={styles.emptyText}>No history found. Try an analysis!</Text>
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
        padding: 16,
    },
    header: {
        marginBottom: 20,
        marginTop: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1B5E20',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    listContent: {
        paddingBottom: 20,
        gap: 12,
    },
    historyCard: {
        padding: 0,
        overflow: 'hidden',
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    stateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 12,
    },
    dateText: {
        fontSize: 13,
        color: '#999',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 16,
    }
});
