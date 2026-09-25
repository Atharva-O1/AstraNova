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

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  onClear?: () => void;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  leftIcon,
  onClear,
  required,
  value,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

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
        {leftIcon && (
          <Ionicons
            name={leftIcon}
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
        )}

        <TextInput
          style={styles.textInput}
          placeholderTextColor={colors.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={value}
          selectionColor={colors.primary}
          autoCapitalize="none"
          autoCorrect={false}
          {...rest}
        />

        {Boolean(value && value.length > 0 && onClear && isFocused) && (
          <TouchableOpacity onPress={onClear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
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
    marginBottom: spacing.lg,
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
