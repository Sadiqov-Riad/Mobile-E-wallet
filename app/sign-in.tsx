import { useAppColors } from '@/store/theme-store';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { useUserStore } from '@/store/user-store';

const WalletIcon = () => (
  <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
    <Rect x="8" y="14" width="32" height="24" rx="4" fill="#A855F7" opacity="0.3" />
    <Rect x="8" y="14" width="32" height="10" rx="4" fill="#A855F7" />
    <Rect x="12" y="18" width="16" height="2" rx="1" fill="#1a1a2e" opacity="0.5" />
  </Svg>
);


const EyeIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z"
      stroke="#6B7280"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="12.5" r="3" stroke="#6B7280" strokeWidth="2" />
  </Svg>
);


const EyeOffIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17.94 17.94C16.23 19.24 14.18 20 12 20C7 20 2.73 16.89 1 12.5C1.99 10.13 3.66 8.13 5.76 6.76M9.9 5.24C10.59 5.08 11.29 5 12 5C17 5 21.27 8.11 23 12.5C22.42 13.87 21.59 15.09 20.57 16.12"
      stroke="#6B7280"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M1 1L23 23"
      stroke="#6B7280"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M9.88 9.88C9.33 10.43 9 11.18 9 12C9 13.66 10.34 15 12 15C12.82 15 13.57 14.67 14.12 14.12"
      stroke="#6B7280"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

interface SignInScreenProps {
  onComplete?: () => void;
  onSignUp?: () => void;
}

export default function SignInScreen({ onComplete, onSignUp }: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const colors = useAppColors();
  const login = useUserStore((s) => s.login);

  const handleSignIn = async () => {
    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      onComplete?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    //пока нет
  };


  const handleJoinLeo = () => {
    if (onSignUp) {
      onSignUp();
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={[styles.logoBox, { backgroundColor: colors.backgroundCard }]}>
            <WalletIcon />
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.textPrimary }]}>Welcome Back</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Securely access your digital wallet{'\n'}and manage your funds.
        </Text>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { color: colors.textPrimary, backgroundColor: colors.backgroundCard }]}
              placeholder="Email or Phone Number"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput, { color: colors.textPrimary, backgroundColor: colors.backgroundCard }]}
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeIcon /> : <EyeOffIcon />}
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={handleForgotPassword}
          >
            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity
            style={styles.signInButton}
            onPress={handleSignIn}
            activeOpacity={0.8}
            disabled={isSubmitting}
          >
            <LinearGradient
              colors={['#A855F7', '#9333EA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.signInGradient}
            >
              <Text style={[styles.signInText, { color: colors.textPrimary }]}>{isSubmitting ? 'Signing In…' : 'Sign In'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {error ? <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text> : null}
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textMuted }]}>OR LOGIN WITH</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={[styles.signUpText, { color: colors.textMuted }]}>{"Don't have an account? "}</Text>
          <TouchableOpacity onPress={handleJoinLeo}>
            <Text style={[styles.signUpLink, { color: colors.primary }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBox: {
    width: 88,
    height: 88,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  input: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  passwordInput: {
    paddingRight: 56,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  signInButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  signInGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  signInText: {
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 13,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    letterSpacing: 2,
    marginHorizontal: 16,
  },
  biometricsContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  biometricsIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 12,
  },
  biometricsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
