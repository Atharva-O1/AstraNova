import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../theme/colors';
import { InputField } from './InputField';

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
  defaultIdentifier?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  visible,
  onClose,
  defaultIdentifier = '',
}) => {
  const [identifier, setIdentifier] = useState(defaultIdentifier);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    if (!identifier.trim()) {
      setError('Please enter your registered email or mobile number');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsSubmitting(false);
    setError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={handleClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          {isSuccess ? (
            <View style={styles.successState}>
              <View style={styles.successIconBadge}>
                <Ionicons name="checkmark-circle" size={44} color={colors.success} />
              </View>
              <Text style={styles.title}>Recovery Link Sent</Text>
              <Text style={styles.subtitle}>
                We have dispatched password reset instructions to{' '}
                <Text style={styles.boldText}>{identifier}</Text>. Please check your inbox or SMS.
              </Text>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={handleClose}
                activeOpacity={0.8}
              >
                <Text style={styles.doneButtonText}>Return to Login</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {/* Header Icon */}
              <View style={styles.headerIconBadge}>
                <Ionicons name="key-outline" size={26} color={colors.primary} />
              </View>

              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>
                Enter your registered email address or mobile number to receive a secure recovery verification code.
              </Text>

              <InputField
                label="Registered Contact"
                placeholder="Enter email or mobile number"
                leftIcon="mail-outline"
                value={identifier}
                onChangeText={(val) => {
                  setIdentifier(val);
                  if (error) setError(null);
                }}
                error={error || undefined}
                autoFocus
              />

              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                onPress={handleReset}
                disabled={isSubmitting}
                activeOpacity={0.85}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={colors.textInverse} />
                ) : (
                  <Text style={styles.submitButtonText}>Send Recovery Code</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    ...shadows.card,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    zIndex: 10,
    padding: 4,
  },
  headerIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 13.5,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  boldText: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  submitButton: {
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
    ...shadows.button,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: colors.textInverse,
    fontSize: 15,
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  successState: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  successIconBadge: {
    marginBottom: spacing.md,
  },
  doneButton: {
    marginTop: spacing.md,
    width: '100%',
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    color: colors.textInverse,
    fontSize: 15,
    fontWeight: '700',
  },
});
