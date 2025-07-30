import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:app_links/app_links.dart';
import 'package:firebase_dynamic_links/firebase_dynamic_links.dart';
import 'dart:async';
import 'package:flutter/services.dart';
import 'dart:convert';
// Import all new screens
import 'home_screen.dart';
import 'game1_screen.dart';
import 'game2_screen.dart';
import 'game1_results_screen.dart';
import 'game2_results_screen.dart';
import 'about_screen.dart';
import 'contact_screen.dart';
import 'game1_instructions_screen.dart';
import 'game2_instructions_screen.dart';
import 'install_referrer_screen.dart';
import 'referrer_api_screen.dart';
import 'referrer_link_data_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  // Handle background message
  print('Handling a background message: \\${message.messageId}');
}

const MethodChannel _platform = MethodChannel('tracking_sdk');

Future<String?> getInstallReferrer() async {
  try {
    return await _platform.invokeMethod<String>('getInstallReferrer');
  } catch (e) {
    print('getInstallReferrer error: $e');
    return null;
  }
}

Future<String?> fetchInstallReferrer() async {
  try {
    return await _platform.invokeMethod<String>('fetchInstallReferrer');
  } catch (e) {
    print('fetchInstallReferrer error: $e');
    return null;
  }
}

Future<void> resetFirstInstall() async {
  try {
    await _platform.invokeMethod('resetFirstInstall');
  } catch (e) {
    print('resetFirstInstall error: $e');
  }
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> with WidgetsBindingObserver {
  final GlobalKey<NavigatorState> _navigatorKey = GlobalKey<NavigatorState>();
  bool _initialized = false;
  StreamSubscription? _uriSub;
  StreamSubscription? _dynLinkSub;
  AppLinks? _appLinks;
  final List<Uri> _pendingDeepLinks = [];
  String? _lastPushedRoute;
  Map<String, dynamic>? _appInstallFromShortlinkData;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _platform.setMethodCallHandler(_sdkCallbackHandler);
    initializeTrackingSDK();
    _initDeepLinks();
  }

  Future<void> initializeTrackingSDK() async {
    // try {
    //   await _platform.invokeMethod('initialize', {
    //     'projectId': '51225fce-013c-4dbe-83f8-f50f625ac273',
    //     'projectToken': 'k4H_d7U3qbc_lukp4o9gnfxu4nSvNEmdh6hp1Ghsghs',
    //     'shortLinkDomain': 'new-projec.tryinhouse.co',
    //     'serverUrl': 'https://api.tryinhouse.co',
    //     'enableDebugLogging': true,
    //   });
    // } on PlatformException catch (e) {
    //   print('Failed to initialize Tracking SDK: ${e.message}');
    // }
    try {
      await _platform.invokeMethod('initialize', {
        'projectId': '71201549-0e0f-412e-a4a7-00570b4c5328',
        'projectToken': 'zR0yYP3ECG3k2Vk581phqhIKIxCIASpqSvm8-8Qk4d0',
        'shortLinkDomain': 'focks.tryinhouse.co',
        'serverUrl': 'https://api.tryinhouse.co',
        'enableDebugLogging': true,
      });
    } on PlatformException catch (e) {
      print('Failed to initialize Tracking SDK: ${e.message}');
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _uriSub?.cancel();
    _dynLinkSub?.cancel();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      print("didChangeAppLifecycleState");
      _platform.invokeMethod('onAppResume');
    }
  }

  Future<void> _sdkCallbackHandler(MethodCall call) async {
    if (call.method == 'onSdkCallback') {
      final String callbackType = call.arguments['callbackType'];
      final String data = call.arguments['data'];
      print('SDK Callback: type= $callbackType data= $data');

      // Parse data as JSON and check for 'link'
      try {
        final Map<String, dynamic> jsonData = json.decode(data);
        String path = '';
        final dynamic linkValue = jsonData['link'];
        if (linkValue is Map && linkValue.containsKey('deeplink_path')) {
          path = linkValue['deeplink_path'];
        }

        if (callbackType == "app_install_from_shortlink") {
          setState(() {
            _appInstallFromShortlinkData = jsonData;
          });
          // Persist to SharedPreferences
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString(
            'app_install_from_shortlink',
            json.encode(jsonData),
          );
        }

        if (path.isNotEmpty &&
            (callbackType == "shortlink_click" ||
                callbackType == "app_install_from_shortlink")) {
          final uri = Uri(path: path);
          _handleStackedDeepLink(uri);
        }
      } catch (e) {
        print('Failed to parse SDK callback data as JSON: $e');
      }
    }
  }

  Future<void> _initDeepLinks() async {
    _appLinks = AppLinks();
    // Listen for app links (deep links)
    _uriSub = _appLinks!.uriLinkStream.listen((Uri? uri) {
      if (uri != null) {
        _handleStackedDeepLink(uri);
      }
    }, onError: (err) {});

    // Listen for dynamic links (deferred deep links)
    _dynLinkSub = FirebaseDynamicLinks.instance.onLink.listen((
      PendingDynamicLinkData? data,
    ) {
      final Uri? deepLink = data?.link;
      if (deepLink != null) {
        _handleStackedDeepLink(deepLink);
      }
    });

    // Handle initial link (cold start)
    final initialUri = await _appLinks!.getInitialAppLink();
    if (initialUri != null) {
      _handleStackedDeepLink(initialUri);
    }
    // Handle initial dynamic link
    final PendingDynamicLinkData? initialDynamicLink =
        await FirebaseDynamicLinks.instance.getInitialLink();
    if (initialDynamicLink?.link != null) {
      _handleStackedDeepLink(initialDynamicLink!.link);
    }
    setState(() {
      _initialized = true;
    });
    if (_pendingDeepLinks.isNotEmpty) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        for (final uri in _pendingDeepLinks) {
          _processDeepLink(uri);
        }
        _pendingDeepLinks.clear();
      });
    }
  }

  void _handleStackedDeepLink(Uri uri) {
    if (_navigatorKey.currentState == null || !_initialized) {
      _pendingDeepLinks.add(uri);
      return;
    }
    _processDeepLink(uri);
  }

  void _processDeepLink(Uri uri) async {
    // Always start from home
    final segments = uri.pathSegments;
    final routes = <String>['/'];
    for (final seg in segments) {
      final route = _segmentToRoute(seg);
      if (route != null) routes.add(route);
    }
    // Remove duplicates (e.g., if home is already in stack)
    final filteredRoutes = <String>[];
    for (final r in routes) {
      if (filteredRoutes.isEmpty || filteredRoutes.last != r) {
        filteredRoutes.add(r);
      }
    }
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      try {
        _navigatorKey.currentState?.popUntil((route) => route.isFirst);
        _lastPushedRoute = '/';
        for (int i = 1; i < filteredRoutes.length; i++) {
          final routeName = filteredRoutes[i];
          await Future.delayed(const Duration(milliseconds: 100));
          if (_lastPushedRoute != routeName) {
            _navigatorKey.currentState?.pushNamed(routeName);
            _lastPushedRoute = routeName;
          } else {
            print(
              'Skipped pushing $routeName because it is already the top route',
            );
          }
        }
      } catch (e) {
        print('Navigation error: $e');
      }
    });
  }

  String? _segmentToRoute(String seg) {
    switch (seg) {
      case 'game1':
        return '/game1';
      case 'game2':
        return '/game2';
      case 'game1_results':
        return '/game1_results';
      case 'game2_results':
        return '/game2_results';
      case 'about':
        return '/about';
      case 'contact':
        return '/contact';
      case 'game1_instructions':
        return '/game1_instructions';
      case 'game2_instructions':
        return '/game2_instructions';
      case 'install_referrer':
        return '/install_referrer';
      case 'referrer_api':
        return '/referrer_api';
      case 'referrer_link_data':
        return '/referrer_link_data';
      case '':
        return '/';
      default:
        return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!_initialized) {
      return const MaterialApp(
        home: Scaffold(body: Center(child: CircularProgressIndicator())),
      );
    }
    return MaterialApp(
      navigatorKey: _navigatorKey,
      title: 'Flutter Demo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const HomeScreen(),
        '/game1': (context) => const Game1Screen(),
        '/game2': (context) => const Game2Screen(),
        '/game1_results': (context) => const Game1ResultsScreen(),
        '/game2_results': (context) => const Game2ResultsScreen(),
        '/about': (context) => const AboutScreen(),
        '/contact': (context) => const ContactScreen(),
        '/game1_instructions': (context) => const Game1InstructionsScreen(),
        '/game2_instructions': (context) => const Game2InstructionsScreen(),
        '/install_referrer': (context) => const InstallReferrerScreen(),
        '/referrer_api': (context) => const ReferrerApiScreen(),
        '/referrer_link_data': (context) => const ReferrerLinkDataScreen(),
      },
    );
  }
}

// Drawer widget to be used in all screens
class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          const DrawerHeader(
            decoration: BoxDecoration(color: Colors.deepPurple),
            child: Text(
              'Menu',
              style: TextStyle(color: Colors.white, fontSize: 24),
            ),
          ),
          _drawerItem(context, 'Home', '/'),
          _drawerItem(context, 'Game 1', '/game1'),
          _drawerItem(context, 'Game 2', '/game2'),
          _drawerItem(context, 'Game 1 Results', '/game1_results'),
          _drawerItem(context, 'Game 2 Results', '/game2_results'),
          _drawerItem(context, 'Game 1 Instructions', '/game1_instructions'),
          _drawerItem(context, 'Game 2 Instructions', '/game2_instructions'),
          _drawerItem(context, 'About', '/about'),
          _drawerItem(context, 'Contact', '/contact'),
          _drawerItem(context, 'Install Referrer', '/install_referrer'),
          _drawerItem(context, 'Referrer API', '/referrer_api'),
          _drawerItem(context, 'Referrer Link Data', '/referrer_link_data'),
        ],
      ),
    );
  }

  Widget _drawerItem(BuildContext context, String title, String route) {
    return ListTile(
      title: Text(title),
      onTap: () {
        Navigator.of(context).pop();
        Navigator.of(context).pushReplacementNamed(route);
      },
    );
  }
}
