import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthLayout } from '../components/AuthLayout';
import { BrandHeader } from '../components/BrandHeader';
import { RoleSelector } from '../components/RoleSelector';
import { InputField } from '../components/InputField';
import { PasswordField } from '../components/PasswordField';
import { PrimaryButton } from '../components/PrimaryButton';
import { ForgotPasswordModal } from '../components/ForgotPasswordModal';
import { useAppNavigation } from '../navigation/NavigationContext';
import { UserRole, LoginFormErrors } from '../types/auth';
import { colors, spacing } from '../theme/colors';

export const LoginScreen: React.FC = () => {
  const navigation = useAppNavigation();

  // State
  const [role, setRole] = useState<UserRole>('patient');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotModalVisible, setIsForgotModalVisible] = useState(false);

  // Client-side validation logic
  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};
    const trimmedId = identifier.trim();

    // Identifier validation
    if (!trimmedId) {
      newErrors.identifier = 'Please enter your email or mobile number';
    } else if (trimmedId.includes('@')) {
      // Email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedId)) {
        newErrors.identifier = 'Please enter a valid email address';
      }
    } else {
      // Check if it's purely digits (mobile)
      const digitsOnly = trimmedId.replace(/[\s-]/g, '');
      if (/^\d+$/.test(digitsOnly) && digitsOnly.length < 10) {
        newErrors.identifier = 'Please enter a valid 10-digit mobile number';
      }
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Please enter your password';
    } else if (password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate authentication delay for realistic UX
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'patient') {
        navigation.navigate('PatientDashboard', {
          role: 'patient',
          userIdentifier: identifier.trim(),
          userName: 'Aarav Sharma',
        });
      } else {
        navigation.navigate('DoctorDashboard', {
          role: 'doctor',
          userIdentifier: identifier.trim(),
          userName: 'Dr. Sarah Mehta',
        });
      }
    }, 850);
  };

  // Helper for SIH quick demo evaluation
  const handleQuickFill = () => {
    if (role === 'patient') {
      setIdentifier('aarav.sharma@health.in');
      setPassword('Patient@2026');
    } else {
      setIdentifier('dr.mehta@aiims.edu');
      setPassword('Doctor@2026');
    }
    setErrors({});
  };

  return (
    <AuthLayout
      headerSlot={<BrandHeader />}
      footerSlot={
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>New to Astra Ayu? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register', { role })}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Create an account"
          >
            <Text style={styles.footerLink}>Create an account</Text>
          </TouchableOpacity>
        </View>
      }
    >
      {/* 2. Welcome Message */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Welcome Back</Text>
        <Text style={styles.welcomeSubtitle}>
          Sign in to securely access your health information.
        </Text>
      </View>

      {/* 3. Role Selection */}
      <RoleSelector selectedRole={role} onSelectRole={setRole} />

      {/* 4. Login Fields */}
      <InputField
        label="Email or Mobile Number"
        placeholder="Enter your email or mobile number"
        value={identifier}
        onChangeText={(text) => {
          setIdentifier(text);
          if (errors.identifier) {
            setErrors((prev) => ({ ...prev, identifier: undefined }));
          }
        }}
        error={errors.identifier}
        leftIcon="mail-outline"
        keyboardType="email-address"
        autoComplete="username"
        onClear={() => setIdentifier('')}
        required
      />

      <PasswordField
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errors.password) {
            setErrors((prev) => ({ ...prev, password: undefined }));
          }
        }}
        error={errors.password}
        autoComplete="password"
        required
      />

      {/* 5. Forgot Password */}
      <View style={styles.forgotPasswordRow}>
        {/* Quick Demo Pre-fill helper */}
        <TouchableOpacity
          onPress={handleQuickFill}
          style={styles.demoPill}
          activeOpacity={0.7}
        >
          <Text style={styles.demoPillText}>Auto-fill Demo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsForgotModalVisible(true)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Forgot Password"
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* 6. Primary Login Button */}
      <PrimaryButton
        title="Login"
        onPress={handleLogin}
        loading={isLoading}
        icon="log-in-outline"
        style={styles.loginButton}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        visible={isForgotModalVisible}
        onClose={() => setIsForgotModalVisible(false)}
        defaultIdentifier={identifier}
      />
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  welcomeSection: {
    marginBottom: spacing.lg,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  forgotPasswordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    marginTop: -2,
  },
  demoPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  demoPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 0.1,
  },
  loginButton: {
    marginTop: spacing.xs,
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
