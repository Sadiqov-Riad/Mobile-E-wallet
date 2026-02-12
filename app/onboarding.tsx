import { useAppColors } from '@/store/theme-store';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Icon Components
const WalletIcon = () => (
  <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
    <Rect x="4" y="8" width="24" height="18" rx="2" stroke="#FFFFFF" strokeWidth="2" fill="none" />
    <Rect x="4" y="8" width="24" height="6" fill="#FFFFFF" opacity="0.3" />
    <Rect x="20" y="15" width="6" height="5" rx="1" fill="#FFFFFF" />
  </Svg>
);

const DollarIcon = () => (
  <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
    <Circle cx="14" cy="14" r="12" stroke="#FFFFFF" strokeWidth="2" fill="none" />
    <Path
      d="M14 7V21M17 10.5C17 10.5 16.5 9 14 9C11.5 9 11 10.5 11 11.5C11 12.5 12 13.5 14 14C16 14.5 17 15.5 17 16.5C17 17.5 16.5 19 14 19C11.5 19 11 17.5 11 17.5"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const ShieldIcon = () => (
  <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
    <Path
      d="M14 3L4 7V13C4 19.5 8.5 25.5 14 27C19.5 25.5 24 19.5 24 13V7L14 3Z"
      stroke="#6366F1"
      strokeWidth="2"
      fill="none"
    />
    <Path
      d="M10 14L13 17L18 11"
      stroke="#6366F1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const TrendIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 16L10 10L14 14L20 8"
      stroke="#10B981"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15 8H20V13"
      stroke="#10B981"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Phone Illustration Component
const PhoneIllustration = ({ colors }: { colors: ReturnType<typeof useAppColors> }) => (
  <View style={styles.illustrationContainer}>
    {/* Trend Icon - Top Right */}
    <View style={[styles.floatingIcon, styles.trendIcon]}>
      <TrendIcon />
    </View>

    {/* Shield Icon - Left */}
    <View style={[styles.floatingIcon, styles.shieldIcon]}>
      <ShieldIcon />
    </View>

    {/* Phone Frame */}
    <View style={[styles.phoneFrame, { backgroundColor: colors.backgroundCard }]}>
      {/* Phone Notch */}
      <View style={[styles.phoneNotch, { backgroundColor: colors.border }]} />

      {/* Phone Content */}
      <View style={styles.phoneContent}>
        {/* Overlapping Icons */}
        <View style={styles.iconsContainer}>
          {/* Dollar Circle */}
          <View style={[styles.iconCircle, styles.dollarCircle]}>
            <DollarIcon />
          </View>

          {/* Wallet Circle */}
          <View style={[styles.iconCircle, styles.walletCircle]}>
            <WalletIcon />
          </View>
        </View>

        {/* Placeholder Lines */}
        <View style={styles.placeholderLines}>
          <View style={[styles.line, { width: '70%', backgroundColor: colors.border }]} />
          <View style={[styles.line, { width: '50%', marginTop: 8, backgroundColor: colors.border }]} />
        </View>
      </View>
    </View>
  </View>
);

// Onboarding Data
const onboardingData = [
  {
    id: '1',
    title: 'Digital Finance',
    titleHighlight: 'Simplified',
    description: 'Experience the next generation of money management. Secure, fast, and remarkably simple.',
  },
  {
    id: '2',
    title: 'Send Money',
    titleHighlight: 'Instantly',
    description: 'Transfer funds to anyone, anywhere in the world. Lightning-fast transactions at your fingertips.',
  },
  {
    id: '3',
    title: 'Track Your',
    titleHighlight: 'Spending',
    description: 'Get insights into your financial habits. Smart analytics to help you save more.',
  },
];

interface OnboardingScreenProps {
  onComplete?: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const colors = useAppColors();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleGetStarted = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const renderItem = ({ item }: { item: typeof onboardingData[0] }) => (
    <View style={styles.slide}>
      {/* Illustration */}
      <PhoneIllustration colors={colors} />

      {/* Text Content */}
      <View style={styles.textContent}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{item.title}</Text>
        <Text style={[styles.titleHighlight, { color: colors.primary }]}>{item.titleHighlight}</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>{item.description}</Text>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {onboardingData.map((_, index) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 24, 8],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: dotWidth,
                opacity,
                backgroundColor: colors.primary,
              },
            ]}
          />
        );
      })}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {renderPagination()}

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#A855F7', '#9333EA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Get Started</Text>
            <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" style={styles.buttonIcon}>
              <Path
                d="M4 10H16M16 10L11 5M16 10L11 15"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </LinearGradient>
        </TouchableOpacity>

        {/* Terms Text */}
        <View style={styles.termsContainer}>
          <Text style={[styles.termsText, { color: colors.textMuted }]}>
            By continuing, you agree to our{' '}
            <Text style={[styles.termsLink, { color: colors.textSecondary }]}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={[styles.termsLink, { color: colors.textSecondary }]}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    paddingTop: 60,
  },
  illustrationContainer: {
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  phoneFrame: {
    width: 200,
    height: 280,
    borderRadius: 32,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  phoneNotch: {
    width: 60,
    height: 6,
    borderRadius: 3,
    marginBottom: 20,
  },
  phoneContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dollarCircle: {
    backgroundColor: '#F59E0B',
    zIndex: 1,
  },
  walletCircle: {
    backgroundColor: '#A855F7',
    marginLeft: -20,
    zIndex: 2,
  },
  placeholderLines: {
    width: '80%',
    alignItems: 'flex-start',
  },
  line: {
    height: 8,
    borderRadius: 4,
  },
  floatingIcon: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendIcon: {
    top: 40,
    right: width * 0.15,
    backgroundColor: '#064E3B',
  },
  shieldIcon: {
    left: width * 0.1,
    bottom: 80,
    backgroundColor: '#1E1B4B',
  },
  textContent: {
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
  },
  titleHighlight: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  termsContainer: {
    alignItems: 'center',
  },
  termsText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    textDecorationLine: 'underline',
  },
});
