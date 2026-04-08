import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { registerUser } from '../api/client';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';

export default function RegisterScreen({ navigation }) {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!username || !email || !password) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            const trimmedUsername = username.trim();
            await registerUser({ username: trimmedUsername, email: email.trim(), password });
            Alert.alert("Success", "Account created successfully! Please login.");
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert("Registration Failed", "Username or email might already exist.");
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
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <AnimatedCard style={styles.card}>
                        <Text style={styles.title}>{t('register_title')}</Text>
                        <Text style={styles.subtitle}>{t('register_subtitle')}</Text>

                        <TextInput
                            style={styles.input}
                            placeholder={t('username')}
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            placeholderTextColor="#666"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor="#666"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder={t('password')}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholderTextColor="#666"
                        />

                        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{t('register')}</Text>}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 25 }}>
                            <Text style={styles.linkText}>{t('already_account')}</Text>
                        </TouchableOpacity>
                    </AnimatedCard>
                </ScrollView>
            </KeyboardAvoidingView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    card: {
        alignItems: 'center',
        maxWidth: 480,
        width: '100%',
        alignSelf: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1B5E20',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 32,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 18,
        fontSize: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        color: '#333',
    },
    button: {
        backgroundColor: '#2E7D32',
        width: '100%',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkText: {
        color: '#666',
        fontSize: 15,
    },
    linkHighlight: {
        color: '#2E7D32',
        fontWeight: 'bold',
    }
});

