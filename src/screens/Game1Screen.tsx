import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TrackingSDK from '../TrackingSDK';

const Game1Screen: React.FC = () => {
  const navigation = useNavigation();
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = async () => {
    try {
      await TrackingSDK.trackShortLinkClick(
        'game1-start-link',
        'game1://start',
      );
      setGameStarted(true);
      Alert.alert('Game Started', 'Game 1 has started! Tap to score points.');
    } catch (error) {
      Alert.alert('Error', 'Failed to start game');
    }
  };

  const addScore = async () => {
    const newScore = score + 10;
    setScore(newScore);

    try {
      await TrackingSDK.trackShortLinkClick(
        'game1-score-link',
        `game1://score/${newScore}`,
      );
    } catch (error) {
      console.error('Failed to track score:', error);
    }
  };

  const endGame = async () => {
    try {
      await TrackingSDK.trackShortLinkClick(
        'game1-end-link',
        `game1://end/${score}`,
      );
      navigation.navigate('Game1Results' as never, { score } as never);
    } catch (error) {
      Alert.alert('Error', 'Failed to end game');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Game 1</Text>
        <Text style={styles.subtitle}>Memory Challenge</Text>
      </View>

      <View style={styles.gameSection}>
        <Text style={styles.sectionTitle}>Game Status</Text>
        <Text style={styles.score}>Score: {score}</Text>
        <Text style={styles.status}>
          Status: {gameStarted ? 'Playing' : 'Not Started'}
        </Text>
      </View>

      <View style={styles.controlsSection}>
        <Text style={styles.sectionTitle}>Controls</Text>

        {!gameStarted ? (
          <TouchableOpacity style={styles.button} onPress={startGame}>
            <Text style={styles.buttonText}>Start Game</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={addScore}>
              <Text style={styles.buttonText}>Add Score (+10)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.endButton]}
              onPress={endGame}
            >
              <Text style={styles.buttonText}>End Game</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.instructionsSection}>
        <Text style={styles.sectionTitle}>How to Play</Text>
        <Text style={styles.instruction}>1. Tap "Start Game" to begin</Text>
        <Text style={styles.instruction}>
          2. Tap "Add Score" to earn points
        </Text>
        <Text style={styles.instruction}>
          3. Try to get the highest score possible
        </Text>
        <Text style={styles.instruction}>4. Tap "End Game" when finished</Text>
      </View>

      <View style={styles.trackingSection}>
        <Text style={styles.sectionTitle}>Tracking Events</Text>
        <Text style={styles.trackingInfo}>This game tracks:</Text>
        <Text style={styles.trackingItem}>• Game start events</Text>
        <Text style={styles.trackingItem}>• Score updates</Text>
        <Text style={styles.trackingItem}>• Game end events</Text>
        <Text style={styles.trackingItem}>• Deep link navigation</Text>
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
  gameSection: {
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  controlsSection: {
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
  endButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructionsSection: {
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
  instruction: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    paddingLeft: 10,
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
  trackingInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  trackingItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    paddingLeft: 10,
  },
});

export default Game1Screen;
