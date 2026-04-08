import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';
import { theme } from '../theme';

export default function GuidanceScreen({ navigation }) {
    return (
        <GradientBackground>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Full Agricultural Guide</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    <AnimatedCard style={styles.guideCard} delay={100}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="calendar" size={24} color={theme.colors.primary} />
                            <Text style={styles.sectionTitle}>Seasonal Preparation</Text>
                        </View>
                        <Text style={styles.content}>
                            Successful farming begins with meticulous seasonal preparation. As we transition from spring to summer, farmers should focus on soil health and water management strategies.
                        </Text>
                    </AnimatedCard>

                    <AnimatedCard style={styles.guideCard} delay={200}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="water" size={24} color="#2196F3" />
                            <Text style={styles.sectionTitle}>Irrigation Best Practices</Text>
                        </View>
                        <Text style={styles.content}>
                            • Check irrigation systems for leaks or blockages.{"\n"}
                            • Utilize drip irrigation to maximize water efficiency.{"\n"}
                            • Water during early morning or late evening to minimize evaporation.{"\n"}
                            • Monitor soil moisture levels regularly.
                        </Text>
                    </AnimatedCard>

                    <AnimatedCard style={styles.guideCard} delay={300}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="leaf" size={24} color="#4CAF50" />
                            <Text style={styles.sectionTitle}>Soil Health & Fertilization</Text>
                        </View>
                        <Text style={styles.content}>
                            Apply organic mulching to retain moisture and suppress weeds. Conduct a soil test to determine precise nutrient requirements for your specific crops and apply fertilizers accordingly.
                        </Text>
                    </AnimatedCard>

                    <AnimatedCard style={styles.guideCard} delay={400}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="bug" size={24} color="#F44336" />
                            <Text style={styles.sectionTitle}>Integrated Pest Management</Text>
                        </View>
                        <Text style={styles.content}>
                            Monitor your crops daily for signs of pest infestations. Use biological controls and organic pesticides whenever possible to maintain ecological balance.
                        </Text>
                    </AnimatedCard>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        backgroundColor: 'rgba(252, 251, 244, 0.8)',
    },
    backBtn: {
        padding: 8,
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    scrollContainer: {
        padding: theme.spacing.lg,
    },
    guideCard: {
        marginBottom: theme.spacing.md,
        padding: theme.spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    content: {
        fontSize: 15,
        color: theme.colors.text,
        lineHeight: 24,
    }
});
