import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppNavigation } from '../navigation/NavigationContext';
import { colors, spacing, borderRadius, shadows } from '../theme/colors';

export const DoctorDashboardScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const userName = navigation.params.userName || 'Dr. Sarah Mehta';
  const userIdentifier = navigation.params.userIdentifier || 'dr.mehta@aiims.edu';

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
              <Ionicons name="medkit" size={13} color="#0284C7" />
              <Text style={styles.roleTagText}>DOCTOR / CLINICAL PORTAL</Text>
            </View>
            <Text style={styles.welcomeHeading}>Welcome to Astra Ayu</Text>
            <Text style={styles.roleTitle}>Doctor Dashboard</Text>
            <Text style={styles.userSubtitle}>
              Signed in as <Text style={styles.boldText}>{userName}</Text> ({userIdentifier})
            </Text>

            {/* Medical Council License Pill */}
            <View style={styles.licenseBadge}>
              <Ionicons name="ribbon-outline" size={14} color="#0369A1" />
              <Text style={styles.licenseText}>MCI Reg: MCI-2018-88492 • Internal Medicine</Text>
            </View>
          </View>

          {/* Prototype Success Notice */}
          <View style={styles.statusBox}>
            <Ionicons name="checkmark-circle-outline" size={22} color="#0284C7" />
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>Doctor Authentication Verified</Text>
              <Text style={styles.statusDesc}>
                Role-based routing confirmed for Clinical Practitioner. Patient record ingestion and longitudinal timeline views will activate in MVP.
              </Text>
            </View>
          </View>

          {/* Clinical Intelligence Modules */}
          <Text style={styles.sectionHeader}>Upcoming Clinical Intelligence Modules</Text>

          {/* Module 1: Patient Cohort Timeline */}
          <View style={styles.moduleCard}>
            <View style={[styles.moduleIconBox, { backgroundColor: '#F0F9FF' }]}>
              <Ionicons name="git-network-outline" size={24} color="#0284C7" />
            </View>
            <View style={styles.moduleContent}>
              <Text style={styles.moduleTitle}>Longitudinal Health Record Synthesis</Text>
              <Text style={styles.moduleDesc}>
                Aggregate multi-hospital records into an indexed, AI-curated timeline with abnormal trend alerts.
              </Text>
            </View>
          </View>

          {/* Module 2: AI Clinical Summary */}
          <View style={styles.moduleCard}>
            <View style={[styles.moduleIconBox, { backgroundColor: '#F5F3FF' }]}>
              <Ionicons name="analytics-outline" size={24} color="#7C3AED" />
            </View>
            <View style={styles.moduleContent}>
              <Text style={styles.moduleTitle}>AI Differential & Evidence Citation</Text>
              <Text style={styles.moduleDesc}>
                Instant natural-language queries into 10+ years of lab trends with direct source record references.
              </Text>
            </View>
          </View>

          {/* Return to Login Demo Button */}
          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back-outline" size={18} color="#0284C7" />
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
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: spacing.md,
  },
  roleTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
    marginLeft: 5,
    letterSpacing: 0.5,
  },
  welcomeHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0284C7',
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
  licenseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  licenseText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0369A1',
    marginLeft: 6,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
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
    color: '#0369A1',
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
    borderColor: '#0284C7',
    borderRadius: borderRadius.md + 2,
    height: 50,
    marginTop: spacing.lg,
  },
  switchButtonText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0284C7',
    marginLeft: 8,
  },
});
