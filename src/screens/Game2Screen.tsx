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

const Game2Screen: React.FC = () => {
  const navigation = useNavigation();
  const [level, setLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = async () => {
    try {
      await TrackingSDK.trackShortLinkClick(
        'game2-start-link',
        'game2://start',
      );
      setGameStarted(true);
      Alert.alert(
        'Game Started',
        'Game 2 has started! Complete levels to progress.',
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to start game');
    }
  };

  const nextLevel = async () => {
    const newLevel = level + 1;
    setLevel(newLevel);

    try {
      await TrackingSDK.trackShortLinkClick(
        'game2-level-link',
        `game2://level/${newLevel}`,
      );
    } catch (error) {
      console.error('Failed to track level:', error);
    }
  };

  const completeGame = async () => {
    try {
      await TrackingSDK.trackShortLinkClick(
        'game2-complete-link',
        `game2://complete/${level}`,
      );
      navigation.navigate('Game2Results' as never, { level } as never);
    } catch (error) {
      Alert.alert('Error', 'Failed to complete game');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Game 2</Text>
        <Text style={styles.subtitle}>Level Challenge</Text>
      </View>

      <View style={styles.gameSection}>
        <Text style={styles.sectionTitle}>Game Status</Text>
        <Text style={styles.level}>Level: {level}</Text>
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
            <TouchableOpacity style={styles.button} onPress={nextLevel}>
              <Text style={styles.buttonText}>Next Level</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.completeButton]}
              onPress={completeGame}
            >
              <Text style={styles.buttonText}>Complete Game</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.instructionsSection}>
        <Text style={styles.sectionTitle}>How to Play</Text>
        <Text style={styles.instruction}>1. Tap "Start Game" to begin</Text>
        <Text style={styles.instruction}>2. Tap "Next Level" to progress</Text>
        <Text style={styles.instruction}>
          3. Try to reach the highest level
        </Text>
        <Text style={styles.instruction}>
          4. Tap "Complete Game" when finished
        </Text>
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
    backgroundColor: '#2196F3',
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
  level: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
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
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#FF9800',
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
});

export default Game2Screen;
