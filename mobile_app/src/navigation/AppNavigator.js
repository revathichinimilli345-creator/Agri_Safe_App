import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import InputScreen from '../screens/InputScreen';
import ResultScreen from '../screens/ResultScreen';
import GraphScreen from '../screens/GraphScreen';
import HistoryScreen from '../screens/HistoryScreen';
import GuidanceScreen from '../screens/GuidanceScreen';
import CropRecommendationScreen from '../screens/CropRecommendationScreen';
import SeedInfoScreen from '../screens/SeedInfoScreen';
import SowingScreen from '../screens/SowingScreen';
import FertilizerScreen from '../screens/FertilizerScreen';
import IrrigationScreen from '../screens/IrrigationScreen';
import AdminLoginScreen from '../screens/AdminLoginScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminUserManagementScreen from '../screens/AdminUserManagementScreen';
import AdminAllHistoryScreen from '../screens/AdminAllHistoryScreen';
import AdminAnalysisScreen from '../screens/AdminAnalysisScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator({ navigation }) {
    const handleLogout = async () => {
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('refresh_token');
        navigation.replace('Login');
    };

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Analysis') iconName = focused ? 'analytics' : 'analytics-outline';
                    else if (route.name === 'History') iconName = focused ? 'time' : 'time-outline';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#2E7D32',
                tabBarInactiveTintColor: 'gray',
                headerShown: true,
                headerStyle: { backgroundColor: '#2E7D32' },
                headerTintColor: '#fff',
                headerRight: () => (
                    <TouchableOpacity onPress={handleLogout} style={navStyles.logoutBtn}>
                        <Text style={navStyles.logoutBtnText}>Logout</Text>
                    </TouchableOpacity>
                ),
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'AgriSafe Home' }} />
            <Tab.Screen name="Analysis" component={InputScreen} options={{ title: 'Land Analysis' }} />
            <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'History' }} />
        </Tab.Navigator>
    );
}

const navStyles = {
    logoutBtn: {
        marginRight: 15,
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    logoutBtnText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.3,
    }
};

export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="Guidance" component={GuidanceScreen} options={{ headerShown: true, title: 'Full Guidance', headerStyle: { backgroundColor: '#2E7D32' }, headerTintColor: '#fff' }} />
            <Stack.Screen name="Result" component={ResultScreen} options={{ headerShown: true, title: 'Prediction Result', headerStyle: { backgroundColor: '#2E7D32' }, headerTintColor: '#fff' }} />
            <Stack.Screen name="Graphs" component={GraphScreen} options={{ headerShown: true, title: 'Data Graphs', headerStyle: { backgroundColor: '#2E7D32' }, headerTintColor: '#fff' }} />
            <Stack.Screen name="CropRecommendation" component={CropRecommendationScreen} options={{ headerShown: true, title: 'Cultivation Advice', headerStyle: { backgroundColor: '#2E7D32' }, headerTintColor: '#fff' }} />
            <Stack.Screen name="SeedInfo" component={SeedInfoScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Sowing" component={SowingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Fertilizer" component={FertilizerScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Irrigation" component={IrrigationScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AdminLogin" component={AdminLoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AdminUserManagement" component={AdminUserManagementScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AdminAllHistory" component={AdminAllHistoryScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AdminAnalysis" component={AdminAnalysisScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}
