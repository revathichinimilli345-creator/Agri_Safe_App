import React, { useEffect, useRef, useMemo } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const PARTICLE_COUNT = 15;
const ICONS = ['leaf', 'sunny', 'flower', 'water', 'planet', 'cloud', 'rose', 'bonfire'];
const COLORS = ['#2E7D32', '#1B5E20', '#FBC02D', '#D32F2F', '#1976D2', '#7B1FA2'];

const FloatingParticle = ({ index }) => {
    const animX = useRef(new Animated.Value(Math.random() * width)).current;
    const animY = useRef(new Animated.Value(Math.random() * height)).current;
    const animRotate = useRef(new Animated.Value(0)).current;
    const animScale = useRef(new Animated.Value(1)).current;
    const animOpacity = useRef(new Animated.Value(0.15 + Math.random() * 0.15)).current;

    const icon = useMemo(() => ICONS[index % ICONS.length], [index]);
    const color = useMemo(() => COLORS[index % COLORS.length], [index]);
    const size = useMemo(() => 15 + Math.random() * 30, []);
    const duration = useMemo(() => 12000 + Math.random() * 15000, []);

    useEffect(() => {
        const move = (axis, max) => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(axis, {
                        toValue: Math.random() * max,
                        duration: duration,
                        useNativeDriver: true,
                    }),
                    Animated.timing(axis, {
                        toValue: Math.random() * max,
                        duration: duration,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        const rotate = () => {
            Animated.loop(
                Animated.timing(animRotate, {
                    toValue: 1,
                    duration: 8000 + Math.random() * 12000,
                    useNativeDriver: true,
                })
            ).start();
        };

        const pulse = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animScale, {
                        toValue: 1.2,
                        duration: 3000 + Math.random() * 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animScale, {
                        toValue: 0.8,
                        duration: 3000 + Math.random() * 2000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        move(animX, width);
        move(animY, height);
        rotate();
        pulse();
    }, []);

    const rotation = animRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.View
            style={[
                styles.particle,
                {
                    opacity: animOpacity,
                    transform: [
                        { translateX: animX },
                        { translateY: animY },
                        { rotate: rotation },
                        { scale: animScale }
                    ],
                },
            ]}
        >
            <Ionicons name={icon} size={size} color={color} />
        </Animated.View>
    );
};

export default function GradientBackground({ children, colors = ['#E8F5E9', '#C8E6C9', '#F1F8E9', '#FFF9C4'] }) {
    const anim1 = useRef(new Animated.Value(0)).current;
    const anim2 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const createAnim = (val, duration) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.timing(val, {
                        toValue: 1,
                        duration: duration,
                        useNativeDriver: true,
                    }),
                    Animated.timing(val, {
                        toValue: 0,
                        duration: duration,
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        createAnim(anim1, 12000).start();
        createAnim(anim2, 18000).start();
    }, []);

    const trans1 = anim1.interpolate({
        inputRange: [0, 1],
        outputRange: [-30, 30],
    });

    const trans2 = anim2.interpolate({
        inputRange: [0, 1],
        outputRange: [30, -30],
    });

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={colors}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            {/* Rich animated blobs - Deeper colors for contrast */}
            <Animated.View style={[
                styles.blob,
                {
                    backgroundColor: 'rgba(56, 142, 60, 0.08)',
                    width: 400,
                    height: 400,
                    top: -100,
                    left: -100,
                    transform: [{ translateX: trans1 }, { translateY: trans2 }]
                }
            ]} />
            <Animated.View style={[
                styles.blob,
                {
                    backgroundColor: 'rgba(251, 192, 45, 0.06)',
                    width: 500,
                    height: 500,
                    bottom: -150,
                    right: -150,
                    transform: [{ translateX: trans2 }, { translateY: trans1 }]
                }
            ]} />
            <Animated.View style={[
                styles.blob,
                {
                    backgroundColor: 'rgba(21, 101, 192, 0.05)',
                    width: 450,
                    height: 450,
                    top: height / 2 - 200,
                    right: -150,
                    transform: [{ translateX: trans1 }, { translateY: trans1 }]
                }
            ]} />

            {/* Floating Particles */}
            {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
                <FloatingParticle key={i} index={i} />
            ))}

            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    blob: {
        position: 'absolute',
        borderRadius: 200,
    },
    particle: {
        position: 'absolute',
    }
});
