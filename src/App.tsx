import React, { useEffect, useState, useRef } from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Linking } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TrackingSDK, { TrackingSDKCallback } from './TrackingSDK';

// Import all screens
import HomeScreen from './screens/HomeScreen';
import Game1Screen from './screens/Game1Screen';
import Game2Screen from './screens/Game2Screen';
import Game1ResultsScreen from './screens/Game1ResultsScreen';
import Game2ResultsScreen from './screens/Game2ResultsScreen';
import AboutScreen from './screens/AboutScreen';
import ContactScreen from './screens/ContactScreen';
import Game1InstructionsScreen from './screens/Game1InstructionsScreen';
import Game2InstructionsScreen from './screens/Game2InstructionsScreen';
import InstallReferrerScreen from './screens/InstallReferrerScreen';
import ReferrerApiScreen from './screens/ReferrerApiScreen';
import ReferrerLinkDataScreen from './screens/ReferrerLinkDataScreen';

// Define the parameter types for each screen
export type RootStackParamList = {
  Home: undefined;
  Game1: undefined;
  Game2: undefined;
  Game1Results: { score: number };
  Game2Results: { level: number };
  About: undefined;
  Contact: undefined;
  Game1Instructions: undefined;
  Game2Instructions: undefined;
  InstallReferrer: undefined;
  ReferrerApi: undefined;
  ReferrerLinkData: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const navigationRef =
    useRef<NavigationContainerRef<RootStackParamList>>(null);
  const isProcessingRef = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParamList | null
  >(null);
  const [navigationStack, setNavigationStack] = useState<
    (keyof RootStackParamList)[]
  >([]);

  useEffect(() => {
    initializeTrackingSDK();
    setupDeepLinking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle navigation stack changes
  useEffect(() => {
    if (navigationStack.length > 0 && navigationRef.current && initialRoute) {
      console.log('Processing navigation stack:', navigationStack);

      // Clear the stack immediately to prevent multiple renders
      const currentStack = [...navigationStack];
      setNavigationStack([]);

      // Navigate through all routes immediately
      const processStack = () => {
        currentStack.forEach(route => {
          console.log('Navigating to:', route);
          navigationRef.current?.navigate(route as any);
        });
        isProcessingRef.current = false;
      };

      // Process immediately without delays
      processStack();
    }
  }, [navigationStack, initialRoute]);

  // Monitor initial route changes
  useEffect(() => {
    console.log('Initial route changed to:', initialRoute);
  }, [initialRoute]);

  const initializeTrackingSDK = async () => {
    try {
      await TrackingSDK.initialize(
        '51225fce-013c-4dbe-83f8-f50f625ac273',
        'k4H_d7U3qbc_lukp4o9gnfxu4nSvNEmdh6hp1Ghsghs',
        'new-projec.tryinhouse.co',
        'https://api.tryinhouse.co',
        true,
      );
      setIsInitialized(true);
      console.log('TrackingSDK initialized successfully');
    } catch (error) {
      console.error('Failed to initialize TrackingSDK:', error);
    }
  };

  const setupDeepLinking = () => {
    // Handle initial URL
    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Handle URL changes when app is running
    const subscription = Linking.addEventListener('url', event => {
      // Prevent duplicate processing
      if (!isProcessingRef.current) {
        handleDeepLink(event.url);
      }
    });

    // Add callback listener for TrackingSDK
    const sdkSubscription = TrackingSDK.addCallbackListener(
      (data: TrackingSDKCallback) => {
        console.log('SDK Callback:', data);
        handleSDKCallback(data);
      },
    );

    return () => {
      subscription?.remove();
      sdkSubscription.remove();
    };
  };

  const handleDeepLink = (url: string) => {
    if (isProcessingRef.current) {
      console.log('Already processing deep link, skipping:', url);
      return;
    }

    console.log('Deep link received:', url);
    isProcessingRef.current = true;

    const routes = parseDeepLink(url);
    console.log('Parsed routes:', routes);
    if (routes.length > 0) {
      console.log('Setting initial route to:', routes[0]);
      console.log('Setting navigation stack to:', routes.slice(1));
      setInitialRoute(routes[0]);
      setNavigationStack(routes.slice(1)); // Store remaining routes for navigation
    } else {
      console.log('No valid routes found for deep link');
      isProcessingRef.current = false;
    }
  };

  const handleSDKCallback = (data: TrackingSDKCallback) => {
    if (
      data.callbackType === 'shortlink_click' ||
      data.callbackType === 'app_install_from_shortlink'
    ) {
      try {
        const jsonData = JSON.parse(data.data);
        const link = jsonData.link;
        if (link && link.deeplink_path) {
          const routes = parseDeepLink(link.deeplink_path);
          if (routes.length > 0) {
            setInitialRoute(routes[0]);
            setNavigationStack(routes.slice(1));
          }
        }
      } catch (error) {
        console.error('Failed to parse SDK callback data:', error);
      }
    }
  };

  const parseDeepLink = (url: string): (keyof RootStackParamList)[] => {
    try {
      console.log('Parsing deep link - URL:', url);

      // Handle custom schemes that might not parse correctly with URL constructor
      let path = '';

      // Try to extract path from custom scheme URLs
      if (url.includes('://')) {
        const parts = url.split('://');
        if (parts.length > 1) {
          const afterScheme = parts[1];
          // Always include the entire path after the scheme
          path = '/' + afterScheme;
        }
      } else {
        // Handle plain path strings like "game1/game2/game1_results"
        if (!url.startsWith('/')) {
          path = '/' + url;
        } else {
          // Fallback to URL constructor for standard URLs
          const uri = new URL(url);
          path = uri.pathname;
        }
      }

      console.log('Extracted path:', path);

      // Handle nested paths like /game1/game2
      const pathSegments = path
        .split('/')
        .filter(segment => segment.length > 0);
      console.log('Path segments:', pathSegments);

      // Map paths to routes
      const routeMap: { [key: string]: keyof RootStackParamList } = {
        home: 'Home',
        game1: 'Game1',
        game2: 'Game2',
        game1_results: 'Game1Results',
        game2_results: 'Game2Results',
        about: 'About',
        contact: 'Contact',
        game1_instructions: 'Game1Instructions',
        game2_instructions: 'Game2Instructions',
        install_referrer: 'InstallReferrer',
        referrer_api: 'ReferrerApi',
        referrer_link_data: 'ReferrerLinkData',
      };

      // Build navigation stack from all matching segments
      const routes: (keyof RootStackParamList)[] = [];

      for (const segment of pathSegments) {
        if (routeMap[segment]) {
          console.log('Matched route:', routeMap[segment]);
          routes.push(routeMap[segment]);
        }
      }

      // Fallback for root path
      if (routes.length === 0 && (path === '/' || path === '')) {
        routes.push('Home');
      }

      console.log('Navigation stack:', routes);
      return routes;
    } catch (error) {
      console.error('Failed to parse deep link:', error);
      return [];
    }
  };

  if (!isInitialized) {
    return null; // You can show a loading screen here
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer
          ref={navigationRef}
          onReady={() => {
            console.log('NavigationContainer is ready');
          }}
        >
          <Stack.Navigator
            initialRouteName={initialRoute || 'Home'}
            screenOptions={{
              headerStyle: {
                backgroundColor: '#6200ee',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Home' }}
            />
            <Stack.Screen
              name="Game1"
              component={Game1Screen}
              options={{ title: 'Game 1' }}
            />
            <Stack.Screen
              name="Game2"
              component={Game2Screen}
              options={{ title: 'Game 2' }}
            />
            <Stack.Screen
              name="Game1Results"
              component={Game1ResultsScreen}
              options={{ title: 'Game 1 Results' }}
            />
            <Stack.Screen
              name="Game2Results"
              component={Game2ResultsScreen}
              options={{ title: 'Game 2 Results' }}
            />
            <Stack.Screen
              name="About"
              component={AboutScreen}
              options={{ title: 'About' }}
            />
            <Stack.Screen
              name="Contact"
              component={ContactScreen}
              options={{ title: 'Contact' }}
            />
            <Stack.Screen
              name="Game1Instructions"
              component={Game1InstructionsScreen}
              options={{ title: 'Game 1 Instructions' }}
            />
            <Stack.Screen
              name="Game2Instructions"
              component={Game2InstructionsScreen}
              options={{ title: 'Game 2 Instructions' }}
            />
            <Stack.Screen
              name="InstallReferrer"
              component={InstallReferrerScreen}
              options={{ title: 'Install Referrer' }}
            />
            <Stack.Screen
              name="ReferrerApi"
              component={ReferrerApiScreen}
              options={{ title: 'Referrer API' }}
            />
            <Stack.Screen
              name="ReferrerLinkData"
              component={ReferrerLinkDataScreen}
              options={{ title: 'Referrer Link Data' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
