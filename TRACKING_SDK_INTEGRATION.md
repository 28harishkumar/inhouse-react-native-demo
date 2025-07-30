# TrackingSDK Integration Guide

This guide explains how to use the integrated TrackingSDK in your React Native app.

## Setup

The TrackingSDK has been integrated with the following components:

### 1. Native Module (`TrackingSDKModule.kt`)

- Located at: `android/app/src/main/java/com/myapp/TrackingSDKModule.kt`
- Provides native Android implementation for all TrackingSDK methods

### 2. React Package (`TrackingSDKPackage.kt`)

- Located at: `android/app/src/main/java/com/myapp/TrackingSDKPackage.kt`
- Registers the native module with React Native

### 3. TypeScript Interface (`TrackingSDK.ts`)

- Located at: `src/TrackingSDK.ts`
- Provides TypeScript definitions and wrapper for the native module

### 4. Example Component (`TrackingSDKExample.tsx`)

- Located at: `src/TrackingSDKExample.tsx`
- Shows how to use all TrackingSDK methods

## Dependencies

The following dependencies have been added:

### Android Build Configuration

- **Maven Repository**: Added `mavenLocal()` to support local Maven dependencies
- **TrackingSDK Dependency**: `co.tryinhouse.android:sdk:1.0.0`

### Files Modified

1. `android/build.gradle` - Added Maven repository configuration
2. `android/app/build.gradle` - Added TrackingSDK dependency
3. `android/app/src/main/java/com/myapp/MainApplication.kt` - Registered TrackingSDKPackage

## Usage

### Basic Setup

1. **Import the TrackingSDK**:

```typescript
import TrackingSDK from './src/TrackingSDK';
```

2. **Initialize the SDK**:

```typescript
await TrackingSDK.initialize(
  'your-project-id',
  'your-project-token',
  'your-short-link-domain',
  'https://your-api-server.com',
  true, // Enable debug logging
);
```

3. **Add callback listener** (optional):

```typescript
const subscription = TrackingSDK.addCallbackListener(data => {
  console.log('SDK Callback:', data);
});
```

### Available Methods

#### Core Methods

- `initialize(projectId, projectToken, shortLinkDomain, serverUrl?, enableDebugLogging?)` - Initialize the SDK
- `onAppResume()` - Track app resume events
- `trackAppOpen(shortLink?)` - Track app open events
- `trackSessionStart(shortLink?)` - Track session start events
- `trackShortLinkClick(shortLink, deepLink?)` - Track short link clicks

#### Install Referrer Methods

- `getInstallReferrer()` - Get cached install referrer
- `fetchInstallReferrer()` - Fetch fresh install referrer
- `resetFirstInstall()` - Reset first install flag

#### Activity Management

- `setCurrentActivity(activity)` - Set current activity for SDK (internal use only)

#### Event Management

- `addCallbackListener(callback)` - Add callback listener
- `removeCallbackListener(subscription)` - Remove specific listener
- `removeAllListeners()` - Remove all listeners

### Example Usage

```typescript
import React, { useEffect } from 'react';
import { View, Button } from 'react-native';
import TrackingSDK from './src/TrackingSDK';

const MyComponent = () => {
  useEffect(() => {
    // Initialize SDK
    const initSDK = async () => {
      try {
        await TrackingSDK.initialize(
          'your-project-id',
          'your-project-token',
          'your-domain.com',
          'https://api.your-domain.com',
          true,
        );
        console.log('SDK initialized successfully');
      } catch (error) {
        console.error('SDK initialization failed:', error);
      }
    };

    initSDK();

    // Add callback listener
    const subscription = TrackingSDK.addCallbackListener(data => {
      console.log('SDK Callback:', data);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleTrackAppOpen = async () => {
    try {
      const result = await TrackingSDK.trackAppOpen('your-short-link');
      console.log('App open tracked:', result);
    } catch (error) {
      console.error('Failed to track app open:', error);
    }
  };

  return (
    <View>
      <Button title="Track App Open" onPress={handleTrackAppOpen} />
    </View>
  );
};
```

## Configuration

### Required Parameters

- **projectId**: Your project identifier
- **projectToken**: Your project authentication token
- **shortLinkDomain**: Your short link domain

### Optional Parameters

- **serverUrl**: Custom server URL (defaults to "https://your-api-server.com")
- **enableDebugLogging**: Enable debug logging (defaults to false)

## Error Handling

All methods return Promises and should be wrapped in try-catch blocks:

```typescript
try {
  const result = await TrackingSDK.trackAppOpen('link');
  console.log('Success:', result);
} catch (error) {
  console.error('Error:', error);
}
```

## Testing

Use the provided `TrackingSDKExample.tsx` component to test all SDK functionality. Replace the placeholder values with your actual project credentials.

## Troubleshooting

1. **Build Errors**: Ensure the Maven dependency is available in your local Maven repository
2. **Runtime Errors**: Check that the SDK is properly initialized before calling other methods
3. **Callback Issues**: Ensure callback listeners are properly added and removed to prevent memory leaks

## Notes

- The SDK requires Android API level 24 or higher
- All native methods are asynchronous and return Promises
- Callback events are emitted through React Native's event system
- The SDK automatically handles activity lifecycle events
