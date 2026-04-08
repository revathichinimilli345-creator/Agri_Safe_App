import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert, ScrollView, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { getAdminUsers, updateAdminUser, deleteUser } from '../api/client';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export default function AdminUserManagementScreen({ navigation }) {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    // Edit Modal States
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');

    const fetchUsers = async () => {
        try {
            const data = await getAdminUsers();
            setUsers(data);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to fetch users");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchUsers();
    };

    const handleToggleStatus = async (user) => {
        const newStatus = !user.is_active;
        try {
            await updateAdminUser(user.id, { is_active: newStatus });
            Alert.alert("Success", `User ${user.username} ${newStatus ? 'activated' : 'deactivated'} successfully.`);
            fetchUsers();
        } catch (error) {
            Alert.alert("Error", "Failed to update user status");
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setNewUsername(user.username);
        setNewEmail(user.email || '');
        setIsEditModalVisible(true);
    };

    const handleSaveEdit = async () => {
        if (!newUsername.trim()) {
            Alert.alert("Error", "Username cannot be empty");
            return;
        }
        try {
            await updateAdminUser(editingUser.id, { 
                username: newUsername, 
                email: newEmail 
            });
            Alert.alert("Success", "User details updated successfully");
            setIsEditModalVisible(false);
            fetchUsers();
        } catch (error) {
            Alert.alert("Error", "Failed to update user. Username might be taken.");
        }
    };

    const handleDeleteUser = (user) => {
        Alert.alert(
            "Delete User",
            `Are you sure you want to PERMANENTLY delete ${user.username}? This action cannot be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteUser(user.id);
                            fetchUsers();
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete user");
                        }
                    } 
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.tableRow}>
            <View style={[styles.cell, { width: 220 }]}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.email}>{item.email || 'No email'}</Text>
            </View>
            <View style={[styles.cell, { width: 100 }]}>
                <Text style={styles.tableText}>{new Date(item.date_joined).toLocaleDateString()}</Text>
            </View>
            <View style={[styles.cell, { width: 130, alignItems: 'center' }]}>
                <Text style={[styles.tableText, { fontWeight: 'bold' }]}>{item.prediction_count || 0}</Text>
            </View>
            <View style={[styles.cell, styles.actionsCell, { width: 220 }]}>
                <TouchableOpacity 
                    style={[styles.actionBtn, { backgroundColor: item.is_active ? '#2ecc7115' : '#bdc3c733' }]} 
                    onPress={() => handleToggleStatus(item)}
                >
                    <Ionicons 
                        name={item.is_active ? "checkmark-circle" : "checkmark-outline"} 
                        size={20} 
                        color={item.is_active ? "#2ecc71" : "#7f8c8d"} 
                    />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.actionBtn, { backgroundColor: '#3498db15' }]}
                    onPress={() => navigation.navigate('AdminAllHistory', { userId: item.id, username: item.username })}
                >
                    <Ionicons name="eye-outline" size={20} color="#3498db" />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.actionBtn, { backgroundColor: '#f39c1215' }]}
                    onPress={() => handleEditUser(item)}
                >
                    <Ionicons name="create-outline" size={20} color="#f39c12" />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.actionBtn, { backgroundColor: '#e74c3c15' }]} 
                    onPress={() => handleDeleteUser(item)}
                >
                    <Ionicons name="trash-outline" size={20} color="#e74c3c" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.title}>User Management</Text>
                        <Text style={styles.subtitle}>Control access and permissions</Text>
                    </View>
                </View>

                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    </View>
                ) : (
                    <View style={styles.tableContainer}>
                        {/* Legend */}
                        <View style={styles.legendContainer}>
                            <Text style={styles.legendTitle}>Icon Meanings:</Text>
                            <View style={styles.legendItems}>
                                <View style={styles.legendItem}><Ionicons name="checkmark-circle" size={14} color="#2ecc71" /><Text style={styles.legendText}>Approve</Text></View>
                                <View style={styles.legendItem}><Ionicons name="eye-outline" size={14} color="#3498db" /><Text style={styles.legendText}>View</Text></View>
                                <View style={styles.legendItem}><Ionicons name="create-outline" size={14} color="#f39c12" /><Text style={styles.legendText}>Edit</Text></View>
                                <View style={styles.legendItem}><Ionicons name="trash-outline" size={14} color="#e74c3c" /><Text style={styles.legendText}>Delete</Text></View>
                            </View>
                        </View>
                        
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
                            <View>
                                {/* Table Header */}
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.headerText, { width: 220 }]}>User</Text>
                                    <Text style={[styles.headerText, { width: 100 }]}>Joined</Text>
                                    <Text style={[styles.headerText, { width: 130, textAlign: 'center' }]}>Predictions</Text>
                                    <Text style={[styles.headerText, { width: 220, textAlign: 'center' }]}>Actions</Text>
                                </View>
                                
                                <FlatList
                                    data={users}
                                    renderItem={renderItem}
                                    keyExtractor={item => item.id.toString()}
                                    contentContainerStyle={styles.list}
                                    refreshControl={
                                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                                    }
                                    ListEmptyComponent={
                                        <View style={styles.emptyContainer}>
                                            <Ionicons name="people-outline" size={60} color={theme.colors.textSecondary} style={{ opacity: 0.3 }} />
                                            <Text style={styles.emptyText}>No users registered yet.</Text>
                                        </View>
                                    }
                                />
                            </View>
                        </ScrollView>
                    </View>
                )}
            </View>

            {/* Edit User Modal */}
            <Modal visible={isEditModalVisible} transparent={true} animationType="fade">
                <View style={styles.modalOverlay}>
                    <AnimatedCard style={styles.editModal}>
                        <Text style={styles.modalTitle}>Edit User Profile</Text>
                        
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Username</Text>
                            <TextInput 
                                style={styles.input} 
                                value={newUsername}
                                onChangeText={setNewUsername}
                                placeholder="Enter username"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Email Address</Text>
                            <TextInput 
                                style={styles.input} 
                                value={newEmail}
                                onChangeText={setNewEmail}
                                placeholder="Enter email"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity 
                                style={[styles.modalBtn, styles.cancelBtn]} 
                                onPress={() => setIsEditModalVisible(false)}
                            >
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modalBtn, styles.saveBtn]} 
                                onPress={handleSaveEdit}
                            >
                                <Text style={styles.saveBtnText}>Save Changes</Text>
                            </TouchableOpacity>
                        </View>
                    </AnimatedCard>
                </View>
            </Modal>

            {/* Bottom Navigation Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity 
                    style={styles.bottomBarItem}
                    onPress={() => navigation.navigate('AdminDashboard')}
                >
                    <Ionicons name="home-outline" size={24} color={theme.colors.textSecondary} />
                    <Text style={styles.bottomBarText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomBarItem}>
                    <View style={[styles.bottomBarIconActive]}>
                        <Ionicons name="people" size={24} color={theme.colors.primary} />
                    </View>
                    <Text style={[styles.bottomBarText, { color: theme.colors.primary, fontWeight: 'bold' }]}>Users</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.bottomBarItem}
                    onPress={() => navigation.navigate('AdminAnalysis')}
                >
                    <Ionicons name="analytics-outline" size={24} color={theme.colors.textSecondary} />
                    <Text style={styles.bottomBarText}>Analysis</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.bottomBarItem}
                    onPress={async () => {
                        await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'username', 'is_admin']);
                        navigation.replace('Login');
                    }}
                >
                    <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
                    <Text style={[styles.bottomBarText, {color: '#e74c3c'}]}>Logout</Text>
                </TouchableOpacity>
            </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
    },
    backButton: {
        marginRight: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    list: {
        paddingBottom: 40,
    },
    tableContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginHorizontal: 0,
        padding: 0,
        overflow: 'hidden',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        ...theme.shadows.medium,
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
        ...theme.shadows.medium,
    },
    bottomBarItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    bottomBarIconActive: {
        padding: 8,
        backgroundColor: theme.colors.primary + '15',
        borderRadius: 20,
    },
    bottomBarText: {
        fontSize: 10,
        color: theme.colors.textSecondary,
        marginTop: 4,
    },
    legendContainer: {
        padding: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    legendTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 8,
    },
    legendItems: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    legendText: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f8f9fa',
        paddingVertical: 12,
        paddingHorizontal: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        minWidth: 670,
    },
    headerText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        minWidth: 670,
    },
    cell: {
        justifyContent: 'center',
    },
    actionsCell: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    tableText: {
        fontSize: 13,
        color: theme.colors.text,
    },
    username: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    email: {
        fontSize: 11,
        color: theme.colors.textSecondary,
    },
    actionBtn: {
        padding: 6,
        borderRadius: 8,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    editModal: {
        width: '100%',
        maxWidth: 400,
        padding: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 20,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.textSecondary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: theme.colors.text,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    modalBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelBtn: {
        backgroundColor: '#f1f2f6',
    },
    saveBtn: {
        backgroundColor: theme.colors.primary,
    },
    cancelBtnText: {
        color: theme.colors.textSecondary,
        fontWeight: 'bold',
    },
    saveBtnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
