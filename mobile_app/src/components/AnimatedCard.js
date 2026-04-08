import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { theme } from '../theme';

export default function AnimatedCard({ children, delay = 0, style }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(30)).current;
    const scale = useRef(new Animated.Value(0.92)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                delay: delay,
                useNativeDriver: true,
            }),
            Animated.spring(translateY, {
                toValue: 0,
                friction: 8,
                tension: 30,
                delay: delay,
                useNativeDriver: true,
            }),
            Animated.spring(scale, {
                toValue: 1,
                friction: 10,
                tension: 40,
                delay: delay,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, translateY, scale, delay]);

    return (
        <Animated.View style={[
            styles.card,
            style,
            {
                opacity: fadeAnim,
                transform: [{ translateY }, { scale }],
                backgroundColor: style?.backgroundColor || theme.colors.card
            }
        ]}>
            {children}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        width: '100%',
        ...theme.shadows.medium,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    }
});


