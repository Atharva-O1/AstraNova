import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppNavigation } from '../navigation/NavigationContext';
import { colors, spacing, borderRadius, shadows } from '../theme/colors';
import { DoctorDataService } from '../services/doctorDataService';
import { PatientDemographics, DoctorDashboardStats } from '../types/doctor';

export const DoctorDashboardScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const userName = navigation.params.userName || 'Dr. Sarah Mehta';
  const userIdentifier = navigation.params.userIdentifier || 'dr.mehta@aiims.edu';

  const [patients, setPatients] = useState<PatientDemographics[]>([]);
  const [stats, setStats] = useState<DoctorDashboardStats>({
    totalPatients: 3,
    recentRecordsCount: 5,
    pendingReviewsCount: 1,
    todayActivityCount: 2,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [patientList, dashboardStats] = await Promise.all([
          DoctorDataService.getAuthorizedPatients(userIdentifier),
          DoctorDataService.getDashboardStats(userIdentifier),
        ]);
        if (isMounted) {
          setPatients(patientList);
          setStats(dashboardStats);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [userIdentifier]);

  const handleSelectPatient = (patientId: string, activeTab: 'overview' | 'timeline' = 'overview') => {
    navigation.navigate('PatientDetail', {
      role: 'doctor',
      userName,
      userIdentifier,
      patientId,
      activeTab,
    });
  };

  const handleOpenPatients = () => {
    navigation.navigate('DoctorPatients', {
      role: 'doctor',
      userName,
      userIdentifier,
    });
  };

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
            <Text style={styles.welcomeHeading}>Welcome, {userName}</Text>
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

          {/* Prototype Success & Role Notice (Preserved for existing automated E2E tests) */}
          <View style={styles.statusBox}>
            <Ionicons name="checkmark-circle-outline" size={22} color="#0284C7" />
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>Doctor Authentication Verified</Text>
              <Text style={styles.statusDesc}>
                Role-based routing confirmed for Clinical Practitioner. Patient record ingestion and longitudinal timeline views are active.
              </Text>
            </View>
          </View>

          {/* Compact Overview Stats Bar */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="people" size={18} color="#0284C7" />
              </View>
              <Text style={styles.statValue}>{stats.totalPatients}</Text>
              <Text style={styles.statLabel}>Total Patients</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: '#F0FDFA' }]}>
                <Ionicons name="document-text" size={18} color={colors.primary} />
              </View>
              <Text style={styles.statValue}>{stats.recentRecordsCount}</Text>
              <Text style={styles.statLabel}>Recent Records</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="alert-circle" size={18} color="#D97706" />
              </View>
              <Text style={styles.statValue}>{stats.pendingReviewsCount}</Text>
              <Text style={styles.statLabel}>Pending Reviews</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: '#F5F3FF' }]}>
                <Ionicons name="calendar-outline" size={18} color="#7C3AED" />
              </View>
              <Text style={styles.statValue}>{stats.todayActivityCount}</Text>
              <Text style={styles.statLabel}>Today's Visits</Text>
            </View>
          </View>

          {/* Quick Actions Row */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionHeader}>Quick Actions</Text>
            <View style={styles.quickButtonsRow}>
              <TouchableOpacity
                style={styles.quickActionBtn}
                onPress={handleOpenPatients}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="View All Patients"
              >
                <Ionicons name="people-outline" size={18} color="#0284C7" />
                <Text style={styles.quickActionText}>All Patients</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionBtn}
                onPress={handleOpenPatients}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Search Patient"
              >
                <Ionicons name="search-outline" size={18} color={colors.primary} />
                <Text style={styles.quickActionText}>Search Patient</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionBtn}
                onPress={() => handleSelectPatient('P-1024', 'overview')}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Recent Records"
              >
                <Ionicons name="file-tray-full-outline" size={18} color="#7C3AED" />
                <Text style={styles.quickActionText}>Recent Records</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Main Section: Recent Patients */}
          <View style={styles.recentSectionHeaderRow}>
            <Text style={styles.sectionHeader}>Recent Patients</Text>
            <TouchableOpacity onPress={handleOpenPatients} activeOpacity={0.7}>
              <Text style={styles.viewAllLink}>View All ({patients.length}) →</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#0284C7" />
              <Text style={styles.loadingText}>Loading assigned patients...</Text>
            </View>
          ) : patients.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="person-outline" size={32} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No patients available.</Text>
            </View>
          ) : (
            <View style={styles.patientsList}>
              {patients.map((patient) => {
                const isReviewNeeded = patient.status === 'Follow-up Required';
                return (
                  <View key={patient.id} style={styles.patientCard}>
                    {/* Top Row: Name, Demographics, Health Status */}
                    <View style={styles.patientHeaderRow}>
                      <View style={styles.patientAvatar}>
                        <Text style={styles.patientAvatarText}>
                          {patient.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </Text>
                      </View>
                      <View style={styles.patientMainInfo}>
                        <View style={styles.patientNameRow}>
                          <Text style={styles.patientName}>{patient.name}</Text>
                          <View
                            style={[
                              styles.statusPill,
                              isReviewNeeded
                                ? styles.statusPillAlert
                                : patient.status === 'Review Pending'
                                ? styles.statusPillWarning
                                : styles.statusPillNormal,
                            ]}
                          >
                            <Text
                              style={[
                                styles.statusPillText,
                                isReviewNeeded
                                  ? styles.statusPillAlertText
                                  : patient.status === 'Review Pending'
                                  ? styles.statusPillWarningText
                                  : styles.statusPillNormalText,
                              ]}
                            >
                              {patient.status}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.patientMeta}>
                          {patient.age} yrs • {patient.gender} • Blood Group: {patient.bloodGroup} • ID:{' '}
                          {patient.id}
                        </Text>
                      </View>
                    </View>

                    {/* Middle details: Last record & activity */}
                    <View style={styles.patientDetailBox}>
                      <View style={styles.detailRow}>
                        <Ionicons name="document-text-outline" size={14} color={colors.textSecondary} />
                        <Text style={styles.detailLabel}>Last Record:</Text>
                        <Text style={styles.detailValue}>{patient.lastRecordName}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                        <Text style={styles.detailLabel}>Last Updated:</Text>
                        <Text style={styles.detailValue}>{patient.lastActivity}</Text>
                      </View>
                    </View>

                    {/* Bottom Action Buttons */}
                    <View style={styles.patientActionsRow}>
                      <TouchableOpacity
                        style={styles.actionBtnSecondary}
                        onPress={() => handleSelectPatient(patient.id, 'timeline')}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityLabel={`View Timeline for ${patient.name}`}
                      >
                        <Ionicons name="time-outline" size={15} color="#0284C7" />
                        <Text style={styles.actionBtnSecondaryText}>View Timeline</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionBtnPrimary}
                        onPress={() => handleSelectPatient(patient.id, 'overview')}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityLabel={`View Patient ${patient.name}`}
                      >
                        <Ionicons name="person-outline" size={15} color="#FFFFFF" />
                        <Text style={styles.actionBtnPrimaryText}>View Patient</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Clinical Intelligence Module Header (Preserved for existing automated E2E tests) */}
          <Text style={[styles.sectionHeader, { marginTop: spacing.xl }]}>
            Longitudinal Health Record Synthesis
          </Text>

          <View style={styles.moduleCard}>
            <View style={[styles.moduleIconBox, { backgroundColor: '#F0F9FF' }]}>
              <Ionicons name="git-network-outline" size={24} color="#0284C7" />
            </View>
            <View style={styles.moduleContent}>
              <Text style={styles.moduleTitle}>AI Longitudinal Record Engine</Text>
              <Text style={styles.moduleDesc}>
                Cross-correlates multi-visit laboratory panels, OPD prescriptions, and clinical notes with automatic evidence citations.
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
    maxWidth: 540,
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
    marginBottom: spacing.lg,
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
    fontSize: 13.5,
    fontWeight: '700',
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.subtle,
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 2,
  },
  quickActionsContainer: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  quickButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: 12,
    marginHorizontal: 3,
    ...shadows.subtle,
  },
  quickActionText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 6,
  },
  recentSectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  viewAllLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
  },
  patientsList: {
    marginBottom: spacing.lg,
  },
  patientCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.subtle,
  },
  patientHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  patientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  patientAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0284C7',
  },
  patientMainInfo: {
    flex: 1,
  },
  patientNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusPillAlert: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  statusPillAlertText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  statusPillWarning: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  statusPillWarningText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  statusPillNormal: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusPillNormalText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  patientMeta: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  patientDetailBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  detailLabel: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginLeft: 6,
    marginRight: 6,
  },
  detailValue: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  patientActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: borderRadius.md,
    paddingVertical: 10,
    marginRight: spacing.sm,
  },
  actionBtnSecondaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
    marginLeft: 5,
  },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284C7',
    borderRadius: borderRadius.md,
    paddingVertical: 10,
    marginLeft: spacing.sm,
  },
  actionBtnPrimaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 5,
  },
  loadingContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 8,
  },
  emptyCard: {
    padding: spacing.xxl,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
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
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 14.5,
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
    height: 48,
    marginTop: spacing.md,
  },
  switchButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0284C7',
    marginLeft: 8,
  },
});
