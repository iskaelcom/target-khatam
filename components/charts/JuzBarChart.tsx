import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { JuzProgress } from '@/types';
import { getBarColor } from '@/utils/progress';
import { AppColors } from '@/constants/Colors';

interface JuzBarChartProps {
  juzProgress: JuzProgress[];
}

export default function JuzBarChart({ juzProgress }: JuzBarChartProps) {
  const barData = juzProgress.map((jp) => ({
    value: jp.percentage,
    label: `${jp.juz.id}`,
    frontColor: getBarColor(jp.percentage),
    topLabelComponent: () => (
      <Text style={styles.topLabel}>{jp.percentage > 0 ? `${jp.percentage}%` : ''}</Text>
    ),
  }));

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <BarChart
          data={barData}
          barWidth={18}
          spacing={8}
          maxValue={100}
          noOfSections={4}
          yAxisLabelTexts={['0', '25', '50', '75', '100']}
          yAxisLabelSuffix="%"
          yAxisTextStyle={styles.yAxisText}
          xAxisLabelTextStyle={styles.xAxisText}
          isAnimated
          barBorderRadius={3}
          height={180}
          yAxisColor={AppColors.inactive}
          xAxisColor={AppColors.inactive}
          hideRules
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  topLabel: {
    fontSize: 8,
    color: AppColors.textSecondary,
    marginBottom: 2,
  },
  yAxisText: {
    fontSize: 10,
    color: AppColors.textSecondary,
  },
  xAxisText: {
    fontSize: 9,
    color: AppColors.textSecondary,
  },
});
