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

// Icons
const BackIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const UserIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Circle cx="10" cy="6" r="4" stroke="#6B7280" strokeWidth="1.5" />
    <Path
      d="M3 18C3 14.134 6.134 11 10 11C13.866 11 17 14.134 17 18"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);

const MailIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Rect x="2" y="4" width="16" height="12" rx="2" stroke="#6B7280" strokeWidth="1.5" />
    <Path
      d="M2 6L10 11L18 6"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const PhoneIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path
      d="M3 4.5C3 3.67 3.67 3 4.5 3H7.5C7.78 3 8.03 3.17 8.14 3.43L9.64 6.93C9.76 7.22 9.67 7.55 9.43 7.75L7.73 9.17C8.63 11.02 10.13 12.52 11.98 13.42L13.4 11.72C13.6 11.48 13.93 11.39 14.22 11.51L17.72 13.01C17.98 13.12 18.15 13.37 18.15 13.65V16.65C18.15 17.48 17.48 18.15 16.65 18.15C9.08 17.64 3 11.07 3 4.5Z"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const LockIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Rect x="4" y="9" width="12" height="9" rx="2" stroke="#6B7280" strokeWidth="1.5" />
    <Path
      d="M7 9V6C7 4.34 8.34 3 10 3C11.66 3 13 4.34 13 6V9"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Circle cx="10" cy="13.5" r="1.5" fill="#6B7280" />
  </Svg>
);

const EyeOffIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path
      d="M14.95 14.95C13.52 16.03 11.82 16.67 10 16.67C5.83 16.67 2.27 14.07 1 10.42C1.66 8.44 2.94 6.78 4.62 5.62M8.25 4.37C8.82 4.21 9.4 4.13 10 4.13C14.17 4.13 17.73 6.73 19 10.38C18.6 11.56 17.98 12.63 17.2 13.54"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M1 1L19 19" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
    <Path
      d="M8.23 8.23C7.78 8.68 7.5 9.3 7.5 10C7.5 11.38 8.62 12.5 10 12.5C10.7 12.5 11.32 12.22 11.77 11.77"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);

const EyeIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path
      d="M10 4.17C5.83 4.17 2.27 6.77 1 10.42C2.27 14.07 5.83 16.67 10 16.67C14.17 16.67 17.73 14.07 19 10.42C17.73 6.77 14.17 4.17 10 4.17Z"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="10" cy="10.42" r="2.5" stroke="#6B7280" strokeWidth="1.5" />
  </Svg>
);

const CheckIcon = ({ color }: { color: string }) => (
  <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <Path
      d="M3 7L6 10L11 4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

interface SignUpScreenProps {
  onComplete?: () => void;
  onBack?: () => void;
}

export default function SignUpScreen({ onComplete, onBack }: SignUpScreenProps) {
  const colors = useAppColors();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [currentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const register = useUserStore((s) => s.register);

  const handleSignUp = async () => {
    if (!isFormValid || isSubmitting) return;
    setError(null);
    setIsSubmitting(true);

    try {
      await register(fullName.trim(), email.trim(), phone.trim(), password);
      onComplete?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleSignIn = () => {
    if (onBack) {
      onBack();
    }
  };

  const isFormValid = fullName && email && phone && password && agreeTerms;

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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <BackIcon color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Step Indicator */}
          <View style={styles.stepIndicator}>
            {[1, 2, 3].map((step) => (
              <View
                key={step}
                style={[
                  styles.stepDot,
                  { backgroundColor: colors.border },
                  step === currentStep && [styles.stepDotActive, { backgroundColor: colors.primary }],
                  step < currentStep && { backgroundColor: colors.primary },
                ]}
              />
            ))}
          </View>

          <View style={styles.placeholder} />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.textPrimary }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Join us and take control of your{'\n'}finances with ease.
        </Text>

        {/* Form Card */}
        <View style={[styles.formCard, { backgroundColor: colors.backgroundCard }]}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>FULL NAME</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.backgroundElevated, borderColor: colors.border }]}>
              <UserIcon />
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                placeholder="John Doe"
                placeholderTextColor={colors.textMuted}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>EMAIL ADDRESS</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.backgroundElevated, borderColor: colors.border }]}>
              <MailIcon />
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                placeholder="example@mail.com"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>PHONE NUMBER</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.backgroundElevated, borderColor: colors.border }]}>
              <PhoneIcon />
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                placeholder="+1 (555) 000-0000"
                placeholderTextColor={colors.textMuted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>PASSWORD</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.backgroundElevated, borderColor: colors.border }]}>
              <LockIcon />
              <TextInput
                style={[styles.input, styles.passwordInput, { color: colors.textPrimary }]}
                placeholder="••••••••"
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
          </View>

          {/* Terms Checkbox */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAgreeTerms(!agreeTerms)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, { borderColor: colors.borderLight }, agreeTerms && [styles.checkboxChecked, { backgroundColor: colors.primary, borderColor: colors.primary }]]}>
              {agreeTerms && <CheckIcon color={colors.textPrimary} />}
            </View>
            <Text style={[styles.termsText, { color: colors.textSecondary }]}>
              I agree to the{' '}
              <Text style={[styles.termsLink, { color: colors.primary }]}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={[styles.termsLink, { color: colors.primary }]}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={[styles.signUpButton, !isFormValid && styles.signUpButtonDisabled]}
          onPress={handleSignUp}
          activeOpacity={0.8}
          disabled={!isFormValid || isSubmitting}
        >
          <LinearGradient
            colors={isFormValid ? ['#A855F7', '#9333EA'] : ['#6B7280', '#4B5563']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.signUpGradient}
          >
            <Text style={[styles.signUpText, { color: colors.textPrimary }]}>{isSubmitting ? 'Creating…' : 'Create Account'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {error ? <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text> : null}

        {/* Sign In Link */}
        <View style={styles.signInContainer}>
          <Text style={[styles.signInText, { color: colors.textMuted }]}>Already have an account? </Text>
          <TouchableOpacity onPress={handleSignIn}>
            <Text style={[styles.signInLink, { color: colors.primary }]}>Sign In</Text>
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stepDotActive: {
    width: 24,
  },
  stepDotCompleted: {},

  placeholder: {
    width: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
  formCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {},
  termsText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
  termsLink: {
    fontWeight: '500',
  },
  signUpButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  signUpButtonDisabled: {
    opacity: 0.7,
  },
  signUpGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 13,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
