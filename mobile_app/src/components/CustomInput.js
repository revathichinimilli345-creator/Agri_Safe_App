import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Animated } from 'react-native';
import { theme } from '../theme';

export default function CustomInput({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    keyboardType,
    autoCapitalize = 'none',
    error,
    style
}) {
    const [isFocused, setIsFocused] = useState(false);
    const borderColor = isFocused ? theme.colors.primary : (error ? theme.colors.error : theme.colors.border);

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={[styles.label, isFocused && { color: theme.colors.primary }]}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    { borderColor },
                    isFocused && styles.focusedInput
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: theme.spacing.md,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
        marginLeft: 4,
    },
    input: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1.5,
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        fontSize: 16,
        color: theme.colors.text,
        ...theme.shadows.light,
    },
    focusedInput: {
        backgroundColor: '#fff',
        ...theme.shadows.medium,
    },
    errorText: {
        color: theme.colors.error,
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    }
});
