import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ReferrerLinkDataScreen: React.FC = () => {
  const navigation = useNavigation();
  // Demo data
  const referrerLinkData = {
    link: 'https://focks.tryinhouse.co/abc123',
    deeplink_path: '/game1',
    campaign: 'summer2024',
    source: 'adwords',
    medium: 'cpc',
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Referrer Link Data</Text>
      <Text style={styles.text}>Link: {referrerLinkData.link}</Text>
      <Text style={styles.text}>
        Deeplink Path: {referrerLinkData.deeplink_path}
      </Text>
      <Text style={styles.text}>Campaign: {referrerLinkData.campaign}</Text>
      <Text style={styles.text}>Source: {referrerLinkData.source}</Text>
      <Text style={styles.text}>Medium: {referrerLinkData.medium}</Text>
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

export default ReferrerLinkDataScreen;
