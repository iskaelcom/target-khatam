import { AppColors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

interface DonutChartProps {
  percentage: number;
  pagesRead: number;
  totalPages: number;
  size?: number; // Optional size prop for customization
}

export default function DonutChart({ percentage, pagesRead, totalPages, size = 110 }: DonutChartProps) {
  const radius = size;
  const innerRadius = size * 0.68; // Maintain proportion

  const pieData = [
    { value: pagesRead || 0.1, color: AppColors.primary },
    { value: totalPages - pagesRead, color: AppColors.inactive },
  ];

  const fontSize = size > 80 ? 32 : 18; // Smaller font for smaller charts
  const pagesFontSize = size > 80 ? 14 : 10;

  return (
    <View style={styles.container}>
      <PieChart
        data={pieData}
        donut
        radius={radius}
        innerRadius={innerRadius}
        innerCircleColor={AppColors.background}
        centerLabelComponent={() => (
          <View style={styles.centerLabel}>
            <Text style={[styles.percentageText, { fontSize }]}>{percentage}%</Text>
            <Text style={[styles.pagesText, { fontSize: pagesFontSize }]}>
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
    fontWeight: 'bold',
    color: AppColors.primary,
  },
  pagesText: {
    color: AppColors.textSecondary,
    marginTop: 2,
  },
});
