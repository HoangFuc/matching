module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './',
          '@env': './src/env.js',

        },
      },
    ],
    'react-native-reanimated/plugin', // MUST be last
  ],
};
