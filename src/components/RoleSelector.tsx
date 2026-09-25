import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserRole } from '../types/auth';
import { colors, spacing, borderRadius } from '../theme/colors';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onSelectRole,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Continue as</Text>

      <View style={styles.tabContainer}>
        {/* Patient Option */}
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedRole === 'patient' && styles.tabButtonActive,
          ]}
          onPress={() => onSelectRole('patient')}
          activeOpacity={0.8}
          accessibilityRole="tab"
          accessibilityState={{ selected: selectedRole === 'patient' }}
          accessibilityLabel="Continue as Patient"
        >
          <View style={styles.tabContent}>
            <Ionicons
              name={selectedRole === 'patient' ? 'person' : 'person-outline'}
              size={17}
              color={selectedRole === 'patient' ? colors.textInverse : colors.textSecondary}
              style={styles.tabIcon}
            />
            <Text
              style={[
                styles.tabText,
                selectedRole === 'patient' && styles.tabTextActive,
              ]}
            >
              Patient
            </Text>
          </View>
        </TouchableOpacity>

        {/* Doctor Option */}
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedRole === 'doctor' && styles.tabButtonActive,
          ]}
          onPress={() => onSelectRole('doctor')}
          activeOpacity={0.8}
          accessibilityRole="tab"
          accessibilityState={{ selected: selectedRole === 'doctor' }}
          accessibilityLabel="Continue as Doctor"
        >
          <View style={styles.tabContent}>
            <Ionicons
              name={selectedRole === 'doctor' ? 'medkit' : 'medkit-outline'}
              size={17}
              color={selectedRole === 'doctor' ? colors.textInverse : colors.textSecondary}
              style={styles.tabIcon}
            />
            <Text
              style={[
                styles.tabText,
                selectedRole === 'doctor' && styles.tabTextActive,
              ]}
            >
              Doctor
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Role Context Hint */}
      <View style={styles.hintContainer}>
        <Ionicons
          name="information-circle-outline"
          size={14}
          color={colors.textMuted}
          style={styles.hintIcon}
        />
        <Text style={styles.hintText}>
          {selectedRole === 'patient'
            ? 'Access your personal health timeline & AI search'
            : 'Access clinical records & AI diagnostic summaries'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs + 2,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9', // Subtle neutral track
    borderRadius: borderRadius.md + 2,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs + 2,
    paddingHorizontal: 2,
  },
  hintIcon: {
    marginRight: 4,
  },
  hintText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'normal',
  },
});
