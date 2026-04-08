import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { loginUser } from '../api/client';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert("Error", "Please enter both username and password");
            return;
        }

        setLoading(true);
        try {
            const trimmedUsername = username.trim();
            const data = await loginUser({ username: trimmedUsername, password });
            await AsyncStorage.setItem('access_token', data.access);
            await AsyncStorage.setItem('refresh_token', data.refresh);
            await AsyncStorage.setItem('username', trimmedUsername);
            navigation.replace('Main');
        } catch (error) {
            Alert.alert("Login Failed", "Invalid credentials or server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <GradientBackground>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.header}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="leaf" size={40} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.brandName}>AgriSafe</Text>
                </View>

                <AnimatedCard style={styles.card}>
                    <Text style={styles.title}>{t('login_title')}</Text>
                    <Text style={styles.subtitle}>{t('login_subtitle')}</Text>

                    <CustomInput
                        label={t('username')}
                        placeholder="Enter your username"
                        value={username}
                        onChangeText={setUsername}
                    />

                    <CustomInput
                        label={t('password')}
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <CustomButton
                        title={t('sign_in')}
                        onPress={handleLogin}
                        loading={loading}
                        style={styles.loginBtn}
                    />

                    <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
                        <Text style={styles.linkText}>
                            {t('no_account')} <Text style={styles.linkHighlight}>Register Now</Text>
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('AdminLogin')} style={styles.adminPortalLink}>
                        <Text style={styles.adminLinkText}>Admin Portal</Text>
                    </TouchableOpacity>
                </AnimatedCard>
                <Text style={styles.footerText}>Secure Agriculture Insights v1.2</Text>
            </KeyboardAvoidingView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: theme.spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.medium,
        marginBottom: theme.spacing.sm,
    },
    brandName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
        letterSpacing: 1,
    },
    card: {
        padding: theme.spacing.lg,
        maxWidth: 480,
        width: '100%',
        alignSelf: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: theme.spacing.xs,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.lg,
        textAlign: 'center',
    },
    loginBtn: {
        marginTop: theme.spacing.md,
    },
    registerLink: {
        marginTop: theme.spacing.lg,
        alignItems: 'center',
    },
    linkText: {
        color: theme.colors.textSecondary,
        fontSize: 15,
    },
    linkHighlight: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    adminPortalLink: {
        marginTop: theme.spacing.md,
        alignItems: 'center',
        padding: 10,
    },
    adminLinkText: {
        color: theme.colors.primary,
        fontSize: 14,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    footerText: {
        textAlign: 'center',
        color: theme.colors.textSecondary,
        fontSize: 12,
        marginTop: theme.spacing.xl,
        opacity: 0.6,
    }
});


