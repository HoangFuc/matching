import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { AppText } from './AppText';
import { AppColors } from '../constants/colors';

interface IStepProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const StepProgressBar: React.FC<IStepProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          {/* Step circle */}
          <View
            style={[
              styles.stepCircle,
              step <= currentStep
                ? styles.stepCircleActive
                : styles.stepCircleInactive,
            ]}
          >
            <AppText
              variant="body5"
              color={step <= currentStep ? AppColors.purple : AppColors.gray30}
            >
              {step}
            </AppText>
          </View>

          {/* Connector dots */}
          {index < steps.length - 1 && (
            <View style={styles.connectorContainer}>
              <View
                style={[
                  styles.dot,
                  step <= currentStep ? styles.dotActive : styles.dotInactive,
                ]}
              />
              <View
                style={[
                  styles.dot,
                  step <= currentStep ? styles.dotActive : styles.dotInactive,
                ]}
              />
              <View
                style={[
                  styles.dot,
                  step <= currentStep ? styles.dotActive : styles.dotInactive,
                ]}
              />
            </View>
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

export const  MemoStepProgressBar = React.memo(StepProgressBar);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(8),
  },
  stepCircle: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: AppColors.lavendar,
  },
  stepCircleInactive: {
    backgroundColor: AppColors.gray20,
  },
  connectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
  },
  dot: {
    width: ms(4),
    height: ms(4),
    borderRadius: ms(2),
  },
  dotActive: {
    backgroundColor: AppColors.purple,
  },
  dotInactive: {
    backgroundColor: AppColors.gray30,
  },
});
