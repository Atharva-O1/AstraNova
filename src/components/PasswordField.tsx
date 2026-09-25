import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../theme/colors';

interface PasswordFieldProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  error,
  required,
  value,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      {/* Field Label */}
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.requiredAsterisk}>*</Text>}
      </View>

      {/* Input Box */}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          Boolean(error) && styles.inputContainerError,
        ]}
      >
        <Ionicons
          name="lock-closed-outline"
          size={19}
          color={
            Boolean(error)
              ? colors.error
              : isFocused
              ? colors.primary
              : colors.textMuted
          }
          style={styles.leftIcon}
        />

        <TextInput
          style={styles.textInput}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={!isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={value}
          selectionColor={colors.primary}
          autoCapitalize="none"
          autoCorrect={false}
          {...rest}
        />

        {/* Password Visibility Toggle Button */}
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
          style={styles.eyeButton}
        >
          <Ionicons
            name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Validation Error Message */}
      {Boolean(error) && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={14} color={colors.error} style={styles.errorIcon} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  label: {
    fontSize: 13.5,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },
  requiredAsterisk: {
    color: colors.error,
    marginLeft: 3,
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: colors.border,
    borderRadius: borderRadius.md + 2,
    paddingHorizontal: spacing.md,
    height: 50,
  },
  inputContainerFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySubtle,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerError: {
    borderColor: colors.borderError,
    backgroundColor: colors.errorBackground,
  },
  leftIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: 0,
    height: '100%',
  },
  eyeButton: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    paddingHorizontal: 2,
  },
  errorIcon: {
    marginRight: 4,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.error,
  },
});
