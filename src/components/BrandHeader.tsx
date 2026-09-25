import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../theme/colors';

interface BrandHeaderProps {
  compact?: boolean;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({ compact = false }) => {
  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      {/* Brand Icon: Minimalist AI + Health Pulse Symbol */}
      <View style={styles.iconWrapper}>
        <View style={styles.iconGlow} />
        <View style={styles.iconBox}>
          {/* Central AI-Medical Node Symbol */}
          <View style={styles.nodeCenter}>
            <Ionicons name="pulse" size={compact ? 20 : 26} color={colors.primary} />
          </View>
          {/* Surrounding Connected Satellite AI Nodes */}
          <View style={[styles.miniNode, styles.nodeTopLeft]} />
          <View style={[styles.miniNode, styles.nodeTopRight]} />
          <View style={[styles.miniNode, styles.nodeBottomRight]} />
        </View>
      </View>

      {/* Brand Title */}
      <View style={styles.titleRow}>
        <Text style={[styles.brandTitle, compact && styles.compactTitle]}>
          ASTRA <Text style={styles.brandTitleAccent}>AYU</Text>
        </Text>
      </View>

      {/* Product Tagline */}
      <Text style={[styles.tagline, compact && styles.compactTagline]}>
        Your Health. Organized. Connected.
      </Text>

      {/* Subtle AI Intelligence Pill */}
      {!compact && (
        <View style={styles.badgeContainer}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>Personal Health Intelligence Platform</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  compactContainer: {
    marginBottom: spacing.lg,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconGlow: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    opacity: 0.6,
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  nodeCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniNode: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
  },
  nodeTopLeft: {
    top: 9,
    left: 11,
    opacity: 0.7,
  },
  nodeTopRight: {
    top: 10,
    right: 11,
    opacity: 0.8,
  },
  nodeBottomRight: {
    bottom: 9,
    right: 12,
    opacity: 0.6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 2.2,
    color: colors.textPrimary,
  },
  compactTitle: {
    fontSize: 22,
    letterSpacing: 1.8,
  },
  brandTitleAccent: {
    color: colors.primary,
  },
  tagline: {
    marginTop: spacing.xs,
    fontSize: 13.5,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  compactTagline: {
    fontSize: 12.5,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primarySubtle,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primaryDark,
    letterSpacing: 0.2,
  },
});
