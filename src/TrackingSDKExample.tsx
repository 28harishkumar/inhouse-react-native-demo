import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import TrackingSDK, { TrackingSDKCallback } from './TrackingSDK';

const TrackingSDKExample: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [installReferrer, setInstallReferrer] = useState<string>('');

  useEffect(() => {
    // Initialize the TrackingSDK
    initializeTrackingSDK();

    // Add callback listener
    const subscription = TrackingSDK.addCallbackListener(
      (data: TrackingSDKCallback) => {
        console.log('TrackingSDK Callback:', data);
        Alert.alert(
          'SDK Callback',
          `Type: ${data.callbackType}\nData: ${data.data}`,
        );
      },
    );

    // Cleanup on unmount
    return () => {
      subscription.remove();
      TrackingSDK.removeAllListeners();
    };
  }, []);

  const initializeTrackingSDK = async () => {
    try {
      await TrackingSDK.initialize(
        'your-project-id', // Replace with your actual project ID
        'your-project-token', // Replace with your actual project token
        'your-short-link-domain', // Replace with your actual short link domain
        'https://your-api-server.com', // Replace with your actual server URL
        true, // Enable debug logging
      );
      setIsInitialized(true);
      Alert.alert('Success', 'TrackingSDK initialized successfully!');
    } catch (error) {
      console.error('Failed to initialize TrackingSDK:', error);
      Alert.alert('Error', 'Failed to initialize TrackingSDK');
    }
  };

  const handleTrackAppOpen = async () => {
    try {
      const result = await TrackingSDK.trackAppOpen('your-short-link');
      Alert.alert('Success', `App open tracked: ${result}`);
    } catch (error) {
      console.error('Failed to track app open:', error);
      Alert.alert('Error', 'Failed to track app open');
    }
  };

  const handleTrackSessionStart = async () => {
    try {
      const result = await TrackingSDK.trackSessionStart('your-short-link');
      Alert.alert('Success', `Session start tracked: ${result}`);
    } catch (error) {
      console.error('Failed to track session start:', error);
      Alert.alert('Error', 'Failed to track session start');
    }
  };

  const handleTrackShortLinkClick = async () => {
    try {
      const result = await TrackingSDK.trackShortLinkClick(
        'your-short-link',
        'your-deep-link',
      );
      Alert.alert('Success', `Short link click tracked: ${result}`);
    } catch (error) {
      console.error('Failed to track short link click:', error);
      Alert.alert('Error', 'Failed to track short link click');
    }
  };

  const handleGetInstallReferrer = async () => {
    try {
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
      await TrackingSDK.resetFirstInstall();
      Alert.alert('Success', 'First install reset successfully');
    } catch (error) {
      console.error('Failed to reset first install:', error);
      Alert.alert('Error', 'Failed to reset first install');
    }
  };

  const handleOnAppResume = async () => {
    try {
      await TrackingSDK.onAppResume();
      Alert.alert('Success', 'App resume tracked');
    } catch (error) {
      console.error('Failed to track app resume:', error);
      Alert.alert('Error', 'Failed to track app resume');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20,
          textAlign: 'center',
        }}
      >
        TrackingSDK Example
      </Text>

      <Text style={{ marginBottom: 10 }}>
        Status: {isInitialized ? 'Initialized' : 'Not Initialized'}
      </Text>

      {installReferrer ? (
        <Text style={{ marginBottom: 10 }}>
          Install Referrer: {installReferrer}
        </Text>
      ) : null}

      <Button title="Initialize SDK" onPress={initializeTrackingSDK} />
      <View style={{ height: 10 }} />

      <Button title="Track App Open" onPress={handleTrackAppOpen} />
      <View style={{ height: 10 }} />

      <Button title="Track Session Start" onPress={handleTrackSessionStart} />
      <View style={{ height: 10 }} />

      <Button
        title="Track Short Link Click"
        onPress={handleTrackShortLinkClick}
      />
      <View style={{ height: 10 }} />

      <Button title="Get Install Referrer" onPress={handleGetInstallReferrer} />
      <View style={{ height: 10 }} />

      <Button
        title="Fetch Install Referrer"
        onPress={handleFetchInstallReferrer}
      />
      <View style={{ height: 10 }} />

      <Button title="Reset First Install" onPress={handleResetFirstInstall} />
      <View style={{ height: 10 }} />

      <Button title="On App Resume" onPress={handleOnAppResume} />
    </View>
  );
};

export default TrackingSDKExample;
