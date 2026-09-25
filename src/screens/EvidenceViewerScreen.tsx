import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppNavigation } from '../navigation/NavigationContext';
import { colors, spacing, borderRadius, shadows } from '../theme/colors';
import { DoctorDataService } from '../services/doctorDataService';
import { MedicalRecord, PatientDemographics } from '../types/doctor';

export const EvidenceViewerScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const userName = navigation.params.userName || 'Dr. Sarah Mehta';
  const userIdentifier = navigation.params.userIdentifier || 'dr.mehta@aiims.edu';
  const patientId = navigation.params.patientId || 'P-1024';
  const recordId = navigation.params.recordId || 'REC-1024-01';
  const highlightText = navigation.params.highlightText;
  const activeTab = navigation.params.activeTab || 'overview';

  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [patient, setPatient] = useState<PatientDemographics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOriginalModal, setShowOriginalModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [recData, patData] = await Promise.all([
          DoctorDataService.getRecordById(recordId, userIdentifier),
          DoctorDataService.getPatientById(patientId, userIdentifier),
        ]);
        if (isMounted) {
          setRecord(recData);
          setPatient(patData);
          setLoading(false);
        }
      } catch (e) {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [recordId, patientId, userIdentifier]);

  const handleBack = () => {
    navigation.navigate('PatientDetail', {
      role: 'doctor',
      userName,
      userIdentifier,
      patientId,
      activeTab,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0284C7" />
          <Text style={styles.loadingTitle}>Loading medical document evidence...</Text>
          <Text style={styles.loadingSub}>Verifying OCR cryptographic hash & audit trail</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!record || !patient) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Ionicons name="document-text-outline" size={48} color={colors.textMuted} />
          <Text style={styles.errorTitle}>Document Not Found</Text>
          <Text style={styles.errorDesc}>The requested clinical document or evidence record could not be located.</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={16} color="#FFFFFF" />
            <Text style={styles.backButtonText}>Return to Patient</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Back to Patient Details"
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Clinical Document & Evidence</Text>
          <Text style={styles.headerSubtitle}>Traceable Medical Record #{record.id}</Text>
        </View>

        <View style={styles.verifiedPill}>
          <Ionicons name="shield-checkmark" size={13} color="#059669" />
          <Text style={styles.verifiedPillText}>Verified</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentWrapper}>
          {/* Document Identity Banner */}
          <View style={styles.identityCard}>
            <View style={styles.identityTypeRow}>
              <View style={styles.typeBadge}>
                <Ionicons
                  name={
                    record.documentType === 'Lab Report'
                      ? 'flask'
                      : record.documentType === 'Prescription'
                      ? 'receipt'
                      : 'document-text'
                  }
                  size={13}
                  color="#0284C7"
                />
                <Text style={styles.typeBadgeText}>{record.documentType}</Text>
              </View>

              <Text style={styles.dateText}>{record.date}</Text>
            </View>

            <Text style={styles.docTitle}>{record.documentName}</Text>
            <Text style={styles.sourceText}>
              Source: <Text style={styles.boldText}>{record.hospital}</Text>
            </Text>
            <Text style={styles.doctorText}>
              Attending / Reporting: <Text style={styles.boldText}>{record.doctor}</Text>
            </Text>
          </View>

          {/* Traceability Metadata Grid */}
          <View style={styles.metaCard}>
            <Text style={styles.cardHeaderSmall}>TRACEABILITY AUDIT METADATA</Text>
            <View style={styles.metaGrid}>
              <View style={styles.metaCol}>
                <Text style={styles.metaKey}>Patient ID</Text>
                <Text style={styles.metaVal}>{patient.id} ({patient.name})</Text>
              </View>
              <View style={styles.metaCol}>
                <Text style={styles.metaKey}>Source Record ID</Text>
                <Text style={styles.metaVal}>{record.id}</Text>
              </View>
              <View style={styles.metaCol}>
                <Text style={styles.metaKey}>Document Date</Text>
                <Text style={styles.metaVal}>{record.date}</Text>
              </View>
              <View style={styles.metaCol}>
                <Text style={styles.metaKey}>Extraction Status</Text>
                <Text style={[styles.metaVal, { color: '#059669' }]}>{record.status}</Text>
              </View>
            </View>
          </View>

          {/* Structured Clinical Parameters (Lab values) */}
          {record.structuredData && (
            <View style={styles.evidenceCard}>
              <View style={styles.evidenceCardHeader}>
                <Ionicons name="bar-chart-outline" size={18} color="#0284C7" />
                <Text style={styles.evidenceCardTitle}>Structured Lab Parameters</Text>
              </View>

              <View style={styles.paramTable}>
                {Object.entries(record.structuredData).map(([key, val], idx) => {
                  const isLow = typeof val === 'string' && (val.includes('10.2') || val.includes('79.0') || val.includes('24.8'));
                  const isHigh = typeof val === 'string' && (val.includes('6.80') || val.includes('7.8') || val.includes('156'));
                  return (
                    <View key={idx} style={[styles.paramRow, idx % 2 === 0 && styles.paramRowEven]}>
                      <Text style={styles.paramKey}>{key}</Text>
                      <View style={styles.paramValRow}>
                        <Text style={[styles.paramVal, (isLow || isHigh) && styles.paramValAbnormal]}>
                          {val}
                        </Text>
                        {isLow && (
                          <View style={styles.flagBadgeLow}>
                            <Text style={styles.flagText}>LOW</Text>
                          </View>
                        )}
                        {isHigh && (
                          <View style={styles.flagBadgeHigh}>
                            <Text style={styles.flagText}>HIGH</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Key Findings Extracted by OCR */}
          <View style={styles.evidenceCard}>
            <View style={styles.evidenceCardHeader}>
              <Ionicons name="checkbox-outline" size={18} color="#0284C7" />
              <Text style={styles.evidenceCardTitle}>Relevant Clinical Evidence</Text>
            </View>

            <View style={styles.findingsBox}>
              {record.keyFindings.map((finding, idx) => (
                <View key={idx} style={styles.findingItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#0284C7" style={styles.findingCheck} />
                  <Text style={styles.findingItemText}>{finding}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Highlighted Raw Extracted Text */}
          <View style={styles.snippetCard}>
            <View style={styles.snippetHeaderRow}>
              <View style={styles.snippetTitleGroup}>
                <Ionicons name="code-working-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.snippetTitle}>Verbatim Extracted OCR Text</Text>
              </View>
              <View style={styles.snippetSourceBadge}>
                <Text style={styles.snippetSourceBadgeText}>Page {record.pageNumber || 1}</Text>
              </View>
            </View>

            <Text style={styles.snippetText}>{record.extractedText}</Text>
          </View>

          {/* Original Simulated Document Canvas */}
          <View style={styles.documentPreviewContainer}>
            <View style={styles.previewHeaderRow}>
              <View style={styles.previewTitleRow}>
                <Ionicons name="document-attach-outline" size={18} color="#0F172A" />
                <Text style={styles.previewHeaderTitle}>Original Document Preview</Text>
              </View>
              <View style={styles.auditBadge}>
                <Text style={styles.auditBadgeText}>EHR Verified</Text>
              </View>
            </View>

            {/* Document Paper Mockup */}
            <View style={styles.paperSheet}>
              {/* Document Letterhead */}
              <View style={styles.paperHeader}>
                <View>
                  <Text style={styles.paperHospitalName}>{record.hospital.toUpperCase()}</Text>
                  <Text style={styles.paperHospitalDept}>Department of Diagnostic Pathology & Clinical Medicine</Text>
                  <Text style={styles.paperHospitalAddress}>Accreditation: NABL & NABH Certified Laboratory</Text>
                </View>
                <Ionicons name="pulse" size={32} color="#0284C7" />
              </View>

              <View style={styles.paperDivider} />

              {/* Patient Bar in Doc */}
              <View style={styles.paperPatientBar}>
                <View style={styles.paperPatientCol}>
                  <Text style={styles.paperLabel}>Patient: <Text style={styles.paperBold}>{patient.name}</Text></Text>
                  <Text style={styles.paperLabel}>Age/Sex: {patient.age} Y / {patient.gender}</Text>
                </View>
                <View style={styles.paperPatientCol}>
                  <Text style={styles.paperLabel}>UHID: {patient.id}</Text>
                  <Text style={styles.paperLabel}>Report Date: {record.date}</Text>
                </View>
              </View>

              <View style={styles.paperDividerLight} />

              <Text style={styles.paperReportName}>{record.documentName}</Text>

              {/* Document Text Body */}
              <Text style={styles.paperBodyText}>{record.extractedText}</Text>

              {/* Doctor Sign-off Stamp */}
              <View style={styles.paperSignoff}>
                <View style={styles.signStamp}>
                  <Text style={styles.signStampText}>DIGITALLY SIGNED & VERIFIED</Text>
                  <Text style={styles.signStampSub}>MCI COUNCIL APPROVED</Text>
                </View>
                <View style={styles.doctorSignBlock}>
                  <Text style={styles.doctorSignName}>{record.doctor}</Text>
                  <Text style={styles.doctorSignTitle}>Consultant Pathologist</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Row */}
          <View style={styles.bottomActions}>
            <TouchableOpacity
              style={styles.returnButton}
              onPress={handleBack}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Return to Patient Profile"
            >
              <Ionicons name="arrow-back" size={16} color="#FFFFFF" />
              <Text style={styles.returnButtonText}>Return to Patient Profile</Text>
            </TouchableOpacity>
          </View>
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
  backBtn: {
    padding: 6,
    borderRadius: borderRadius.sm,
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: colors.textSecondary,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  verifiedPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#065F46',
    marginLeft: 4,
  },
  scrollContainer: {
    padding: spacing.md,
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 540,
  },
  identityCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  identityTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  docTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginVertical: 4,
  },
  sourceText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  doctorText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  boldText: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  metaCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  cardHeaderSmall: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metaCol: {
    width: '48%',
    marginBottom: 6,
  },
  metaKey: {
    fontSize: 11,
    color: colors.textMuted,
  },
  metaVal: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 1,
  },
  evidenceCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.subtle,
  },
  evidenceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  evidenceCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: 6,
  },
  paramTable: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  paramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  paramRowEven: {
    backgroundColor: '#F8FAFC',
  },
  paramKey: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  paramValRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paramVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  paramValAbnormal: {
    color: '#DC2626',
  },
  flagBadgeLow: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  flagBadgeHigh: {
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  flagText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#DC2626',
  },
  findingsBox: {
    marginTop: 2,
  },
  findingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  findingCheck: {
    marginTop: 2,
    marginRight: 8,
  },
  findingItemText: {
    fontSize: 13,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 18,
  },
  snippetCard: {
    backgroundColor: '#0F172A',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  snippetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 6,
  },
  snippetTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  snippetTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginLeft: 6,
  },
  snippetSourceBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  snippetSourceBadgeText: {
    fontSize: 10.5,
    color: '#38BDF8',
    fontWeight: '700',
  },
  snippetText: {
    fontSize: 12,
    color: '#F1F5F9',
    lineHeight: 18,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  documentPreviewContainer: {
    marginBottom: spacing.lg,
  },
  previewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  previewTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: 6,
  },
  auditBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  auditBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
  },
  paperSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.sm,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    ...shadows.card,
  },
  paperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  paperHospitalName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.8,
  },
  paperHospitalDept: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#0284C7',
    marginTop: 2,
  },
  paperHospitalAddress: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  paperDivider: {
    height: 2,
    backgroundColor: '#0284C7',
    marginVertical: 6,
  },
  paperDividerLight: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 6,
  },
  paperPatientBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paperPatientCol: {
    flex: 1,
  },
  paperLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginVertical: 1,
  },
  paperBold: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  paperReportName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginVertical: 8,
    textDecorationLine: 'underline',
  },
  paperBodyText: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    backgroundColor: '#F8FAFC',
    padding: spacing.sm,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  paperSignoff: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  signStamp: {
    borderWidth: 1.5,
    borderColor: '#0284C7',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  signStampText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  signStampSub: {
    fontSize: 7.5,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  doctorSignBlock: {
    alignItems: 'flex-end',
  },
  doctorSignName: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  doctorSignTitle: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  bottomActions: {
    marginVertical: spacing.md,
  },
  returnButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284C7',
    borderRadius: borderRadius.md,
    height: 48,
    ...shadows.button,
  },
  returnButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  loadingSub: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 4,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.error,
    marginTop: spacing.md,
  },
  errorDesc: {
    fontSize: 13.5,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: spacing.lg,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 6,
  },
});
