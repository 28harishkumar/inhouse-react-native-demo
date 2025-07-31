import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TrackingSDK from 'react-native-inhouse-sdk';

const InstallReferrerScreen: React.FC = () => {
  const navigation = useNavigation();
  const [referrer, setReferrer] = useState<string>('');

  const fetchReferrer = async () => {
    try {
      if (!TrackingSDK) {
        Alert.alert('Error', 'TrackingSDK is not available');
        return;
      }
      const result = await TrackingSDK.getInstallReferrer();
      setReferrer(result);
      Alert.alert('Install Referrer', result);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch install referrer');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Install Referrer</Text>
      <Text style={styles.text}>Referrer: {referrer || 'Not fetched yet'}</Text>
      <TouchableOpacity style={styles.button} onPress={fetchReferrer}>
        <Text style={styles.buttonText}>Fetch Referrer</Text>
      </TouchableOpacity>
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

export default InstallReferrerScreen;
