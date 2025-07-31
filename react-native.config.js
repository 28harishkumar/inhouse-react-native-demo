module.exports = {
  dependencies: {
    'react-native-gesture-handler': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-gesture-handler/android',
          packageImportPath:
            'import com.swmansion.gesturehandler.RNGestureHandlerPackage;',
          packageInstance: 'new RNGestureHandlerPackage()',
        },
      },
    },
    'react-native-safe-area-context': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-safe-area-context/android',
          packageImportPath:
            'import com.th3rdwave.safeareacontext.SafeAreaContextPackage;',
          packageInstance: 'new SafeAreaContextPackage()',
        },
      },
    },
    'react-native-screens': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-screens/android',
          packageImportPath: 'import com.swmansion.rnscreens.RNScreensPackage;',
          packageInstance: 'new RNScreensPackage()',
        },
      },
    },
    'react-native-inhouse-sdk': {
      platforms: {
        android: {
          sourceDir: '../react-native-inhouse-sdk/android',
          packageImportPath:
            'import co.tryinhouse.react_native.TrackingSDKPackage;',
          packageInstance: 'new TrackingSDKPackage()',
        },
      },
    },
  },
};
