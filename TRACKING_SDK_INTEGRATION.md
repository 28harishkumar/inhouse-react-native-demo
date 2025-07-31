# React Native Inhouse SDK Integration Guide

This guide explains how to integrate the React Native Inhouse SDK into your project following best practices.

## Installation

### 1. Install the SDK

```bash
npm install react-native-inhouse-sdk
# or
yarn add react-native-inhouse-sdk
```

### 2. iOS Setup

The SDK uses autolinking, so no manual configuration is needed. Just run:

```bash
cd ios && pod install
```

### 3. Android Setup

The SDK uses React Native's autolinking feature, so no manual configuration is required.

## Configuration

### Android Configuration

The SDK will automatically use your project's React Native and dependency versions. You can optionally configure specific versions in your `android/build.gradle`:

```gradle
ext {
    // SDK will use these versions if available, otherwise fallback to defaults
    okhttpVersion = '4.12.0'
    gsonVersion = '2.10.1'
    installReferrerVersion = '2.2'
    coroutinesVersion = '1.7.3'
    coreKtxVersion = '1.12.0'
    appcompatVersion = '1.6.1'
}
```

### iOS Configuration

The SDK automatically uses your project's React Native version. No additional configuration is needed.

## Usage

### 1. Import the SDK

```typescript
import TrackingSDK from 'react-native-inhouse-sdk';
```

### 2. Initialize the SDK

```typescript
// In your App.tsx or main component
useEffect(() => {
  const initializeSDK = async () => {
    try {
      await TrackingSDK.initialize(
        'your-project-id',
        'your-project-token',
        'your-shortlink-domain',
        'https://api.tryinhouse.co', // optional
        true, // enable debug logging
      );
      console.log('SDK initialized successfully');
    } catch (error) {
      console.error('Failed to initialize SDK:', error);
    }
  };

  initializeSDK();
}, []);
```

### 3. Set up Event Listeners

```typescript
useEffect(() => {
  const subscription = TrackingSDK.addCallbackListener(data => {
    console.log('SDK Callback:', data.callbackType, data.data);
    // Handle SDK callbacks here
  });

  return () => {
    TrackingSDK.removeCallbackListener(subscription);
  };
}, []);
```

### 4. Track Events

```typescript
// Track app open
const trackAppOpen = async () => {
  try {
    const result = await TrackingSDK.trackAppOpen('your-shortlink');
    console.log('App open tracked:', result);
  } catch (error) {
    console.error('Failed to track app open:', error);
  }
};

// Track session start
const trackSessionStart = async () => {
  try {
    const result = await TrackingSDK.trackSessionStart('your-shortlink');
    console.log('Session start tracked:', result);
  } catch (error) {
    console.error('Failed to track session start:', error);
  }
};

// Track short link click
const trackShortLinkClick = async () => {
  try {
    const result = await TrackingSDK.trackShortLinkClick(
      'your-shortlink',
      'your-deeplink',
    );
    console.log('Short link click tracked:', result);
  } catch (error) {
    console.error('Failed to track short link click:', error);
  }
};
```

### 5. Handle Install Referrer

```typescript
// Get install referrer
const getInstallReferrer = async () => {
  try {
    const referrer = await TrackingSDK.getInstallReferrer();
    console.log('Install referrer:', referrer);
    return referrer;
  } catch (error) {
    console.error('Failed to get install referrer:', error);
  }
};

// Fetch install referrer (async)
const fetchInstallReferrer = async () => {
  try {
    const referrer = await TrackingSDK.fetchInstallReferrer();
    console.log('Fetched install referrer:', referrer);
    return referrer;
  } catch (error) {
    console.error('Failed to fetch install referrer:', error);
  }
};
```

### 6. App Lifecycle Management

```typescript
// Call when app resumes
const handleAppResume = async () => {
  try {
    await TrackingSDK.onAppResume();
    console.log('App resume tracked');
  } catch (error) {
    console.error('Failed to track app resume:', error);
  }
};

// Reset first install (for testing)
const resetFirstInstall = async () => {
  try {
    await TrackingSDK.resetFirstInstall();
    console.log('First install reset');
  } catch (error) {
    console.error('Failed to reset first install:', error);
  }
};
```

## Best Practices

### 1. Error Handling

Always wrap SDK calls in try-catch blocks:

```typescript
try {
  const result = await TrackingSDK.trackAppOpen('shortlink');
  // Handle success
} catch (error) {
  console.error('SDK error:', error);
  // Handle error appropriately
}
```

### 2. Event Listener Management

Always clean up event listeners:

```typescript
useEffect(() => {
  const subscription = TrackingSDK.addCallbackListener(callback);

  return () => {
    TrackingSDK.removeCallbackListener(subscription);
  };
}, []);
```

### 3. Initialization

Initialize the SDK early in your app lifecycle:

```typescript
// In App.tsx
useEffect(() => {
  initializeSDK();
}, []);

const initializeSDK = async () => {
  try {
    await TrackingSDK.initialize(
      'project-id',
      'project-token',
      'shortlink-domain',
      'server-url',
      __DEV__, // enable debug in development
    );
  } catch (error) {
    console.error('SDK initialization failed:', error);
  }
};
```

### 4. TypeScript Support

The SDK provides TypeScript types:

```typescript
import TrackingSDK, {
  TrackingSDKCallback,
  TrackingSDKInterface,
} from 'react-native-inhouse-sdk';

// Use the types for better type safety
const handleCallback = (data: TrackingSDKCallback) => {
  console.log(data.callbackType, data.data);
};
```

## Troubleshooting

### Common Issues

1. **Build errors**: Make sure you have the latest React Native version
2. **Linking issues**: The SDK uses autolinking, but you can manually link if needed
3. **iOS pod install**: Run `cd ios && pod install` after installation
4. **Version conflicts**: The SDK uses your project's dependency versions to avoid conflicts

### Debug Mode

Enable debug logging during development:

```typescript
await TrackingSDK.initialize(
  'project-id',
  'project-token',
  'shortlink-domain',
  'server-url',
  __DEV__, // true in development, false in production
);
```

### Manual Linking (if needed)

If autolinking doesn't work, you can manually link the SDK:

#### Android

1. Add to `android/settings.gradle`:

```gradle
include ':react-native-inhouse-sdk'
project(':react-native-inhouse-sdk').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-inhouse-sdk/android')
```

2. Add to `android/app/build.gradle`:

```gradle
dependencies {
    implementation project(':react-native-inhouse-sdk')
}
```

#### iOS

Add to `ios/Podfile`:

```ruby
pod 'react-native-inhouse-sdk', :path => '../node_modules/react-native-inhouse-sdk'
```

## API Reference

### Methods

- `initialize(projectId, projectToken, shortLinkDomain, serverUrl?, enableDebugLogging?)`: Initialize the SDK
- `onAppResume()`: Call when app resumes
- `trackAppOpen(shortLink?)`: Track app open event
- `trackSessionStart(shortLink?)`: Track session start
- `trackShortLinkClick(shortLink, deepLink?)`: Track short link click
- `getInstallReferrer()`: Get current install referrer
- `fetchInstallReferrer()`: Fetch install referrer asynchronously
- `resetFirstInstall()`: Reset first install state
- `addCallbackListener(callback)`: Add event listener
- `removeCallbackListener(subscription)`: Remove specific listener
- `removeAllListeners()`: Remove all listeners

### Types

- `TrackingSDKCallback`: Callback data structure
- `TrackingSDKInterface`: Main SDK interface
