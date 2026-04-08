import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Animated, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';
import CustomButton from '../components/CustomButton';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
    const { t } = useTranslation();
    const [userName, setUserName] = useState('');
    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const fetchUser = async () => {
            const storedName = await AsyncStorage.getItem('username');
            if (storedName) setUserName(storedName);
        };
        fetchUser();
    }, []);

    const headerHeight = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [120, 80],
        extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.9],
        extrapolate: 'clamp',
    });

    const statsEntries = [
        { label: 'Analyses', value: '12', icon: 'analytics', color: '#4CAF50' },
        { label: 'Health', value: '98%', icon: 'shield-checkmark', color: '#2196F3' },
        { label: 'Yield', value: '+15%', icon: 'trending-up', color: '#FF9800' },
    ];

    return (
        <GradientBackground>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{ flex: 1 }}>
                <Animated.View style={[styles.header, { height: headerHeight, opacity: headerOpacity }]}>
                    <View>
                        <Text style={styles.greeting}>Good Morning,</Text>
                        <Text style={styles.userName}>{userName || 'Farmer'}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.profileBtn}
                        onPress={() => navigation.navigate('History')}
                    >
                        <View style={styles.profileBadge}>
                            <Ionicons name="person" size={24} color={theme.colors.primary} />
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: false }
                    )}
                >
                    {/* Featured Hero Card */}
                    <AnimatedCard style={styles.heroCard} delay={200}>
                        <LinearGradient
                            colors={theme.colors.heroGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.heroGradient}
                        >
                            <View style={styles.heroContent}>
                                <View style={styles.heroTextContent}>
                                    <Text style={styles.heroTitle}>Smart Farm Intelligence</Text>
                                    <Text style={styles.heroSubtitle}>Advanced AI predicting land suitability for your crops.</Text>
                                    <CustomButton
                                        title="New Prediction"
                                        onPress={() => navigation.navigate('Analysis')}
                                        style={styles.heroBtn}
                                        textStyle={{ color: theme.colors.primary }}
                                    />
                                </View>
                                <Ionicons name="leaf" size={120} color="rgba(255,255,255,0.15)" style={styles.heroIcon} />
                            </View>
                        </LinearGradient>
                    </AnimatedCard>

                    {/* Stats Section */}
                    <View style={styles.statsContainer}>
                        {statsEntries.map((stat, index) => (
                            <AnimatedCard key={index} delay={300 + (index * 100)} style={styles.statCard}>
                                <Ionicons name={stat.icon} size={20} color={stat.color} />
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </AnimatedCard>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>Main Services</Text>

                    <View style={styles.actionGrid}>
                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={() => navigation.navigate('Analysis')}
                            activeOpacity={0.9}
                        >
                            <AnimatedCard delay={500} style={[styles.actionInner, { backgroundColor: '#E8F5E9' }]}>
                                <View style={styles.actionIconBox}>
                                    <Ionicons name="flask" size={28} color={theme.colors.primary} />
                                </View>
                                <Text style={styles.actionTitle}>Soil Check</Text>
                                <Text style={styles.actionDesc}>Analyze Nutrients</Text>
                            </AnimatedCard>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={() => navigation.navigate('History')}
                            activeOpacity={0.9}
                        >
                            <AnimatedCard delay={600} style={[styles.actionInner, { backgroundColor: '#E3F2FD' }]}>
                                <View style={[styles.actionIconBox, { backgroundColor: '#BBDEFB' }]}>
                                    <Ionicons name="time" size={28} color="#1976D2" />
                                </View>
                                <Text style={styles.actionTitle}>History</Text>
                                <Text style={styles.actionDesc}>View Records</Text>
                            </AnimatedCard>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionTitle}>Seasonal Advice</Text>
                    <AnimatedCard style={styles.adviceCard} delay={700}>
                        <View style={styles.adviceHeader}>
                            <View style={styles.adviceIconBox}>
                                <Ionicons name="sunny" size={24} color="#FBC02D" />
                            </View>
                            <View>
                                <Text style={styles.adviceTitle}>Summer Preparation</Text>
                                <Text style={styles.adviceSubtitle}>March - June</Text>
                            </View>
                        </View>
                        <Text style={styles.adviceText}>
                            Ensure your irrigation channels are clear. Consider mulching to conserve soil moisture during high temperature periods.
                        </Text>
                        <TouchableOpacity
                            style={styles.readMoreBtn}
                            onPress={() => navigation.navigate('Guidance')}
                        >
                            <Text style={styles.readMoreText}>Read Full Guide</Text>
                            <Ionicons name="arrow-forward" size={16} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </AnimatedCard>

                    <View style={{ height: 40 }} />
                </Animated.ScrollView>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        backgroundColor: 'rgba(252, 251, 244, 0.8)',
        zIndex: 10,
    },
    greeting: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    userName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: 2,
    },
    profileBtn: {
        padding: 2,
    },
    profileBadge: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(27, 94, 32, 0.1)',
    },
    scrollContainer: {
        padding: theme.spacing.lg,
        paddingTop: 10,
    },
    heroCard: {
        padding: 0,
        overflow: 'hidden',
        borderWidth: 0,
        marginBottom: theme.spacing.lg,
    },
    heroGradient: {
        padding: theme.spacing.xl,
        borderRadius: theme.borderRadius.lg,
    },
    heroContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    heroTextContent: {
        flex: 1,
        zIndex: 1,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.surface,
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 20,
        lineHeight: 22,
    },
    heroBtn: {
        backgroundColor: theme.colors.surface,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        alignSelf: 'flex-start',
        ...theme.shadows.medium,
        borderRadius: 12,
    },
    heroIcon: {
        position: 'absolute',
        right: -30,
        bottom: -20,
        opacity: 0.8,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.xl,
    },
    statCard: {
        width: '31%',
        padding: theme.spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.colors.text,
        marginTop: 4,
    },
    statLabel: {
        fontSize: 11,
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    actionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.xl,
    },
    actionCard: {
        width: '48%',
    },
    actionInner: {
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
    },
    actionIconBox: {
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        ...theme.shadows.light,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    actionDesc: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginTop: 4,
    },
    adviceCard: {
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
    },
    adviceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginBottom: 15,
    },
    adviceIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#FFFDE7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    adviceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    adviceSubtitle: {
        fontSize: 13,
        color: theme.colors.textSecondary,
    },
    adviceText: {
        fontSize: 15,
        color: theme.colors.text,
        lineHeight: 24,
        marginBottom: 15,
    },
    readMoreBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    readMoreText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: theme.colors.primary,
    }
});
