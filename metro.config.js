const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude server folder from Metro bundler
config.resolver.blockList = [
  /server\/.*/,
];

module.exports = config;
