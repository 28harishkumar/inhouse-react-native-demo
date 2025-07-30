import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Game1InstructionsScreen: React.FC = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game 1 Instructions</Text>
      <Text style={styles.text}>1. Tap "Start Game" to begin.</Text>
      <Text style={styles.text}>2. Tap "Add Score" to earn points.</Text>
      <Text style={styles.text}>3. Try to get the highest score possible.</Text>
      <Text style={styles.text}>4. Tap "End Game" when finished.</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home' as never)}
      >
        <Text style={styles.buttonText}>Go Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#6200ee',
  },
  text: { fontSize: 16, color: '#333', marginBottom: 12, textAlign: 'center' },
  button: {
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default Game1InstructionsScreen;
