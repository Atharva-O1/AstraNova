import React, { ReactNode } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, borderRadius, shadows } from '../theme/colors';

interface AuthLayoutProps {
  children: ReactNode;
  headerSlot?: ReactNode;
  footerSlot?: ReactNode;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_DESKTOP_OR_TABLET = SCREEN_WIDTH > 540;

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  headerSlot,
  footerSlot,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Centering wrapper for tablet/desktop preview */}
          <View style={styles.outerCenter}>
            <View style={[styles.cardContainer, IS_DESKTOP_OR_TABLET && styles.cardContainerLarge]}>
              {headerSlot && <View style={styles.headerArea}>{headerSlot}</View>}

              <View style={styles.contentArea}>{children}</View>

              {footerSlot && <View style={styles.footerArea}>{footerSlot}</View>}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  outerCenter: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxxl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  cardContainerLarge: {
    marginVertical: spacing.lg,
  },
  headerArea: {
    marginBottom: spacing.md,
  },
  contentArea: {
    width: '100%',
  },
  footerArea: {
    marginTop: spacing.xl,
  },
});
