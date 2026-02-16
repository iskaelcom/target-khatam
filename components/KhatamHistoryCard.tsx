import { AppColors } from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';
import { useProgress } from '@/context/ProgressContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function KhatamHistoryCard() {
    const { khatamHistory } = useProgress();
    const { t } = useLanguage();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    if (khatamHistory.totalCount === 0) {
        return null; // Don't show if no completions
    }

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        const day = date.getDate();
        const month = date.toLocaleDateString('id-ID', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    // Show latest 5 completions
    const recentCompletions = khatamHistory.completions.slice(0, 5);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <MaterialCommunityIcons name="trophy" size={24} color={AppColors.gold} />
                    <Text style={styles.title}>{t.history.title}</Text>
                </View>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{khatamHistory.totalCount}x</Text>
                </View>
            </View>

            <View style={styles.summary}>
                <Text style={styles.summaryCount}>{khatamHistory.totalCount}</Text>
                <Text style={styles.summaryLabel}>{t.history.totalKhatam}</Text>
            </View>

            <View style={styles.list}>
                {recentCompletions.map((completion, index) => (
                    <Pressable
                        key={completion.id}
                        onPress={() => setExpandedId(expandedId === completion.id ? null : completion.id)}
                        style={[styles.item, index !== recentCompletions.length - 1 && styles.itemBorder]}
                    >
                        <View style={styles.itemTop}>
                            <View style={styles.itemLeft}>
                                <MaterialCommunityIcons name="check-circle" size={20} color={AppColors.success} />
                                <Text style={styles.date}>{formatDate(completion.completedAt)}</Text>
                                <MaterialCommunityIcons
                                    name={expandedId === completion.id ? 'chevron-up' : 'chevron-down'}
                                    size={16}
                                    color={AppColors.textSecondary}
                                />
                            </View>
                            <Text style={styles.days}>
                                {completion.totalDays} {t.history.daysTaken}
                            </Text>
                        </View>
                        {expandedId === completion.id && (
                            <View style={styles.detail}>
                                <MaterialCommunityIcons name="clock-outline" size={14} color={AppColors.textSecondary} />
                                <Text style={styles.detailText}>{formatTime(completion.completedAt)}</Text>
                            </View>
                        )}
                    </Pressable>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: AppColors.card,
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: AppColors.textPrimary,
    },
    badge: {
        backgroundColor: AppColors.gold + '20',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 14,
        fontWeight: '700',
        color: AppColors.gold,
    },
    summary: {
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.cardBorder,
    },
    summaryCount: {
        fontSize: 32,
        fontWeight: '700',
        color: AppColors.primary,
    },
    summaryLabel: {
        fontSize: 13,
        color: AppColors.textSecondary,
        marginTop: 2,
    },
    list: {
        gap: 0,
    },
    item: {
        paddingVertical: 12,
    },
    itemTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: AppColors.cardBorder,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    date: {
        fontSize: 14,
        color: AppColors.textPrimary,
        fontWeight: '500',
    },
    days: {
        fontSize: 13,
        color: AppColors.textSecondary,
    },
    detail: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 8,
        marginLeft: 28,
    },
    detailText: {
        fontSize: 13,
        color: AppColors.textSecondary,
    },
});
