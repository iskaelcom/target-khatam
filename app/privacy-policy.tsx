import { AppColors } from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen() {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={AppColors.primary} />
        </Pressable>
        <Text style={styles.title}>{t.privacy.title}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>{t.privacy.lastUpdated}: 17 February 2026</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.privacy.introTitle}</Text>
          <Text style={styles.body}>{t.privacy.introBody}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.privacy.dataCollectedTitle}</Text>
          <Text style={styles.body}>{t.privacy.dataCollectedBody}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.privacy.dataStorageTitle}</Text>
          <Text style={styles.body}>{t.privacy.dataStorageBody}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.privacy.googleDriveTitle}</Text>
          <Text style={styles.body}>{t.privacy.googleDriveBody}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.privacy.thirdPartyTitle}</Text>
          <Text style={styles.body}>{t.privacy.thirdPartyBody}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.privacy.childrenTitle}</Text>
          <Text style={styles.body}>{t.privacy.childrenBody}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.privacy.changesTitle}</Text>
          <Text style={styles.body}>{t.privacy.changesBody}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.privacy.contactTitle}</Text>
          <Text style={styles.body}>{t.privacy.contactBody}</Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  lastUpdated: {
    fontSize: 12,
    color: AppColors.textSecondary,
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 6,
  },
  body: {
    fontSize: 14,
    color: AppColors.textSecondary,
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 40,
  },
});
