import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import TrackingSDK from 'react-native-inhouse-sdk';

type Game1ResultsScreenRouteProp = RouteProp<
  RootStackParamList,
  'Game1Results'
>;

const Game1ResultsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<Game1ResultsScreenRouteProp>();
  const score = route.params?.score || 0;

  const playAgain = async () => {
    try {
      if (!TrackingSDK) { console.error('TrackingSDK is not available'); return; }
      await TrackingSDK.trackShortLinkClick(
        'game1-play-again-link',
        'game1://play-again',
      );
      navigation.navigate('Game1' as never);
    } catch (error) {
      console.error('Failed to track play again:', error);
    }
  };

  const goHome = async () => {
    try {
      if (!TrackingSDK) { console.error('TrackingSDK is not available'); return; }
      await TrackingSDK.trackShortLinkClick('game1-home-link', 'game1://home');
      navigation.navigate('Home' as never);
    } catch (error) {
      console.error('Failed to track home navigation:', error);
    }
  };

  const getScoreMessage = () => {
    if (score >= 100) return 'Excellent! You are a master!';
    if (score >= 50) return 'Great job! Well played!';
    if (score >= 20) return 'Good effort! Keep practicing!';
    return 'Keep trying! You can do better!';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Game 1 Results</Text>
        <Text style={styles.subtitle}>Memory Challenge Complete</Text>
      </View>

      <View style={styles.resultsSection}>
        <Text style={styles.sectionTitle}>Your Results</Text>
        <Text style={styles.score}>Final Score: {score}</Text>
        <Text style={styles.message}>{getScoreMessage()}</Text>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <Text style={styles.stat}>Games Played: 1</Text>
        <Text style={styles.stat}>Best Score: {score}</Text>
        <Text style={styles.stat}>Average Score: {score}</Text>
      </View>

      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <TouchableOpacity style={styles.button} onPress={playAgain}>
          <Text style={styles.buttonText}>Play Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.homeButton]}
          onPress={goHome}
        >
          <Text style={styles.buttonText}>Go Home</Text>
        </TouchableOpacity>
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
    backgroundColor: '#4CAF50',
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
  },
  resultsSection: {
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
  score: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statsSection: {
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
  stat: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  actionsSection: {
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
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  homeButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Game1ResultsScreen;
