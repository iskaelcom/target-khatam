import CloudBackupSection from '@/components/CloudBackupSection';
import LanguageToggle from '@/components/LanguageToggle';
import TargetSettingsSection from '@/components/TargetSettingsSection';
import { AppColors } from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';
import { useProgress } from '@/context/ProgressContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { overallProgress, juzProgress, resetAll } = useProgress();
  const { t } = useLanguage();

  const juzCompleted = juzProgress.filter((jp) => jp.percentage === 100).length;

  const handleReset = async () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(t.settings.resetConfirm);
      if (confirmed) {
        await resetAll();
        window.alert(t.settings.resetSuccess);
      }
    } else {
      Alert.alert(t.settings.resetProgress, t.settings.resetConfirm, [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.confirm,
          style: 'destructive',
          onPress: async () => {
            await resetAll();
            Alert.alert(t.common.ok, t.settings.resetSuccess);
          },
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t.settings.title}</Text>
        </View>

        <CloudBackupSection />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.settings.language}</Text>
          <LanguageToggle />
        </View>

        <TargetSettingsSection />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t.settings.totalPagesRead}
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="book-open-page-variant" size={28} color={AppColors.primary} />
              <Text style={styles.statNumber}>{overallProgress.pagesRead}</Text>
              <Text style={styles.statLabel}>/ {overallProgress.totalPages}</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="check-circle" size={28} color={AppColors.success} />
              <Text style={styles.statNumber}>{juzCompleted}</Text>
              <Text style={styles.statLabel}>/ 30 {t.settings.juzCompleted}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Pressable style={styles.resetButton} onPress={handleReset}>
            <MaterialCommunityIcons name="delete-outline" size={20} color={AppColors.danger} />
            <Text style={styles.resetText}>{t.settings.resetProgress}</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.settings.about}</Text>
          <Text style={styles.aboutText}>{t.settings.aboutText}</Text>
          <Text style={styles.versionText}>{t.settings.version} 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.primary,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: AppColors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.primary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: AppColors.textSecondary,
    marginTop: 2,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: AppColors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.danger,
  },
  resetText: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.danger,
  },
  aboutText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    lineHeight: 20,
  },
  versionText: {
    fontSize: 12,
    color: AppColors.textSecondary,
    marginTop: 8,
  },
});
