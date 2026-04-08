import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { loginUser, apiClient } from '../api/client';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function AdminLoginScreen({ navigation }) {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert("Error", "Please enter both admin username and password");
            return;
        }

        setLoading(true);
        try {
            const data = await loginUser({ username, password });
            
            // Check if user is staff via auth/me
            const userResponse = await apiClient.get('/auth/me/', {
                headers: { Authorization: `Bearer ${data.access}` }
            });

            if (!userResponse.data.is_staff) {
                Alert.alert("Access Denied", "This account does not have administrative privileges.");
                setLoading(false);
                return;
            }

            await AsyncStorage.setItem('access_token', data.access);
            await AsyncStorage.setItem('refresh_token', data.refresh);
            await AsyncStorage.setItem('username', username);
            await AsyncStorage.setItem('is_admin', 'true');
            
            navigation.replace('AdminDashboard');
        } catch (error) {
            console.error("ADMIN LOGIN ERROR:", error);
            if (error.response) {
                console.error("ADMIN RESPONSE:", error.response.status, error.response.data);
            } else if (error.request) {
                console.error("ADMIN REQUEST (No Response):", error.request);
            } else {
                console.error("ADMIN ERROR MESSAGE:", error.message);
            }
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
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
                </TouchableOpacity>

                <View style={styles.header}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="shield-checkmark" size={40} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.brandName}>AgriSafe Admin</Text>
                </View>

                <AnimatedCard style={styles.card}>
                    <Text style={styles.title}>Admin Portal</Text>
                    <Text style={styles.subtitle}>Sign in to manage agriculture insights</Text>

                    <CustomInput
                        label="Admin Username"
                        placeholder="Enter admin ID"
                        value={username}
                        onChangeText={setUsername}
                    />

                    <CustomInput
                        label="Password"
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <CustomButton
                        title="Sign In as Admin"
                        onPress={handleLogin}
                        loading={loading}
                        style={styles.loginBtn}
                    />
                </AnimatedCard>
                <Text style={styles.footerText}>Administrative Panel v1.0</Text>
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
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 1,
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
    footerText: {
        textAlign: 'center',
        color: theme.colors.textSecondary,
        fontSize: 12,
        marginTop: theme.spacing.xl,
        opacity: 0.6,
    }
});
