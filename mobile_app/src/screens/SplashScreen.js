import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import GradientBackground from '../components/GradientBackground';

export default function SplashScreen({ navigation }) {
    const { t } = useTranslation();

    React.useEffect(() => {
        // Navigate to Login screen after 2 seconds
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Text style={styles.title}>{t('app_title')}</Text>
                    <Text style={styles.tagline}>Smart Climate-Aware Agriculture</Text>
                </View>
                <ActivityIndicator size="large" color="#fff" style={styles.loader} />
            </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        letterSpacing: 1,
    },
    tagline: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 8,
        fontWeight: '500',
    },
    loader: {
        position: 'absolute',
        bottom: 80,
    }
});

