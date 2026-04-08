import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import AnimatedCard from './AnimatedCard';

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'ml', label: 'മലയാളം (Malayalam)' },
];

export default function LanguageSelector() {
    const { i18n, t } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);

    const currentLanguage = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

    const selectLanguage = (code) => {
        i18n.changeLanguage(code);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.selectorButton}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
            >
                <View style={styles.leftIcon}>
                    <Ionicons name="language" size={20} color="#2E7D32" />
                </View>
                <Text style={styles.selectorText}>{currentLanguage.label}</Text>
                <Ionicons name="chevron-down" size={20} color="#999" />
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Language</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={LANGUAGES}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.langItem,
                                        i18n.language === item.code && styles.activeLangItem
                                    ]}
                                    onPress={() => selectLanguage(item.code)}
                                >
                                    <Text style={[
                                        styles.langLabel,
                                        i18n.language === item.code && styles.activeLangLabel
                                    ]}>
                                        {item.label}
                                    </Text>
                                    {i18n.language === item.code && (
                                        <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
                                    )}
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 16,
    },
    selectorButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    leftIcon: {
        marginRight: 12,
        backgroundColor: '#E8F5E9',
        padding: 6,
        borderRadius: 8,
    },
    selectorText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: '60%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    langItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    activeLangItem: {
        backgroundColor: '#F1F8E9',
        borderRadius: 10,
    },
    langLabel: {
        fontSize: 16,
        color: '#444',
    },
    activeLangLabel: {
        color: '#2E7D32',
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        backgroundColor: '#F5F5F5',
    }
});
