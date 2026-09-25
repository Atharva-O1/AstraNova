import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppNavigation } from '../navigation/NavigationContext';
import { colors, spacing, borderRadius, shadows } from '../theme/colors';

export const PatientDashboardScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const userName = navigation.params.userName || 'Aarav Sharma';
  const userIdentifier = navigation.params.userIdentifier || 'patient@astraayu.health';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentWrapper}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={styles.brandRow}>
              <View style={styles.logoBadge}>
                <Ionicons name="pulse" size={18} color={colors.primary} />
              </View>
              <Text style={styles.brandName}>
                ASTRA <Text style={styles.brandAccent}>AYU</Text>
              </Text>
            </View>
            <TouchableOpacity
              style={styles.signOutBtn}
              onPress={() => navigation.navigate('Login')}
              accessibilityRole="button"
              accessibilityLabel="Sign Out"
            >
              <Ionicons name="log-out-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>

          {/* Welcome Hero Banner */}
          <View style={styles.heroCard}>
            <View style={styles.roleTag}>
              <Ionicons name="person" size={13} color={colors.primary} />
              <Text style={styles.roleTagText}>PATIENT PORTAL</Text>
            </View>
            <Text style={styles.welcomeHeading}>Welcome to Astra Ayu</Text>
            <Text style={styles.roleTitle}>Patient Dashboard</Text>
            <Text style={styles.userSubtitle}>
              Signed in as <Text style={styles.boldText}>{userName}</Text> ({userIdentifier})
            </Text>

            {/* ABHA / Health ID Pill */}
            <View style={styles.abhaBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#059669" />
              <Text style={styles.abhaText}>ABHA Health ID Linked: 91-4829-1049-5832</Text>
            </View>
          </View>

          {/* Prototype Success Notice */}
          <View style={styles.statusBox}>
            <Ionicons name="checkmark-circle-outline" size={22} color={colors.primary} />
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>Authentication Verified Successfully</Text>
              <Text style={styles.statusDesc}>
                Role-based routing confirmed for Patient. Full health timeline and AI search modules will load here in the MVP release.
              </Text>
            </View>
          </View>

          {/* Platform Preview Modules */}
          <Text style={styles.sectionHeader}>Upcoming Astra Ayu Modules</Text>

          {/* Module 1: Health Timeline */}
          <View style={styles.moduleCard}>
            <View style={[styles.moduleIconBox, { backgroundColor: '#F0FDFA' }]}>
              <Ionicons name="time-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.moduleContent}>
              <Text style={styles.moduleTitle}>Personal Health Timeline</Text>
              <Text style={styles.moduleDesc}>
                Unified chronological records across OPD visits, lab diagnostics, prescriptions, and radiology reports.
              </Text>
            </View>
          </View>

          {/* Module 2: AI Health Query */}
          <View style={styles.moduleCard}>
            <View style={[styles.moduleIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="sparkles-outline" size={24} color="#2563EB" />
            </View>
            <View style={styles.moduleContent}>
              <Text style={styles.moduleTitle}>AI Natural Language Health Search</Text>
              <Text style={styles.moduleDesc}>
                Ask natural questions about past medical history with evidence-backed citations from your actual records.
              </Text>
            </View>
          </View>

          {/* Return to Login Demo Button */}
          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back-outline" size={18} color={colors.primary} />
            <Text style={styles.switchButtonText}>Test Another Role (Back to Login)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 520,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingVertical: spacing.xs,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primarySubtle,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 1.2,
  },
  brandAccent: {
    color: colors.primary,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: borderRadius.sm,
    backgroundColor: '#F1F5F9',
  },
  signOutText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 4,
  },
  heroCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
    marginBottom: spacing.xl,
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    marginBottom: spacing.md,
  },
  roleTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
    marginLeft: 5,
    letterSpacing: 0.5,
  },
  welcomeHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  roleTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    marginVertical: 4,
  },
  userSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  boldText: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  abhaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  abhaText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#065F46',
    marginLeft: 6,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primarySubtle,
    borderWidth: 1,
    borderColor: '#99F6E4',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  statusTextContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  statusDesc: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.subtle,
  },
  moduleIconBox: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  moduleDesc: {
    fontSize: 12.5,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: borderRadius.md + 2,
    height: 50,
    marginTop: spacing.lg,
  },
  switchButtonText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 8,
  },
});
