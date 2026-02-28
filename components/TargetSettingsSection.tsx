import DatePickerInput from '@/components/DatePickerInput';
import { AppColors } from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';
import { useProgress } from '@/context/ProgressContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

export default function TargetSettingsSection() {
    const { targetSettings, updateTargetSettings } = useProgress();
    const { t } = useLanguage();

    const getCurrentValue = () => {
        if (targetSettings.mode === 'days') return targetSettings.targetDays.toString();
        if (targetSettings.mode === 'khatam_per_month') return targetSettings.khatamPerMonth.toString();
        return '';
    };

    const [customInput, setCustomInput] = useState(getCurrentValue());

    const handleToggle = async (value: boolean) => {
        await updateTargetSettings({
            ...targetSettings,
            enabled: value,
            startDate: value && !targetSettings.startDate ? getTodayISO() : targetSettings.startDate,
        });
    };

    const handleModeChange = async (mode: 'days' | 'khatam_per_month' | 'target_date') => {
        await updateTargetSettings({ ...targetSettings, mode, startDate: getTodayISO() });
        if (mode === 'days') setCustomInput(targetSettings.targetDays.toString());
        else if (mode === 'khatam_per_month') setCustomInput(targetSettings.khatamPerMonth.toString());
    };

    const handleDaysPreset = async (days: number) => {
        await updateTargetSettings({
            ...targetSettings,
            enabled: true,
            mode: 'days',
            targetDays: days,
            startDate: getTodayISO(),
        });
        setCustomInput(days.toString());
    };

    const handleKhatamPreset = async (khatamCount: number) => {
        await updateTargetSettings({
            ...targetSettings,
            enabled: true,
            mode: 'khatam_per_month',
            khatamPerMonth: khatamCount,
            startDate: getTodayISO(),
        });
        setCustomInput(khatamCount.toString());
    };

    const handleCustomSubmit = async () => {
        const value = parseInt(customInput, 10);
        if (isNaN(value) || value < 1) return;
        if (targetSettings.mode === 'days') {
            await updateTargetSettings({ ...targetSettings, enabled: true, targetDays: value, startDate: getTodayISO() });
        } else {
            await updateTargetSettings({ ...targetSettings, enabled: true, khatamPerMonth: value, startDate: getTodayISO() });
        }
    };

    const handleDateChange = async (dateStr: string) => {
        if (!dateStr) return;
        await updateTargetSettings({
            ...targetSettings,
            enabled: true,
            mode: 'target_date',
            targetDate: dateStr,
            startDate: getTodayISO(),
        });
    };

    return (
        <View style={styles.section}>
            <View style={styles.headerRow}>
                <Text style={styles.sectionTitle}>{t.settings.targetSettings}</Text>
                <Switch
                    value={targetSettings.enabled}
                    onValueChange={handleToggle}
                    trackColor={{ false: AppColors.inactive, true: AppColors.primaryLight }}
                    thumbColor={targetSettings.enabled ? AppColors.primary : AppColors.textSecondary}
                />
            </View>

            {targetSettings.enabled && (
                <>
                    {/* Mode Selector */}
                    <View style={styles.modeSelector}>
                        <Pressable
                            style={[styles.modeButton, targetSettings.mode === 'days' && styles.modeButtonActive]}
                            onPress={() => handleModeChange('days')}
                        >
                            <Text style={[styles.modeText, targetSettings.mode === 'days' && styles.modeTextActive]}>
                                {t.target.mode.days}
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[styles.modeButton, targetSettings.mode === 'target_date' && styles.modeButtonActive]}
                            onPress={() => handleModeChange('target_date')}
                        >
                            <Text style={[styles.modeText, targetSettings.mode === 'target_date' && styles.modeTextActive]}>
                                {t.target.mode.targetDate}
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[styles.modeButton, targetSettings.mode === 'khatam_per_month' && styles.modeButtonActive]}
                            onPress={() => handleModeChange('khatam_per_month')}
                        >
                            <Text style={[styles.modeText, targetSettings.mode === 'khatam_per_month' && styles.modeTextActive]}>
                                {t.target.mode.khatamPerMonth}
                            </Text>
                        </Pressable>
                    </View>

                    {/* Content per mode */}
                    {targetSettings.mode === 'target_date' ? (
                        <>
                            <Text style={styles.label}>{t.target.selectTargetDate}</Text>
                            <DatePickerInput
                                value={targetSettings.targetDate || ''}
                                minDate={getTomorrowISO()}
                                label={t.target.selectTargetDate}
                                onChange={handleDateChange}
                            />
                        </>
                    ) : (
                        <>
                            <Text style={styles.label}>
                                {targetSettings.mode === 'days' ? t.target.targetDays : t.target.khatamCount}
                            </Text>

                            {targetSettings.mode === 'days' ? (
                                <>
                                    <View style={styles.presetRow}>
                                        <PresetButton
                                            label={t.target.presets.week}
                                            selected={targetSettings.targetDays === 7}
                                            onPress={() => handleDaysPreset(7)}
                                        />
                                        <PresetButton
                                            label={t.target.presets.halfMonth}
                                            selected={targetSettings.targetDays === 15}
                                            onPress={() => handleDaysPreset(15)}
                                        />
                                    </View>
                                    <View style={styles.presetRow}>
                                        <PresetButton
                                            label={t.target.presets.month}
                                            selected={targetSettings.targetDays === 30}
                                            onPress={() => handleDaysPreset(30)}
                                        />
                                        <PresetButton
                                            label={t.target.presets.twoMonths}
                                            selected={targetSettings.targetDays === 60}
                                            onPress={() => handleDaysPreset(60)}
                                        />
                                    </View>
                                </>
                            ) : (
                                <View style={styles.presetRow}>
                                    <PresetButton
                                        label={t.target.presetsKhatam.once}
                                        selected={targetSettings.khatamPerMonth === 1}
                                        onPress={() => handleKhatamPreset(1)}
                                    />
                                    <PresetButton
                                        label={t.target.presetsKhatam.twice}
                                        selected={targetSettings.khatamPerMonth === 2}
                                        onPress={() => handleKhatamPreset(2)}
                                    />
                                    <PresetButton
                                        label={t.target.presetsKhatam.thrice}
                                        selected={targetSettings.khatamPerMonth === 3}
                                        onPress={() => handleKhatamPreset(3)}
                                    />
                                </View>
                            )}

                            <View style={styles.customRow}>
                                <TextInput
                                    style={styles.customInput}
                                    placeholder={targetSettings.mode === 'days' ? t.target.customDays : t.target.customKhatam}
                                    placeholderTextColor={AppColors.textSecondary}
                                    keyboardType="number-pad"
                                    value={customInput}
                                    onChangeText={setCustomInput}
                                    onSubmitEditing={handleCustomSubmit}
                                />
                                <Pressable style={styles.customButton} onPress={handleCustomSubmit}>
                                    <MaterialCommunityIcons name="check" size={20} color={AppColors.white} />
                                </Pressable>
                            </View>
                        </>
                    )}
                </>
            )}
        </View>
    );
}

interface PresetButtonProps {
    label: string;
    selected: boolean;
    onPress: () => void;
}

function PresetButton({ label, selected, onPress }: PresetButtonProps) {
    return (
        <Pressable
            style={[styles.presetButton, selected && styles.presetButtonSelected]}
            onPress={onPress}
        >
            <Text style={[styles.presetText, selected && styles.presetTextSelected]}>
                {label}
            </Text>
        </Pressable>
    );
}

function getTodayISO(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getTomorrowISO(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const y = tomorrow.getFullYear();
    const m = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const d = String(tomorrow.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: AppColors.textPrimary,
    },
    modeSelector: {
        flexDirection: 'row',
        backgroundColor: AppColors.background,
        borderRadius: 8,
        padding: 4,
        marginBottom: 16,
        gap: 4,
    },
    modeButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 6,
        borderRadius: 6,
        alignItems: 'center',
    },
    modeButtonActive: {
        backgroundColor: AppColors.primary,
    },
    modeText: {
        fontSize: 11,
        fontWeight: '600',
        color: AppColors.textSecondary,
        textAlign: 'center',
    },
    modeTextActive: {
        color: AppColors.white,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: AppColors.textSecondary,
        marginBottom: 12,
    },
    presetRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    presetButton: {
        flex: 1,
        backgroundColor: AppColors.background,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 2,
        borderColor: AppColors.cardBorder,
        alignItems: 'center',
    },
    presetButtonSelected: {
        backgroundColor: AppColors.primaryLight,
        borderColor: AppColors.primary,
    },
    presetText: {
        fontSize: 14,
        fontWeight: '600',
        color: AppColors.textPrimary,
    },
    presetTextSelected: {
        color: AppColors.white,
    },
    customRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
    },
    customInput: {
        flex: 1,
        backgroundColor: AppColors.background,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: AppColors.textPrimary,
        borderWidth: 1,
        borderColor: AppColors.cardBorder,
    },
    customButton: {
        backgroundColor: AppColors.primary,
        borderRadius: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
