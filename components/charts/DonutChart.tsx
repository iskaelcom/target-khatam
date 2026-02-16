import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { AppColors } from '@/constants/Colors';

interface DonutChartProps {
  percentage: number;
  pagesRead: number;
  totalPages: number;
}

export default function DonutChart({ percentage, pagesRead, totalPages }: DonutChartProps) {
  const pieData = [
    { value: pagesRead || 0.1, color: AppColors.primary },
    { value: totalPages - pagesRead, color: AppColors.inactive },
  ];

  return (
    <View style={styles.container}>
      <PieChart
        data={pieData}
        donut
        radius={110}
        innerRadius={75}
        innerCircleColor={AppColors.background}
        centerLabelComponent={() => (
          <View style={styles.centerLabel}>
            <Text style={styles.percentageText}>{percentage}%</Text>
            <Text style={styles.pagesText}>
              {pagesRead}/{totalPages}
            </Text>
          </View>
        )}
        isAnimated
        animationDuration={800}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  centerLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AppColors.primary,
  },
  pagesText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginTop: 2,
  },
});
