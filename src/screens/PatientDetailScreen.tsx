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
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppNavigation } from '../navigation/NavigationContext';
import { colors, spacing, borderRadius, shadows } from '../theme/colors';
import { DoctorDataService } from '../services/doctorDataService';
import { AIService } from '../services/aiService';
import {
  PatientDemographics,
  TimelineEvent,
  MedicalRecord,
  AISearchResult,
} from '../types/doctor';
import { PatientDetailTab } from '../types/auth';

export const PatientDetailScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const userName = navigation.params.userName || 'Dr. Sarah Mehta';
  const userIdentifier = navigation.params.userIdentifier || 'dr.mehta@aiims.edu';
  const patientId = navigation.params.patientId || 'P-1024';

  // Active Tab state
  const [activeTab, setActiveTab] = useState<PatientDetailTab>(
    navigation.params.activeTab || 'overview'
  );

  // Data states
  const [patient, setPatient] = useState<PatientDemographics | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // AI Search states
  const [aiQuery, setAiQuery] = useState(navigation.params.searchQuery || '');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AISearchResult | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load Patient Data
  useEffect(() => {
    let isMounted = true;
    async function fetchPatientData() {
      setLoading(true);
      setError(null);
      try {
        const [patData, timelineData, recordsData] = await Promise.all([
          DoctorDataService.getPatientById(patientId, userIdentifier),
          DoctorDataService.getPatientTimeline(patientId, userIdentifier),
          DoctorDataService.getPatientRecords(patientId, userIdentifier),
        ]);

        if (isMounted) {
          if (!patData) {
            setError(`Patient with ID "${patientId}" was not found or is not authorized.`);
          } else {
            setPatient(patData);
            setTimelineEvents(timelineData);
            setRecords(recordsData);
          }
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Error retrieving patient clinical records.');
          setLoading(false);
        }
      }
    }

    fetchPatientData();
    return () => {
      isMounted = false;
    };
  }, [patientId, userIdentifier]);

  // Handle Tab Switch
  const handleTabChange = (tab: PatientDetailTab) => {
    setActiveTab(tab);
  };

  // Handle AI Search Execution
  const handleRunAISearch = async (queryText?: string) => {
    const textToSearch = (queryText !== undefined ? queryText : aiQuery).trim();
    if (!textToSearch) return;

    if (queryText !== undefined) {
      setAiQuery(queryText);
    }

    setAiLoading(true);
    try {
      const result = await AIService.searchPatientHistory(patientId, textToSearch, userIdentifier);
      setAiResult(result);
      if (!searchHistory.includes(textToSearch)) {
        setSearchHistory((prev) => [textToSearch, ...prev.slice(0, 3)]);
      }
    } catch (err) {
      setAiResult({
        query: textToSearch,
        patientId,
        patientName: patient?.name || 'Patient',
        answer: 'An error occurred while synthesizing clinical records. Please try again.',
        confidence: 0,
        hasEvidence: false,
        evidence: null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } finally {
      setAiLoading(false);
    }
  };

  // Navigate to Evidence / Document Viewer
  const handleOpenEvidence = (recordId: string, highlightText?: string) => {
    navigation.navigate('EvidenceViewer', {
      role: 'doctor',
      userName,
      userIdentifier,
      patientId,
      recordId,
      highlightText,
      sourceScreen: 'PatientDetail',
      activeTab,
    });
  };

  // Back Navigation
  const handleGoBack = () => {
    navigation.navigate('DoctorPatients', {
      role: 'doctor',
      userName,
      userIdentifier,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0284C7" />
          <Text style={styles.loadingMainText}>Loading patient medical history...</Text>
          <Text style={styles.loadingSubText}>Retrieving verified clinical records & telemetry</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !patient) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={styles.errorTitle}>Access Error</Text>
          <Text style={styles.errorDesc}>{error || 'Patient records not found.'}</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={16} color="#FFFFFF" />
            <Text style={styles.backButtonText}>Return to Patients</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Pre-calculate medicines from records
  const allPrescribedMedicines = records
    .filter((r) => r.medicines && r.medicines.length > 0)
    .flatMap((r) => r.medicines || []);

  const isFollowUp = patient.status === 'Follow-up Required';

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header Bar */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.navBackBtn}
          onPress={handleGoBack}
          accessibilityRole="button"
          accessibilityLabel="Back to Patient List"
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.topHeaderCenter}>
          <Text style={styles.topHeaderTitle} numberOfLines={1}>
            {patient.name}
          </Text>
          <Text style={styles.topHeaderSubtitle}>ID: {patient.id}</Text>
        </View>

        <TouchableOpacity
          style={styles.quickAiBtn}
          onPress={() => setActiveTab('ai-search')}
          accessibilityRole="button"
          accessibilityLabel="Open AI Search"
        >
          <Ionicons name="sparkles" size={16} color="#0284C7" />
          <Text style={styles.quickAiText}>Ask AI</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.contentWrapper}>
          {/* Patient Profile Card (Sticky / Permanent Context) */}
          <View style={styles.profileCard}>
            <View style={styles.profileTopRow}>
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarLargeText}>
                  {patient.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </Text>
              </View>

              <View style={styles.profileMain}>
                <View style={styles.nameAndStatusRow}>
                  <Text style={styles.profileName}>{patient.name}</Text>
                  <View
                    style={[
                      styles.statusPill,
                      isFollowUp
                        ? styles.statusPillAlert
                        : patient.status === 'Review Pending'
                        ? styles.statusPillWarning
                        : styles.statusPillNormal,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        isFollowUp
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

                <Text style={styles.profileDemographics}>
                  Patient ID: <Text style={styles.boldText}>{patient.id}</Text> • {patient.age} years •{' '}
                  {patient.gender} • Blood: <Text style={styles.boldText}>{patient.bloodGroup}</Text>
                </Text>

                <View style={styles.abhaPill}>
                  <Ionicons name="shield-checkmark" size={13} color="#059669" />
                  <Text style={styles.abhaText}>ABHA: {patient.abhaId}</Text>
                </View>
              </View>
            </View>

            {/* Vitals Summary Strip */}
            {patient.vitals && (
              <View style={styles.vitalsStrip}>
                <View style={styles.vitalItem}>
                  <Text style={styles.vitalLabel}>BP</Text>
                  <Text style={styles.vitalValue}>{patient.vitals.bloodPressure || '120/80'}</Text>
                </View>
                <View style={styles.vitalDivider} />
                <View style={styles.vitalItem}>
                  <Text style={styles.vitalLabel}>Pulse</Text>
                  <Text style={styles.vitalValue}>{patient.vitals.pulseRate || '76 bpm'}</Text>
                </View>
                <View style={styles.vitalDivider} />
                <View style={styles.vitalItem}>
                  <Text style={styles.vitalLabel}>SpO2</Text>
                  <Text style={styles.vitalValue}>{patient.vitals.oxygenSaturation || '98%'}</Text>
                </View>
                <View style={styles.vitalDivider} />
                <View style={styles.vitalItem}>
                  <Text style={styles.vitalLabel}>Weight</Text>
                  <Text style={styles.vitalValue}>{patient.vitals.weightKg} kg</Text>
                </View>
              </View>
            )}
          </View>

          {/* Tab Navigation Segmented Bar */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'overview' && styles.tabButtonActive]}
              onPress={() => handleTabChange('overview')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="document-text-outline"
                size={16}
                color={activeTab === 'overview' ? '#0284C7' : colors.textSecondary}
              />
              <Text style={[styles.tabButtonText, activeTab === 'overview' && styles.tabButtonTextActive]}>
                Overview
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'timeline' && styles.tabButtonActive]}
              onPress={() => handleTabChange('timeline')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="time-outline"
                size={16}
                color={activeTab === 'timeline' ? '#0284C7' : colors.textSecondary}
              />
              <Text style={[styles.tabButtonText, activeTab === 'timeline' && styles.tabButtonTextActive]}>
                Timeline
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'ai-search' && styles.tabButtonActive]}
              onPress={() => handleTabChange('ai-search')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="sparkles"
                size={16}
                color={activeTab === 'ai-search' ? '#0284C7' : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'ai-search' && styles.tabButtonTextActive,
                ]}
              >
                AI Search
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'records' && styles.tabButtonActive]}
              onPress={() => handleTabChange('records')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="folder-open-outline"
                size={16}
                color={activeTab === 'records' ? '#0284C7' : colors.textSecondary}
              />
              <Text style={[styles.tabButtonText, activeTab === 'records' && styles.tabButtonTextActive]}>
                Records
              </Text>
            </TouchableOpacity>
          </View>

          {/* ========================================================================= */}
          {/* TAB 1: CASE SUMMARY / PATIENT OVERVIEW                                    */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <View style={styles.tabContent}>
              {/* Grounding Notice: Distinguish verified data vs AI interpretation */}
              <View style={styles.groundingBanner}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#0369A1" />
                <View style={styles.groundingTextCol}>
                  <Text style={styles.groundingTitle}>Case Summary & Clinical Synthesis</Text>
                  <Text style={styles.groundingSubtitle}>
                    Structured synthesis extracted directly from {patient.name}'s verified medical records.
                  </Text>
                </View>
              </View>

              {/* 1. Patient Clinical Overview */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="person-circle-outline" size={18} color="#0284C7" />
                  <Text style={styles.sectionCardTitle}>Patient Overview</Text>
                </View>

                <View style={styles.infoGrid}>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoItemLabel}>Blood Group</Text>
                    <Text style={styles.infoItemValue}>{patient.bloodGroup}</Text>
                  </View>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoItemLabel}>Allergies</Text>
                    <Text style={[styles.infoItemValue, { color: '#DC2626' }]}>
                      {patient.allergies.length > 0 ? patient.allergies.join(', ') : 'None documented'}
                    </Text>
                  </View>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoItemLabel}>Chronic Conditions</Text>
                    <Text style={styles.infoItemValue}>
                      {patient.chronicConditions.join(', ') || 'None documented'}
                    </Text>
                  </View>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoItemLabel}>Primary Physician</Text>
                    <Text style={styles.infoItemValue}>{userName}</Text>
                  </View>
                </View>
              </View>

              {/* 2. Recent Medical History */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="pulse-outline" size={18} color="#0284C7" />
                  <Text style={styles.sectionCardTitle}>Recent Medical History</Text>
                </View>

                <View style={styles.historyList}>
                  <View style={styles.historyItem}>
                    <View style={styles.historyDot} />
                    <View style={styles.historyContent}>
                      <Text style={styles.historyDate}>12 March 2026</Text>
                      <Text style={styles.historyTitle}>Laboratory CBC Blood Panel Completed</Text>
                      <Text style={styles.historyDesc}>
                        Hemoglobin measured at 10.2 g/dL with microcytic red blood cell indices.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.historyItem}>
                    <View style={styles.historyDot} />
                    <View style={styles.historyContent}>
                      <Text style={styles.historyDate}>05 March 2026</Text>
                      <Text style={styles.historyTitle}>Outpatient Consultation — City Hospital</Text>
                      <Text style={styles.historyDesc}>
                        Presented with 3 weeks of exertional fatigue, pallor, and mild dizziness. Empirical iron supplements initiated.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* 3. Recent Findings (Extracted from Clinical Reports) */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="analytics-outline" size={18} color="#0284C7" />
                  <Text style={styles.sectionCardTitle}>Recent Clinical Findings</Text>
                  <View style={styles.extractedBadge}>
                    <Text style={styles.extractedBadgeText}>OCR Extracted</Text>
                  </View>
                </View>

                <View style={styles.findingsList}>
                  {records[0]?.keyFindings.map((finding, idx) => (
                    <View key={idx} style={styles.findingRow}>
                      <Ionicons name="checkmark-circle" size={15} color="#0284C7" style={styles.findingIcon} />
                      <Text style={styles.findingText}>{finding}</Text>
                    </View>
                  ))}
                </View>

                {/* AI Interpretation Box */}
                <View style={styles.aiInterpretationBox}>
                  <View style={styles.aiInterpHeader}>
                    <Ionicons name="sparkles" size={14} color="#7C3AED" />
                    <Text style={styles.aiInterpTitle}>AI Clinical Synthesis (Interpretative)</Text>
                  </View>
                  <Text style={styles.aiInterpText}>
                    Laboratory markers correlate with nutritional iron deficiency anemia. Response to oral iron therapy should be monitored at the 4-week mark with repeat CBC and serum ferritin.
                  </Text>
                </View>
              </View>

              {/* 4. Current Medicines (Only show when medicines exist in records) */}
              {allPrescribedMedicines.length > 0 && (
                <View style={styles.sectionCard}>
                  <View style={styles.sectionTitleRow}>
                    <Ionicons name="medkit-outline" size={18} color="#0284C7" />
                    <Text style={styles.sectionCardTitle}>Current Medicines</Text>
                    <View style={styles.activeRxBadge}>
                      <Text style={styles.activeRxBadgeText}>Active Prescription</Text>
                    </View>
                  </View>

                  <View style={styles.medicinesList}>
                    {allPrescribedMedicines.map((med, idx) => (
                      <View key={idx} style={styles.medicineCard}>
                        <View style={styles.medicineTopRow}>
                          <Text style={styles.medicineName}>{med.name}</Text>
                          <Text style={styles.medicineDosage}>{med.dosage}</Text>
                        </View>
                        <View style={styles.medicineDetailRow}>
                          <Text style={styles.medicineFreq}>
                            {med.frequency} • {med.duration}
                          </Text>
                        </View>
                        <Text style={styles.medicinePurpose}>{med.purpose}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* 5. Important Records */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="folder-outline" size={18} color="#0284C7" />
                  <Text style={styles.sectionCardTitle}>Important Records</Text>
                </View>

                <View style={styles.recordsList}>
                  {records.map((rec) => (
                    <TouchableOpacity
                      key={rec.id}
                      style={styles.recordRowItem}
                      onPress={() => handleOpenEvidence(rec.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.recordItemIcon}>
                        <Ionicons
                          name={rec.documentType === 'Lab Report' ? 'flask-outline' : 'document-text-outline'}
                          size={18}
                          color="#0284C7"
                        />
                      </View>
                      <View style={styles.recordItemInfo}>
                        <Text style={styles.recordItemName}>{rec.documentName}</Text>
                        <Text style={styles.recordItemMeta}>
                          {rec.documentType} • {rec.date} • {rec.hospital}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* 6. Last Updated Footer */}
              <View style={styles.lastUpdatedBox}>
                <Ionicons name="refresh-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.lastUpdatedText}>
                  Medical history last updated on <Text style={styles.boldText}>{patient.lastActivity}</Text>
                </Text>
              </View>

              {/* Jump to AI Search CTA */}
              <TouchableOpacity
                style={styles.aiCtaButton}
                onPress={() => setActiveTab('ai-search')}
                activeOpacity={0.8}
              >
                <Ionicons name="sparkles" size={18} color="#FFFFFF" />
                <Text style={styles.aiCtaButtonText}>Ask AI About {patient.name}'s Medical History</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: HEALTH TIMELINE                                                    */}
          {/* ========================================================================= */}
          {activeTab === 'timeline' && (
            <View style={styles.tabContent}>
              <View style={styles.timelineHeaderRow}>
                <View>
                  <Text style={styles.tabHeading}>Chronological Health Timeline</Text>
                  <Text style={styles.tabSubheading}>
                    Longitudinal synthesis of lab reports, visits, and prescriptions
                  </Text>
                </View>
              </View>

              {timelineEvents.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Ionicons name="time-outline" size={36} color={colors.textMuted} />
                  <Text style={styles.emptyTitle}>No timeline events available.</Text>
                </View>
              ) : (
                <View style={styles.timelineContainer}>
                  {timelineEvents.map((event, index) => {
                    const isReport = event.type === 'report';
                    const isVisit = event.type === 'visit';
                    const isRx = event.type === 'prescription';
                    const isLast = index === timelineEvents.length - 1;

                    return (
                      <View key={event.id} style={styles.timelineItemRow}>
                        {/* Timeline Marker Column */}
                        <View style={styles.markerColumn}>
                          <View
                            style={[
                              styles.markerDot,
                              isReport && { backgroundColor: '#0284C7' },
                              isVisit && { backgroundColor: '#7C3AED' },
                              isRx && { backgroundColor: '#059669' },
                            ]}
                          >
                            <Ionicons
                              name={
                                isReport ? 'flask' : isVisit ? 'medical' : 'receipt'
                              }
                              size={12}
                              color="#FFFFFF"
                            />
                          </View>
                          {!isLast && <View style={styles.markerLine} />}
                        </View>

                        {/* Event Card */}
                        <View style={styles.eventCard}>
                          <View style={styles.eventHeaderRow}>
                            <View style={styles.eventDateBadge}>
                              <Ionicons name="calendar-outline" size={12} color="#0284C7" />
                              <Text style={styles.eventDateText}>{event.date}</Text>
                            </View>

                            <View
                              style={[
                                styles.eventTypeBadge,
                                isReport && { backgroundColor: '#E0F2FE' },
                                isVisit && { backgroundColor: '#F5F3FF' },
                                isRx && { backgroundColor: '#ECFDF5' },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.eventTypeText,
                                  isReport && { color: '#0369A1' },
                                  isVisit && { color: '#6D28D9' },
                                  isRx && { color: '#047857' },
                                ]}
                              >
                                {event.badgeLabel || event.type}
                              </Text>
                            </View>
                          </View>

                          <Text style={styles.eventTitle}>{event.title}</Text>
                          <Text style={styles.eventSummary}>{event.summary}</Text>

                          <View style={styles.eventFooterRow}>
                            <View style={styles.eventDoctorInfo}>
                              <Ionicons name="person-outline" size={13} color={colors.textSecondary} />
                              <Text style={styles.eventDoctorText}>
                                {event.doctor} • {event.hospital}
                              </Text>
                            </View>

                            {event.associatedRecordId && (
                              <TouchableOpacity
                                style={styles.viewRecordBtn}
                                onPress={() => handleOpenEvidence(event.associatedRecordId!)}
                                activeOpacity={0.8}
                                accessibilityRole="button"
                                accessibilityLabel={`View record for ${event.title}`}
                              >
                                <Text style={styles.viewRecordBtnText}>View Record</Text>
                                <Ionicons name="chevron-forward" size={13} color="#0284C7" />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: AI MEDICAL SEARCH (MOST IMPORTANT FEATURE)                          */}
          {/* ========================================================================= */}
          {activeTab === 'ai-search' && (
            <View style={styles.tabContent}>
              {/* Header Box */}
              <View style={styles.aiHeaderCard}>
                <View style={styles.aiBadgeRow}>
                  <View style={styles.aiFeatureBadge}>
                    <Ionicons name="sparkles" size={13} color="#0284C7" />
                    <Text style={styles.aiFeatureBadgeText}>AI PATIENT RECORD SEARCH</Text>
                  </View>
                  <View style={styles.groundedPill}>
                    <Ionicons name="shield-checkmark" size={12} color="#059669" />
                    <Text style={styles.groundedPillText}>Strictly Evidence-Grounded</Text>
                  </View>
                </View>

                <Text style={styles.aiSearchHeading}>Ask about {patient.name}'s medical history</Text>
                <Text style={styles.aiSearchDesc}>
                  Natural language queries are grounded exclusively in this patient's verified medical records.
                  Citations and original extracted snippets are provided with every answer.
                </Text>

                {/* Patient Scope Notice */}
                <View style={styles.scopeNotice}>
                  <Ionicons name="lock-closed-outline" size={13} color="#0369A1" />
                  <Text style={styles.scopeNoticeText}>
                    Search context locked to <Text style={styles.boldText}>{patient.name} ({patient.id})</Text>
                  </Text>
                </View>
              </View>

              {/* Suggested Questions */}
              <View style={styles.suggestionsBox}>
                <Text style={styles.suggestionsHeading}>Suggested Clinical Queries:</Text>
                <View style={styles.chipsWrap}>
                  {[
                    "What was the patient's hemoglobin level?",
                    'When was the last blood test?',
                    'What medicines were prescribed previously?',
                    'What was mentioned in the last CBC report?',
                    'Show the previous medical records related to anemia.',
                  ].map((prompt, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.suggestionChip}
                      onPress={() => handleRunAISearch(prompt)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="help-circle-outline" size={13} color="#0284C7" />
                      <Text style={styles.suggestionChipText}>{prompt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Search Bar Input */}
              <View style={styles.aiInputContainer}>
                <Ionicons name="search" size={18} color="#0284C7" style={styles.aiInputIcon} />
                <TextInput
                  style={styles.aiTextInput}
                  placeholder="e.g. What was the patient's hemoglobin level?"
                  placeholderTextColor={colors.textMuted}
                  value={aiQuery}
                  onChangeText={setAiQuery}
                  onSubmitEditing={() => handleRunAISearch()}
                  returnKeyType="search"
                />
                {aiQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setAiQuery('')} style={styles.clearQueryBtn}>
                    <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.aiSubmitBtn, (!aiQuery.trim() || aiLoading) && styles.aiSubmitBtnDisabled]}
                  onPress={() => handleRunAISearch()}
                  disabled={!aiQuery.trim() || aiLoading}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Search Medical History"
                >
                  {aiLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="sparkles" size={15} color="#FFFFFF" />
                      <Text style={styles.aiSubmitBtnText}>Search</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Loading State */}
              {aiLoading && (
                <View style={styles.aiLoadingCard}>
                  <ActivityIndicator size="large" color="#0284C7" />
                  <Text style={styles.aiLoadingTitle}>Analyzing patient records...</Text>
                  <Text style={styles.aiLoadingDesc}>
                    Scanning longitudinal laboratory reports, OPD prescriptions, and clinical notes for {patient.name}
                  </Text>
                </View>
              )}

              {/* AI Answer & Evidence Output */}
              {!aiLoading && aiResult && (
                <View style={styles.aiResultWrapper}>
                  {/* Query Echo Header */}
                  <View style={styles.queryEchoBox}>
                    <Ionicons name="help-circle" size={16} color="#0284C7" />
                    <Text style={styles.queryEchoText}>
                      Query: <Text style={styles.boldText}>"{aiResult.query}"</Text>
                    </Text>
                    <Text style={styles.queryTime}>{aiResult.timestamp}</Text>
                  </View>

                  {/* AI Answer Section */}
                  <View style={styles.aiAnswerCard}>
                    <View style={styles.aiAnswerHeaderRow}>
                      <View style={styles.aiAnswerBadge}>
                        <Ionicons name="sparkles" size={14} color="#0284C7" />
                        <Text style={styles.aiAnswerBadgeText}>AI Answer</Text>
                      </View>

                      {aiResult.hasEvidence && (
                        <View style={styles.confidenceBadge}>
                          <Text style={styles.confidenceText}>
                            {Math.round(aiResult.confidence * 100)}% Confidence
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.aiAnswerBodyText}>{aiResult.answer}</Text>

                    {aiResult.clinicalInterpretation && (
                      <View style={styles.clinicalNoteBox}>
                        <Text style={styles.clinicalNoteLabel}>Clinical Interpretation:</Text>
                        <Text style={styles.clinicalNoteText}>{aiResult.clinicalInterpretation}</Text>
                      </View>
                    )}
                  </View>

                  {/* Evidence Card (Required for grounded answers) */}
                  {aiResult.hasEvidence && aiResult.evidence && (
                    <View style={styles.evidenceCard}>
                      <View style={styles.evidenceHeaderRow}>
                        <View style={styles.evidenceTitleRow}>
                          <Ionicons name="document-text" size={16} color="#0369A1" />
                          <Text style={styles.evidenceCardTitle}>Supporting Evidence</Text>
                        </View>
                        <View style={styles.evidenceDateBadge}>
                          <Text style={styles.evidenceDateText}>{aiResult.evidence.date}</Text>
                        </View>
                      </View>

                      {/* Source Document Details */}
                      <View style={styles.evidenceDocHeader}>
                        <Text style={styles.evidenceDocName}>{aiResult.evidence.documentName}</Text>
                        <Text style={styles.evidenceDocMeta}>
                          Source: {aiResult.evidence.hospital} • {aiResult.evidence.doctor}
                        </Text>
                      </View>

                      {/* Key Extracted Findings */}
                      {aiResult.evidence.keyFindings && aiResult.evidence.keyFindings.length > 0 && (
                        <View style={styles.evidenceKeyFindings}>
                          <Text style={styles.evidenceSnippetLabel}>Extracted Parameters:</Text>
                          <View style={styles.keyFindingsPills}>
                            {aiResult.evidence.keyFindings.map((kf, i) => (
                              <View key={i} style={styles.kfPill}>
                                <Text style={styles.kfPillText}>{kf}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}

                      {/* Relevant Extracted Text Snippet */}
                      <View style={styles.evidenceSnippetBox}>
                        <Text style={styles.evidenceSnippetLabel}>Relevant Extracted Text:</Text>
                        <Text style={styles.evidenceSnippetText}>{aiResult.evidence.snippet}</Text>
                      </View>

                      {/* View Document Button */}
                      <TouchableOpacity
                        style={styles.openDocButton}
                        onPress={() =>
                          handleOpenEvidence(
                            aiResult.evidence!.documentId,
                            aiResult.evidence!.snippet
                          )
                        }
                        activeOpacity={0.82}
                        accessibilityRole="button"
                        accessibilityLabel="View Supporting Document"
                      >
                        <Ionicons name="document-outline" size={16} color="#FFFFFF" />
                        <Text style={styles.openDocButtonText}>View Document</Text>
                        <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Fallback / No Evidence Card */}
                  {!aiResult.hasEvidence && (
                    <View style={styles.noEvidenceBox}>
                      <Ionicons name="shield-outline" size={24} color="#D97706" />
                      <View style={styles.noEvidenceContent}>
                        <Text style={styles.noEvidenceTitle}>Strict Grounding Protection</Text>
                        <Text style={styles.noEvidenceDesc}>
                          Astra Ayu will never fabricate or hallucinate patient-specific medical facts. No verifiable document supports this specific question in {patient.name}'s uploaded records.
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: MEDICAL RECORDS SCREEN                                             */}
          {/* ========================================================================= */}
          {activeTab === 'records' && (
            <View style={styles.tabContent}>
              <View style={styles.recordsHeaderRow}>
                <View>
                  <Text style={styles.tabHeading}>Medical Records & Documents</Text>
                  <Text style={styles.tabSubheading}>
                    Indexed diagnostic reports, doctor prescriptions, and OPD summaries
                  </Text>
                </View>
              </View>

              {records.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Ionicons name="folder-open-outline" size={36} color={colors.textMuted} />
                  <Text style={styles.emptyTitle}>No medical records are available for this patient.</Text>
                </View>
              ) : (
                <View style={styles.recordsContainer}>
                  {records.map((rec) => (
                    <View key={rec.id} style={styles.recordFullCard}>
                      <View style={styles.recHeaderRow}>
                        <View style={styles.recTypeBadge}>
                          <Ionicons
                            name={
                              rec.documentType === 'Lab Report'
                                ? 'flask'
                                : rec.documentType === 'Prescription'
                                ? 'receipt'
                                : 'document-text'
                            }
                            size={12}
                            color="#0284C7"
                          />
                          <Text style={styles.recTypeBadgeText}>{rec.documentType}</Text>
                        </View>

                        <View style={styles.recStatusBadge}>
                          <Ionicons name="checkmark-done" size={12} color="#059669" />
                          <Text style={styles.recStatusBadgeText}>{rec.status}</Text>
                        </View>
                      </View>

                      <Text style={styles.recName}>{rec.documentName}</Text>

                      <View style={styles.recMetaBox}>
                        <View style={styles.recMetaRow}>
                          <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
                          <Text style={styles.recMetaLabel}>Date:</Text>
                          <Text style={styles.recMetaValue}>{rec.date}</Text>
                        </View>

                        <View style={styles.recMetaRow}>
                          <Ionicons name="business-outline" size={13} color={colors.textSecondary} />
                          <Text style={styles.recMetaLabel}>Hospital/Source:</Text>
                          <Text style={styles.recMetaValue}>{rec.hospital}</Text>
                        </View>

                        <View style={styles.recMetaRow}>
                          <Ionicons name="person-outline" size={13} color={colors.textSecondary} />
                          <Text style={styles.recMetaLabel}>Physician:</Text>
                          <Text style={styles.recMetaValue}>{rec.doctor}</Text>
                        </View>
                      </View>

                      {/* Structured Findings Highlights */}
                      {rec.keyFindings && rec.keyFindings.length > 0 && (
                        <View style={styles.recFindingsWrap}>
                          {rec.keyFindings.slice(0, 2).map((kf, i) => (
                            <View key={i} style={styles.recFindingRow}>
                              <Ionicons name="checkmark" size={13} color="#0284C7" />
                              <Text style={styles.recFindingText} numberOfLines={1}>
                                {kf}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Action Button */}
                      <TouchableOpacity
                        style={styles.recViewBtn}
                        onPress={() => handleOpenEvidence(rec.id)}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityLabel={`View document ${rec.documentName}`}
                      >
                        <Ionicons name="eye-outline" size={15} color="#0284C7" />
                        <Text style={styles.recViewBtnText}>View Document & Evidence</Text>
                        <Ionicons name="chevron-forward" size={14} color="#0284C7" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  navBackBtn: {
    padding: 6,
    borderRadius: borderRadius.sm,
  },
  topHeaderCenter: {
    flex: 1,
    alignItems: 'center',
  },
  topHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  topHeaderSubtitle: {
    fontSize: 11.5,
    color: colors.textSecondary,
  },
  quickAiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
  },
  quickAiText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
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
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarLarge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
  },
  avatarLargeText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0284C7',
  },
  profileMain: {
    flex: 1,
  },
  nameAndStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
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
  profileDemographics: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 3,
  },
  boldText: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  abhaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  abhaText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#065F46',
    marginLeft: 4,
  },
  vitalsStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  vitalItem: {
    alignItems: 'center',
  },
  vitalLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  vitalValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 1,
  },
  vitalDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: borderRadius.sm,
  },
  tabButtonActive: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  tabButtonText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 5,
  },
  tabButtonTextActive: {
    color: '#0284C7',
    fontWeight: '800',
  },
  tabContent: {
    width: '100%',
  },
  groundingBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  groundingTextCol: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  groundingTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0369A1',
  },
  groundingSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.subtle,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: 6,
    flex: 1,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoCol: {
    width: '48%',
    marginBottom: spacing.md,
  },
  infoItemLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoItemValue: {
    fontSize: 13.5,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
  },
  historyList: {
    marginTop: 2,
  },
  historyItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0284C7',
    marginTop: 5,
    marginRight: 10,
  },
  historyContent: {
    flex: 1,
  },
  historyDate: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0284C7',
  },
  historyTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 1,
  },
  historyDesc: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  extractedBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  extractedBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#065F46',
  },
  findingsList: {
    marginBottom: spacing.md,
  },
  findingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  findingIcon: {
    marginTop: 2,
    marginRight: 6,
  },
  findingText: {
    fontSize: 13,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 18,
  },
  aiInterpretationBox: {
    backgroundColor: '#FAF5FF',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  aiInterpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  aiInterpTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
    marginLeft: 5,
  },
  aiInterpText: {
    fontSize: 12.5,
    color: '#4C1D95',
    lineHeight: 17,
  },
  activeRxBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  activeRxBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#065F46',
  },
  medicinesList: {
    marginTop: 2,
  },
  medicineCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: spacing.sm,
  },
  medicineTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medicineName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  medicineDosage: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0284C7',
  },
  medicineDetailRow: {
    marginTop: 3,
  },
  medicineFreq: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  medicinePurpose: {
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  recordsList: {
    marginTop: 2,
  },
  recordRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  recordItemIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  recordItemInfo: {
    flex: 1,
  },
  recordItemName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  recordItemMeta: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 1,
  },
  lastUpdatedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  aiCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284C7',
    borderRadius: borderRadius.md,
    height: 48,
    marginTop: spacing.md,
    ...shadows.button,
  },
  aiCtaButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  timelineHeaderRow: {
    marginBottom: spacing.md,
  },
  tabHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  tabSubheading: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  timelineContainer: {
    paddingLeft: 4,
  },
  timelineItemRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  markerColumn: {
    alignItems: 'center',
    marginRight: spacing.md,
    width: 24,
  },
  markerDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  eventCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.subtle,
  },
  eventHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDateText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
    marginLeft: 4,
  },
  eventTypeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  eventTypeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  eventTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  eventSummary: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 3,
    lineHeight: 17,
  },
  eventFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingTop: 8,
    marginTop: 8,
  },
  eventDoctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventDoctorText: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  viewRecordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  viewRecordBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
    marginRight: 2,
  },
  aiHeaderCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.subtle,
  },
  aiBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiFeatureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  aiFeatureBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0284C7',
    marginLeft: 4,
  },
  groundedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  groundedPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#065F46',
    marginLeft: 4,
  },
  aiSearchHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  aiSearchDesc: {
    fontSize: 12.5,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  scopeNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: borderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  scopeNoticeText: {
    fontSize: 11.5,
    color: '#0369A1',
    marginLeft: 6,
  },
  suggestionsBox: {
    marginBottom: spacing.md,
  },
  suggestionsHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  suggestionChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0284C7',
    marginLeft: 4,
  },
  aiInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: '#0284C7',
    paddingLeft: spacing.md,
    paddingRight: 4,
    height: 48,
    marginBottom: spacing.lg,
    ...shadows.subtle,
  },
  aiInputIcon: {
    marginRight: 6,
  },
  aiTextInput: {
    flex: 1,
    fontSize: 13.5,
    color: colors.textPrimary,
    height: '100%',
  },
  clearQueryBtn: {
    padding: 6,
  },
  aiSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.sm,
    marginLeft: 4,
  },
  aiSubmitBtnDisabled: {
    opacity: 0.5,
  },
  aiSubmitBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  aiLoadingCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  aiLoadingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0284C7',
    marginTop: 12,
  },
  aiLoadingDesc: {
    fontSize: 12.5,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 320,
    lineHeight: 18,
  },
  aiResultWrapper: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  queryEchoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  queryEchoText: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginLeft: 6,
    flex: 1,
  },
  queryTime: {
    fontSize: 11,
    color: colors.textMuted,
  },
  aiAnswerCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: spacing.md,
    ...shadows.card,
  },
  aiAnswerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  aiAnswerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  aiAnswerBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
    marginLeft: 4,
  },
  confidenceBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  aiAnswerBodyText: {
    fontSize: 14.5,
    color: colors.textPrimary,
    lineHeight: 22,
    fontWeight: '500',
  },
  clinicalNoteBox: {
    backgroundColor: '#FAF5FF',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginTop: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#7C3AED',
  },
  clinicalNoteLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#7C3AED',
  },
  clinicalNoteText: {
    fontSize: 12,
    color: '#4C1D95',
    marginTop: 2,
    lineHeight: 16,
  },
  evidenceCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    marginBottom: spacing.md,
    ...shadows.subtle,
  },
  evidenceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  evidenceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  evidenceCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0369A1',
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  evidenceDateBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  evidenceDateText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
  },
  evidenceDocHeader: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  evidenceDocName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  evidenceDocMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  evidenceKeyFindings: {
    marginBottom: spacing.sm,
  },
  keyFindingsPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  kfPill: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  kfPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0284C7',
  },
  evidenceSnippetBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E0F2FE',
    marginBottom: spacing.md,
  },
  evidenceSnippetLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  evidenceSnippetText: {
    fontSize: 12.5,
    color: colors.textPrimary,
    lineHeight: 18,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  openDocButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284C7',
    borderRadius: borderRadius.md,
    paddingVertical: 10,
    ...shadows.subtle,
  },
  openDocButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
    marginHorizontal: 8,
  },
  noEvidenceBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  noEvidenceContent: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  noEvidenceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B45309',
  },
  noEvidenceDesc: {
    fontSize: 12,
    color: '#92400E',
    marginTop: 2,
    lineHeight: 17,
  },
  recordsHeaderRow: {
    marginBottom: spacing.md,
  },
  recordsContainer: {
    width: '100%',
  },
  recordFullCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.subtle,
  },
  recHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  recTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  recTypeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
    marginLeft: 4,
  },
  recStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  recStatusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
    marginLeft: 3,
  },
  recName: {
    fontSize: 15.5,
    fontWeight: '700',
    color: colors.textPrimary,
    marginVertical: 4,
  },
  recMetaBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginVertical: spacing.sm,
  },
  recMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  recMetaLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
    marginRight: 4,
  },
  recMetaValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  recFindingsWrap: {
    marginBottom: spacing.sm,
  },
  recFindingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  recFindingText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  recViewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: borderRadius.md,
    paddingVertical: 10,
    marginTop: 4,
  },
  recViewBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
    marginHorizontal: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  loadingMainText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  loadingSubText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.error,
    marginTop: spacing.md,
  },
  errorDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: spacing.xl,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 6,
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
});
