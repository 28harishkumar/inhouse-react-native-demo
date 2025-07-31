import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import TrackingSDK, { TrackingSDKCallback } from 'react-native-inhouse-sdk';

const TrackingSDKExample: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [installReferrer, setInstallReferrer] = useState<string>('');

  useEffect(() => {
    // Initialize the SDK automatically
    initializeTrackingSDK();

    // Add callback listener
    if (!TrackingSDK) {
      console.error('TrackingSDK is not available');
      return;
    }
    const subscription = TrackingSDK.addCallbackListener(
      (data: TrackingSDKCallback) => {
        console.log('SDK Callback:', data);
        Alert.alert(
          'SDK Callback',
          `Type: ${data.callbackType}\nData: ${data.data}`,
        );
      },
    );

    // Cleanup on unmount
    return () => {
      subscription.remove();
      if (TrackingSDK) {
        TrackingSDK.removeAllListeners();
      }
    };
  }, []);

  const initializeTrackingSDK = async () => {
    try {
      if (!TrackingSDK) {
        console.error('TrackingSDK is not available');
        return;
      }
      await TrackingSDK.initialize(
        'demo-project-id',
        'demo-project-token',
        'demo-shortlink-domain',
        'https://api.tryinhouse.co',
        true, // Enable debug logging for demo
      );
      setIsInitialized(true);
      Alert.alert('Success', 'SDK initialized successfully!');
    } catch (error) {
      console.error('Failed to initialize SDK:', error);
      Alert.alert('Error', 'Failed to initialize SDK');
    }
  };

  const handleTrackAppOpen = async () => {
    try {
      if (!TrackingSDK) {
        Alert.alert('Error', 'TrackingSDK is not available');
        return;
      }
      const result = await TrackingSDK.trackAppOpen('demo-shortlink');
      Alert.alert('Success', `App open tracked: ${result}`);
    } catch (error) {
      console.error('Failed to track app open:', error);
      Alert.alert('Error', 'Failed to track app open');
    }
  };

  const handleTrackSessionStart = async () => {
    try {
      if (!TrackingSDK) {
        Alert.alert('Error', 'TrackingSDK is not available');
        return;
      }
      const result = await TrackingSDK.trackSessionStart('demo-shortlink');
      Alert.alert('Success', `Session start tracked: ${result}`);
    } catch (error) {
      console.error('Failed to track session start:', error);
      Alert.alert('Error', 'Failed to track session start');
    }
  };

  const handleTrackShortLinkClick = async () => {
    try {
      if (!TrackingSDK) {
        Alert.alert('Error', 'TrackingSDK is not available');
        return;
      }
      const result = await TrackingSDK.trackShortLinkClick(
        'demo-shortlink',
        'demo-deeplink',
      );
      Alert.alert('Success', `Short link click tracked: ${result}`);
    } catch (error) {
      console.error('Failed to track short link click:', error);
      Alert.alert('Error', 'Failed to track short link click');
    }
  };

  const handleGetInstallReferrer = async () => {
    try {
      if (!TrackingSDK) {
        Alert.alert('Error', 'TrackingSDK is not available');
        return;
      }
      const referrer = await TrackingSDK.getInstallReferrer();
      setInstallReferrer(referrer);
      Alert.alert('Success', `Install referrer: ${referrer}`);
    } catch (error) {
      console.error('Failed to get install referrer:', error);
      Alert.alert('Error', 'Failed to get install referrer');
    }
  };

  const handleFetchInstallReferrer = async () => {
    try {
      if (!TrackingSDK) {
        Alert.alert('Error', 'TrackingSDK is not available');
        return;
      }
      const referrer = await TrackingSDK.fetchInstallReferrer();
      setInstallReferrer(referrer);
      Alert.alert('Success', `Fetched install referrer: ${referrer}`);
    } catch (error) {
      console.error('Failed to fetch install referrer:', error);
      Alert.alert('Error', 'Failed to fetch install referrer');
    }
  };

  const handleResetFirstInstall = async () => {
    try {
      if (!TrackingSDK) {
        console.error('TrackingSDK is not available');
        return;
      }
      await TrackingSDK.resetFirstInstall();
      Alert.alert('Success', 'First install reset successfully');
    } catch (error) {
      console.error('Failed to reset first install:', error);
      Alert.alert('Error', 'Failed to reset first install');
    }
  };

  const handleOnAppResume = async () => {
    try {
      if (!TrackingSDK) {
        console.error('TrackingSDK is not available');
        return;
      }
      await TrackingSDK.onAppResume();
      Alert.alert('Success', 'App resume tracked');
    } catch (error) {
      console.error('Failed to track app resume:', error);
      Alert.alert('Error', 'Failed to track app resume');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>React Native Inhouse SDK Demo</Text>

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Text
            style={[
              styles.statusText,
              { color: isInitialized ? 'green' : 'red' },
            ]}
          >
            {isInitialized ? 'Initialized' : 'Not Initialized'}
          </Text>
        </View>

        {installReferrer && (
          <View style={styles.referrerContainer}>
            <Text style={styles.referrerLabel}>Install Referrer:</Text>
            <Text style={styles.referrerText}>{installReferrer}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button title="Initialize SDK" onPress={initializeTrackingSDK} />
          <View style={styles.buttonSpacer} />
          <Button title="Track App Open" onPress={handleTrackAppOpen} />
          <View style={styles.buttonSpacer} />
          <Button
            title="Track Session Start"
            onPress={handleTrackSessionStart}
          />
          <View style={styles.buttonSpacer} />
          <Button
            title="Track Short Link Click"
            onPress={handleTrackShortLinkClick}
          />
          <View style={styles.buttonSpacer} />
          <Button
            title="Get Install Referrer"
            onPress={handleGetInstallReferrer}
          />
          <View style={styles.buttonSpacer} />
          <Button
            title="Fetch Install Referrer"
            onPress={handleFetchInstallReferrer}
          />
          <View style={styles.buttonSpacer} />
          <Button
            title="Reset First Install"
            onPress={handleResetFirstInstall}
          />
          <View style={styles.buttonSpacer} />
          <Button title="On App Resume" onPress={handleOnAppResume} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    color: '#333',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  referrerContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  referrerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  referrerText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  buttonContainer: {
    gap: 10,
  },
  buttonSpacer: {
    height: 10,
  },
});

export default TrackingSDKExample;
