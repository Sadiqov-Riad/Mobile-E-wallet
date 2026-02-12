import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Svg, { Defs, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

// Wallet Icon Component
const WalletIcon = () => (
  <Svg width={64} height={64} viewBox="0 0 64 64" fill="none">
    <Rect x="8" y="16" width="48" height="36" rx="4" stroke="#A855F7" strokeWidth="3" fill="none" />
    <Rect x="8" y="16" width="48" height="12" fill="#A855F7" opacity="0.3" />
    <Rect x="40" y="30" width="12" height="10" rx="2" fill="#A855F7" />
    <Rect x="44" y="33" width="4" height="4" rx="2" fill="#1a1a2e" />
  </Svg>
);

export default function LoadingScreen() {
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Spinning animation for loader
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation for icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.8,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.4,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={['#0a0a0f', '#0d0d1a', '#0a0a0f']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          {/* Glow Effect */}
          <Animated.View
            style={[
              styles.glowContainer,
              {
                opacity: glowOpacity,
                transform: [{ scale: pulseValue }],
              },
            ]}
          >
            <View style={styles.glowOuter} />
            <View style={styles.glowInner} />
          </Animated.View>

          {/* Icon Container */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ scale: pulseValue }],
              },
            ]}
          >
            <WalletIcon />
          </Animated.View>
        </View>

        {/* App Name */}
        <Text style={styles.appName}>E-Wallet</Text>
        <Text style={styles.tagline}>SECURE BANKING</Text>
      </View>

      {/* Loading Section */}
      <View style={styles.loadingSection}>
        {/* Circular Loader */}
        <Animated.View
          style={[
            styles.loader,
            {
              transform: [{ rotate: spin }],
            },
          ]}
        >
          <Svg width={48} height={48} viewBox="0 0 48 48">
            <Defs>
              <RadialGradient id="loaderGradient" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="#A855F7" stopOpacity="1" />
                <Stop offset="100%" stopColor="#7C3AED" stopOpacity="0.5" />
              </RadialGradient>
            </Defs>
            <Path
              d="M24 4 A20 20 0 0 1 44 24"
              stroke="url(#loaderGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
        </Animated.View>

        {/* Loading Text */}
        <Text style={styles.loadingText}>Establishing secure connection...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoSection: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  glowContainer: {
    position: 'absolute',
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowOuter: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#A855F7',
    opacity: 0.15,
  },
  glowInner: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#A855F7',
    opacity: 0.2,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A855F7',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  appName: {
    fontSize: 36,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    letterSpacing: 4,
  },
  loadingSection: {
    paddingBottom: 100,
    alignItems: 'center',
  },
  loader: {
    width: 48,
    height: 48,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    letterSpacing: 0.5,
  },
});
