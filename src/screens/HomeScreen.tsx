import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TrackingSDK from '../TrackingSDK';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleTrackAppOpen = async () => {
    try {
      await TrackingSDK.trackAppOpen('home-screen-link');
      Alert.alert('Success', 'App open tracked successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to track app open');
    }
  };

  const handleTrackSessionStart = async () => {
    try {
      await TrackingSDK.trackSessionStart('home-session-link');
      Alert.alert('Success', 'Session start tracked successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to track session start');
    }
  };

  const screens = [
    { name: 'Game 1', route: 'Game1', description: 'Play the first game' },
    { name: 'Game 2', route: 'Game2', description: 'Play the second game' },
    {
      name: 'Game 1 Results',
      route: 'Game1Results',
      description: 'View Game 1 results',
    },
    {
      name: 'Game 2 Results',
      route: 'Game2Results',
      description: 'View Game 2 results',
    },
    { name: 'About', route: 'About', description: 'Learn about the app' },
    { name: 'Contact', route: 'Contact', description: 'Contact information' },
    {
      name: 'Game 1 Instructions',
      route: 'Game1Instructions',
      description: 'How to play Game 1',
    },
    {
      name: 'Game 2 Instructions',
      route: 'Game2Instructions',
      description: 'How to play Game 2',
    },
    {
      name: 'Install Referrer',
      route: 'InstallReferrer',
      description: 'View install referrer data',
    },
    {
      name: 'Referrer API',
      route: 'ReferrerApi',
      description: 'Test referrer API',
    },
    {
      name: 'Referrer Link Data',
      route: 'ReferrerLinkData',
      description: 'View referrer link data',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Demo App</Text>
        <Text style={styles.subtitle}>
          A comprehensive demo with deep linking and tracking
        </Text>
      </View>

      <View style={styles.trackingSection}>
        <Text style={styles.sectionTitle}>Tracking SDK</Text>
        <TouchableOpacity style={styles.button} onPress={handleTrackAppOpen}>
          <Text style={styles.buttonText}>Track App Open</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleTrackSessionStart}
        >
          <Text style={styles.buttonText}>Track Session Start</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navigationSection}>
        <Text style={styles.sectionTitle}>Navigation</Text>
        {screens.map((screen, index) => (
          <TouchableOpacity
            key={index}
            style={styles.navButton}
            onPress={() => navigation.navigate(screen.route as never)}
          >
            <Text style={styles.navButtonTitle}>{screen.name}</Text>
            <Text style={styles.navButtonDescription}>
              {screen.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#6200ee',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  trackingSection: {
    padding: 20,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navigationSection: {
    padding: 20,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navButton: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#6200ee',
  },
  navButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  navButtonDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;
