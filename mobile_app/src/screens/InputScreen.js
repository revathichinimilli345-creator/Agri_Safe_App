import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { predictSuitability } from '../api/client';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { Ionicons } from '@expo/vector-icons';
import LanguageSelector from '../components/LanguageSelector';
import { theme } from '../theme';

const INDIAN_STATES = [
    'Telangana', 'Andhra Pradesh', 'Punjab', 'Haryana',
    'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Maharashtra',
    'Gujarat', 'Rajasthan', 'Kerala', 'West Bengal'
];

const SOIL_TYPES = ['Alluvial', 'Black', 'Red', 'Laterite', 'Desert', 'Clayey', 'Loamy'];

export default function InputScreen({ navigation }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        country: 'India',
        state: 'Telangana',
        temperature: '',
        humidity: '',
        rainfall: '',
        nitrogen: '',
        phosphorus: '',
        potassium: '',
        ph: '',
        soil_type: 'Alluvial'
    });

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        for (let key in formData) {
            if (formData[key] === '') {
                Alert.alert("Error", `Please fill all fields: ${key}`);
                return;
            }
        }

        setLoading(true);
        try {
            const payload = {
                ...formData,
                temperature: parseFloat(formData.temperature),
                humidity: parseFloat(formData.humidity),
                rainfall: parseFloat(formData.rainfall),
                nitrogen: parseFloat(formData.nitrogen),
                phosphorus: parseFloat(formData.phosphorus),
                potassium: parseFloat(formData.potassium),
                ph: parseFloat(formData.ph),
            };

            const result = await predictSuitability(payload);
            navigation.navigate('Result', { result });
        } catch (error) {
            Alert.alert("Error", "Failed to connect to the prediction server.");
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (label, key, placeholder, icon, keyboardType = 'default', delay = 0) => (
        <AnimatedCard delay={delay} style={styles.inputCard}>
            <View style={styles.inputWrapper}>
                <View style={styles.inputIconBox}>
                    <Ionicons name={icon} size={20} color={theme.colors.primary} />
                </View>
                <CustomInput
                    label={label}
                    placeholder={placeholder}
                    value={formData[key]}
                    onChangeText={(v) => handleChange(key, v)}
                    keyboardType={keyboardType}
                    style={{ marginBottom: 0, flex: 1 }}
                />
            </View>
        </AnimatedCard>
    );

    const renderPicker = (label, key, items, icon, delay = 0) => (
        <AnimatedCard delay={delay} style={styles.inputCard}>
            <View style={styles.inputWrapper}>
                <View style={styles.inputIconBox}>
                    <Ionicons name={icon} size={20} color={theme.colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.pickerLabel}>{label}</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={formData[key]}
                            onValueChange={(itemValue) => handleChange(key, itemValue)}
                            style={styles.picker}
                        >
                            {items.map((item) => (
                                <Picker.Item key={item} label={item} value={item} />
                            ))}
                        </Picker>
                    </View>
                </View>
            </View>
        </AnimatedCard>
    );

    return (
        <GradientBackground>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.langWrapper}>
                        <LanguageSelector />
                    </View>

                    <View style={styles.headerSection}>
                        <Text style={styles.mainTitle}>{t('input_title')}</Text>
                        <Text style={styles.mainSubtitle}>{t('input_subtitle')}</Text>
                    </View>

                    {renderInput(t('country'), 'country', 'e.g. India', 'globe-outline', 'default', 100)}
                    {renderPicker(t('state'), 'state', INDIAN_STATES, 'map-outline', 200)}

                    <View style={styles.divider}>
                        <Text style={styles.dividerText}>Climate Data</Text>
                    </View>

                    {renderInput(t('temperature') + ' (°C)', 'temperature', 'e.g. 28.5', 'thermometer-outline', 'numeric', 300)}
                    {renderInput(t('humidity') + ' (%)', 'humidity', 'e.g. 65', 'water-outline', 'numeric', 350)}
                    {renderInput(t('rainfall') + ' (mm)', 'rainfall', 'e.g. 800', 'rainy-outline', 'numeric', 400)}

                    <View style={styles.divider}>
                        <Text style={styles.dividerText}>Soil Nutrients</Text>
                    </View>

                    {renderInput(t('nitrogen') + ' (N)', 'nitrogen', 'Enter N value', 'flask-outline', 'numeric', 500)}
                    {renderInput(t('phosphorus') + ' (P)', 'phosphorus', 'Enter P value', 'beaker-outline', 'numeric', 600)}
                    {renderInput(t('potassium') + ' (K)', 'potassium', 'Enter K value', 'leaf-outline', 'numeric', 700)}

                    <View style={styles.divider}>
                        <Text style={styles.dividerText}>Other Properties</Text>
                    </View>

                    {renderInput(t('ph'), 'ph', 'e.g. 6.8', 'color-filter-outline', 'numeric', 800)}
                    {renderPicker(t('soil_type'), 'soil_type', SOIL_TYPES, 'earth-outline', 900)}

                    <AnimatedCard delay={1000} style={styles.btnCard}>
                        <CustomButton
                            title={t('predict')}
                            onPress={handleSubmit}
                            loading={loading}
                            style={styles.predictButton}
                        />
                    </AnimatedCard>

                    <View style={{ height: 60 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: theme.spacing.lg,
    },
    langWrapper: {
        marginBottom: theme.spacing.lg,
        alignItems: 'center',
    },
    headerSection: {
        marginBottom: theme.spacing.xl,
        alignItems: 'center',
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.primary,
        textAlign: 'center',
    },
    mainSubtitle: {
        fontSize: 15,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: 4,
        paddingHorizontal: 20,
    },
    inputCard: {
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 12,
    },
    inputIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: theme.colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    pickerLabel: {
        fontSize: 12,
        color: theme.colors.primary,
        fontWeight: '700',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    pickerWrapper: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        justifyContent: 'center',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: theme.spacing.md,
        paddingHorizontal: 10,
    },
    dividerText: {
        fontSize: 13,
        fontWeight: '800',
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    btnCard: {
        marginTop: theme.spacing.md,
        backgroundColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
        padding: 0,
    },
    predictButton: {
        backgroundColor: theme.colors.primary,
    }
});



