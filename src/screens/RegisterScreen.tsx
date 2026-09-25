import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthLayout } from '../components/AuthLayout';
import { BrandHeader } from '../components/BrandHeader';
import { RoleSelector } from '../components/RoleSelector';
import { InputField } from '../components/InputField';
import { PasswordField } from '../components/PasswordField';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAppNavigation } from '../navigation/NavigationContext';
import { UserRole } from '../types/auth';
import { colors, spacing } from '../theme/colors';

export const RegisterScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const initialRole = navigation.params.role || 'patient';

  const [role, setRole] = useState<UserRole>(initialRole);
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Please enter your full name';
    if (!identifier.trim()) errs.identifier = 'Please enter your email or mobile number';
    if (!password) errs.password = 'Please set a secure password';
    if (password && password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'patient') {
        navigation.navigate('PatientDashboard', {
          role: 'patient',
          userIdentifier: identifier.trim(),
          userName: fullName.trim() || 'Aarav Sharma',
        });
      } else {
        navigation.navigate('DoctorDashboard', {
          role: 'doctor',
          userIdentifier: identifier.trim(),
          userName: fullName.trim() || 'Dr. Sarah Mehta',
        });
      }
    }, 800);
  };

  return (
    <AuthLayout
      headerSlot={
        <View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Back to Login"
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
            <Text style={styles.backButtonText}>Back to Sign In</Text>
          </TouchableOpacity>
          <BrandHeader compact />
        </View>
      }
      footerSlot={
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      }
    >
      <View style={styles.introSection}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Join Astra Ayu to unify and query your medical history with AI.
        </Text>
      </View>

      <RoleSelector selectedRole={role} onSelectRole={setRole} />

      <InputField
        label="Full Name"
        placeholder={role === 'patient' ? 'e.g. Aarav Sharma' : 'e.g. Dr. Sarah Mehta'}
        value={fullName}
        onChangeText={(text) => {
          setFullName(text);
          if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
        }}
        error={errors.fullName}
        leftIcon="person-outline"
        autoCapitalize="words"
        required
      />

      <InputField
        label="Email or Mobile Number"
        placeholder="Enter your email or mobile number"
        value={identifier}
        onChangeText={(text) => {
          setIdentifier(text);
          if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: '' }));
        }}
        error={errors.identifier}
        leftIcon="mail-outline"
        keyboardType="email-address"
        required
      />

      <PasswordField
        label="Password"
        placeholder="Create a strong password (min 6 chars)"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
        }}
        error={errors.password}
        required
      />

      <PasswordField
        label="Confirm Password"
        placeholder="Re-enter your password"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
        }}
        error={errors.confirmPassword}
        required
      />

      <PrimaryButton
        title="Create Astra Ayu Account"
        onPress={handleRegister}
        loading={isLoading}
        icon="person-add-outline"
        style={styles.submitButton}
      />
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  introSection: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});
