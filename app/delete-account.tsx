import { AppColors } from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DeleteAccountScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={AppColors.primary} />
        </Pressable>
        <Text style={styles.title}>Delete Account & Data</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.body}>
          Target Khatam stores all your reading data locally on your device. To delete your data, you can:
        </Text>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>1</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Delete local data</Text>
            <Text style={styles.stepBody}>
              Open the app, go to Settings, and tap "Reset Progress". This will delete all your reading progress, daily logs, and khatam history from your device.
            </Text>
          </View>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>2</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Delete cloud backup (if used)</Text>
            <Text style={styles.stepBody}>
              If you used Google Drive backup, go to Settings {'>'} Cloud Backup and tap "Sign out". You can also revoke app access from your Google Account settings to remove all backup data.
            </Text>
          </View>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>3</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Uninstall the app</Text>
            <Text style={styles.stepBody}>
              Uninstalling the app will remove all locally stored data from your device.
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.body}>
          If you need further assistance with data deletion, please contact us:
        </Text>

        <Pressable
          style={styles.contactButton}
          onPress={() => Linking.openURL('mailto:iskaeldotcom@gmail.com?subject=Account%20Deletion%20Request')}
        >
          <MaterialCommunityIcons name="email-outline" size={20} color={AppColors.card} />
          <Text style={styles.contactText}>iskaeldotcom@gmail.com</Text>
        </Pressable>

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
  body: {
    fontSize: 14,
    color: AppColors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AppColors.primary,
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 28,
    overflow: 'hidden',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  stepBody: {
    fontSize: 14,
    color: AppColors.textSecondary,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.border,
    marginVertical: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: AppColors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  contactText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.card,
  },
  bottomSpacer: {
    height: 40,
  },
});
