const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [path.resolve(__dirname, '../react-native-inhouse-sdk')],
  resolver: {
    alias: {
      'react-native-inhouse-sdk': path.resolve(
        __dirname,
        '../react-native-inhouse-sdk/lib/index.js',
      ),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
