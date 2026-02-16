import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { AppColors } from '@/constants/Colors';
import { useProgress } from '@/context/ProgressContext';

interface PageGridProps {
  startPage: number;
  endPage: number;
}

const PageCell = memo(function PageCell({
  page,
  isRead,
  onToggle,
}: {
  page: number;
  isRead: boolean;
  onToggle: (page: number) => void;
}) {
  return (
    <Pressable
      style={[styles.cell, isRead ? styles.cellRead : styles.cellUnread]}
      onPress={() => onToggle(page)}>
      <Text style={[styles.cellText, isRead ? styles.cellTextRead : styles.cellTextUnread]}>
        {page}
      </Text>
    </Pressable>
  );
});

export default function PageGrid({ startPage, endPage }: PageGridProps) {
  const { readPages, markUpToPage } = useProgress();
  const { width } = useWindowDimensions();
  const readSet = new Set(readPages);

  const numColumns = Math.max(5, Math.floor((width - 64) / 60));
  const pages: number[] = [];
  for (let p = startPage; p <= endPage; p++) {
    pages.push(p);
  }

  const onToggle = useCallback(
    (page: number) => {
      markUpToPage(page);
    },
    [markUpToPage]
  );

  return (
    <View style={styles.container}>
      <View style={[styles.grid, { maxWidth: numColumns * 60 }]}>
        {pages.map((page) => (
          <PageCell key={page} page={page} isRead={readSet.has(page)} onToggle={onToggle} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
  },
  cell: {
    width: 52,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellRead: {
    backgroundColor: AppColors.success,
  },
  cellUnread: {
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.inactive,
  },
  cellText: {
    fontSize: 13,
    fontWeight: '600',
  },
  cellTextRead: {
    color: AppColors.white,
  },
  cellTextUnread: {
    color: AppColors.textSecondary,
  },
});
