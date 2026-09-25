import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppNavigation } from '../navigation/NavigationContext';
import { colors, spacing, borderRadius, shadows } from '../theme/colors';
import { DoctorDataService } from '../services/doctorDataService';
import { PatientDemographics } from '../types/doctor';

export const DoctorPatientsScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const userName = navigation.params.userName || 'Dr. Sarah Mehta';
  const userIdentifier = navigation.params.userIdentifier || 'dr.mehta@aiims.edu';

  const [patients, setPatients] = useState<PatientDemographics[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadPatients() {
      try {
        const list = await DoctorDataService.getAuthorizedPatients(userIdentifier);
        if (isMounted) {
          setPatients(list);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) setLoading(false);
      }
    }
    loadPatients();
    return () => {
      isMounted = false;
    };
  }, [userIdentifier]);

  const filteredPatients = patients.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.bloodGroup.toLowerCase().includes(q) ||
      p.lastRecordName.toLowerCase().includes(q);

    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'FOLLOW_UP' && p.status === 'Follow-up Required') ||
      (filterStatus === 'STABLE' && p.status === 'Stable') ||
      (filterStatus === 'PENDING' && p.status === 'Review Pending');

    return matchesSearch && matchesStatus;
  });

  const handleOpenPatient = (patientId: string, activeTab: 'overview' | 'timeline' | 'ai-search' = 'overview') => {
    navigation.navigate('PatientDetail', {
      role: 'doctor',
      userName,
      userIdentifier,
      patientId,
      activeTab,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.navigate('DoctorDashboard', { role: 'doctor', userName, userIdentifier })}
            accessibilityRole="button"
            accessibilityLabel="Back to Dashboard"
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Patients</Text>
            <Text style={styles.headerSubtitle}>Authorized Clinical Cohort</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.dashboardPill}
          onPress={() => navigation.navigate('DoctorDashboard', { role: 'doctor', userName, userIdentifier })}
        >
          <Ionicons name="grid-outline" size={14} color="#0284C7" />
          <Text style={styles.dashboardPillText}>Dashboard</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.contentWrapper}>
          {/* Search Box */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search patients by name or ID (e.g. Rahul, P-1024)..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Quick Filter Chips */}
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterChip, filterStatus === 'ALL' && styles.filterChipActive]}
              onPress={() => setFilterStatus('ALL')}
            >
              <Text style={[styles.filterChipText, filterStatus === 'ALL' && styles.filterChipTextActive]}>
                All ({patients.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, filterStatus === 'FOLLOW_UP' && styles.filterChipActive]}
              onPress={() => setFilterStatus('FOLLOW_UP')}
            >
              <Text style={[styles.filterChipText, filterStatus === 'FOLLOW_UP' && styles.filterChipTextActive]}>
                Follow-up Required
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, filterStatus === 'STABLE' && styles.filterChipActive]}
              onPress={() => setFilterStatus('STABLE')}
            >
              <Text style={[styles.filterChipText, filterStatus === 'STABLE' && styles.filterChipTextActive]}>
                Stable
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, filterStatus === 'PENDING' && styles.filterChipActive]}
              onPress={() => setFilterStatus('PENDING')}
            >
              <Text style={[styles.filterChipText, filterStatus === 'PENDING' && styles.filterChipTextActive]}>
                Review Pending
              </Text>
            </TouchableOpacity>
          </View>

          {/* Patient Count Indicator */}
          <View style={styles.countRow}>
            <Text style={styles.countText}>
              Showing <Text style={styles.countBold}>{filteredPatients.length}</Text> authorized patient
              {filteredPatients.length === 1 ? '' : 's'}
            </Text>
          </View>

          {/* List or States */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#0284C7" />
              <Text style={styles.loadingText}>Fetching patient registry...</Text>
            </View>
          ) : filteredPatients.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="search-outline" size={36} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No patients found</Text>
              <Text style={styles.emptyDesc}>
                {searchQuery
                  ? `No matching records found for "${searchQuery}". Check patient ID or name spelling.`
                  : 'No patients in this category.'}
              </Text>
              {searchQuery ? (
                <TouchableOpacity style={styles.clearBtn} onPress={() => setSearchQuery('')}>
                  <Text style={styles.clearBtnText}>Clear Search Query</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : (
            <View style={styles.listContainer}>
              {filteredPatients.map((patient) => {
                const isReviewNeeded = patient.status === 'Follow-up Required';
                return (
                  <View key={patient.id} style={styles.patientCard}>
                    <View style={styles.cardHeader}>
                      <View style={styles.avatarBox}>
                        <Text style={styles.avatarInitials}>
                          {patient.name
                            .split(' ')
                            .map((p) => p[0])
                            .join('')}
                        </Text>
                      </View>

                      <View style={styles.headerInfo}>
                        <View style={styles.titleRow}>
                          <Text style={styles.patientName}>{patient.name}</Text>
                          <View style={styles.idBadge}>
                            <Text style={styles.idBadgeText}>{patient.id}</Text>
                          </View>
                        </View>
                        <Text style={styles.demographicText}>
                          {patient.age} yrs • {patient.gender} • Blood Group {patient.bloodGroup}
                        </Text>
                      </View>
                    </View>

                    {/* Meta info: Last activity & Record */}
                    <View style={styles.metaBox}>
                      <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
                        <Text style={styles.metaLabel}>Last Activity:</Text>
                        <Text style={styles.metaValue}>{patient.lastActivity}</Text>
                      </View>

                      <View style={styles.metaItem}>
                        <Ionicons name="document-text-outline" size={13} color={colors.textSecondary} />
                        <Text style={styles.metaLabel}>Last Record:</Text>
                        <Text style={styles.metaValue}>{patient.lastRecordName}</Text>
                      </View>
                    </View>

                    {/* Status Pill & Action Buttons */}
                    <View style={styles.cardFooter}>
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

                      <View style={styles.footerActions}>
                        <TouchableOpacity
                          style={styles.aiActionBtn}
                          onPress={() => handleOpenPatient(patient.id, 'ai-search')}
                          activeOpacity={0.8}
                          accessibilityLabel={`AI Search for ${patient.name}`}
                        >
                          <Ionicons name="sparkles" size={13} color="#0284C7" />
                          <Text style={styles.aiActionText}>Ask AI</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.viewProfileBtn}
                          onPress={() => handleOpenPatient(patient.id, 'overview')}
                          activeOpacity={0.8}
                          accessibilityLabel={`View ${patient.name}`}
                        >
                          <Text style={styles.viewProfileBtnText}>View</Text>
                          <Ionicons name="chevron-forward" size={15} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    padding: 6,
    marginRight: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dashboardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  dashboardPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
    marginLeft: 4,
  },
  scrollContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 540,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 46,
    marginBottom: spacing.md,
    ...shadows.subtle,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: colors.textPrimary,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 6,
    marginBottom: 6,
  },
  filterChipActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  countRow: {
    marginBottom: spacing.md,
  },
  countText: {
    fontSize: 12.5,
    color: colors.textSecondary,
  },
  countBold: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  listContainer: {
    width: '100%',
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarBox: {
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
  avatarInitials: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0284C7',
  },
  headerInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  idBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  idBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  demographicText: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  metaBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  metaLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 5,
    marginRight: 4,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: spacing.sm,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  statusPillText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  statusPillAlert: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  statusPillAlertText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#DC2626',
  },
  statusPillWarning: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  statusPillWarningText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#D97706',
  },
  statusPillNormal: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusPillNormalText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#059669',
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    marginRight: 8,
  },
  aiActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
    marginLeft: 4,
  },
  viewProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  viewProfileBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 2,
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
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 10,
  },
  emptyDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
    maxWidth: 320,
  },
  clearBtn: {
    marginTop: spacing.md,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  clearBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0284C7',
  },
});
