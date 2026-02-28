import { AppColors } from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { useDefaultStyles } from 'react-native-ui-datepicker';

interface Props {
    value: string;      // YYYY-MM-DD
    minDate?: string;   // YYYY-MM-DD
    label: string;
    onChange: (dateStr: string) => void;
}

export default function DatePickerInput({ value, minDate, label, onChange }: Props) {
    const defaultStyles = useDefaultStyles();
    const [showModal, setShowModal] = useState(false);
    const [pendingDate, setPendingDate] = useState<string>(value || '');

    const displayLabel = value
        ? new Date(value + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : label;

    const pickerDate = pendingDate || minDate || dayjs().add(1, 'day').format('YYYY-MM-DD');

    const handleOpen = () => {
        setPendingDate(value || '');
        setShowModal(true);
    };

    const handleChange = ({ date }: { date: any }) => {
        if (date) {
            setPendingDate(dayjs(date).format('YYYY-MM-DD'));
        }
    };

    const handleConfirm = () => {
        if (pendingDate) onChange(pendingDate);
        setShowModal(false);
    };

    return (
        <View style={styles.container}>
            <Pressable
                style={[styles.button, !!value && styles.buttonFilled]}
                onPress={handleOpen}
            >
                <MaterialCommunityIcons
                    name="calendar"
                    size={20}
                    color={value ? AppColors.primary : AppColors.textSecondary}
                />
                <Text style={[styles.buttonText, !!value && styles.buttonTextFilled]} numberOfLines={1}>
                    {displayLabel}
                </Text>
                <MaterialCommunityIcons name="chevron-down" size={18} color={AppColors.textSecondary} />
            </Pressable>

            <Modal
                visible={showModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <Pressable style={styles.backdrop} onPress={() => setShowModal(false)}>
                    <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
                        <DateTimePicker
                            mode="single"
                            date={pickerDate}
                            minDate={minDate}
                            locale="id"
                            onChange={handleChange}
                            styles={{
                                ...defaultStyles,
                                today: {
                                    ...defaultStyles.today,
                                    borderColor: AppColors.primary,
                                },
                                selected: {
                                    ...defaultStyles.selected,
                                    backgroundColor: AppColors.primary,
                                },
                            }}
                        />
                        <View style={styles.actions}>
                            <Pressable style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                                <Text style={styles.cancelText}>Batal</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.confirmBtn, !pendingDate && styles.confirmBtnDisabled]}
                                onPress={handleConfirm}
                                disabled={!pendingDate}
                            >
                                <Text style={styles.confirmText}>Konfirmasi</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: AppColors.background,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 13,
        borderWidth: 1,
        borderColor: AppColors.cardBorder,
    },
    buttonFilled: {
        borderColor: AppColors.primary,
        backgroundColor: '#EFF7EF',
    },
    buttonText: {
        flex: 1,
        fontSize: 15,
        color: AppColors.textSecondary,
    },
    buttonTextFilled: {
        color: AppColors.primary,
        fontWeight: '500',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalCard: {
        width: '100%',
        maxWidth: 380,
        backgroundColor: AppColors.card,
        borderRadius: 16,
        padding: 16,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        elevation: 8,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: AppColors.cardBorder,
    },
    cancelBtn: {
        paddingHorizontal: 16,
        paddingVertical: 9,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: AppColors.cardBorder,
    },
    cancelText: {
        fontSize: 14,
        color: AppColors.textSecondary,
        fontWeight: '500',
    },
    confirmBtn: {
        backgroundColor: AppColors.primary,
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 9,
    },
    confirmBtnDisabled: {
        opacity: 0.4,
    },
    confirmText: {
        fontSize: 14,
        color: AppColors.white,
        fontWeight: '600',
    },
});
