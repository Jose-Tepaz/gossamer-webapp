'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type OnboardingStep = 'welcome' | 'connect-broker' | 'choose-plan' | 'complete';

export const useOnboarding = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [onboardingData, setOnboardingData] = useState({
    brokerConnected: false,
    planSelected: false,
  });
  const router = useRouter();

  // Load onboarding progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('onboarding_progress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setCurrentStep(progress.currentStep || 'welcome');
      setOnboardingData(progress.data || { brokerConnected: false, planSelected: false });
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (step: OnboardingStep, data?: Partial<typeof onboardingData>) => {
    const progress = {
      currentStep: step,
      data: { ...onboardingData, ...data },
    };
    localStorage.setItem('onboarding_progress', JSON.stringify(progress));
    setCurrentStep(step);
    if (data) {
      setOnboardingData(prev => ({ ...prev, ...data }));
    }
  };

  // Navigation functions
  const goToWelcome = () => {
    saveProgress('welcome');
    router.push('/onboarding');
  };

  const goToConnectBroker = () => {
    saveProgress('connect-broker');
    router.push('/onboarding');
  };

  const goToChoosePlan = () => {
    saveProgress('choose-plan');
    router.push('/onboarding');
  };

  const completeOnboarding = () => {
    saveProgress('complete', { planSelected: true });
    // Clear onboarding progress
    localStorage.removeItem('onboarding_progress');
    router.push('/dashboard');
  };

  // Check if user can proceed to next step
  const canProceedToConnectBroker = () => {
    return currentStep === 'welcome';
  };

  const canProceedToChoosePlan = () => {
    return currentStep === 'connect-broker' && onboardingData.brokerConnected;
  };

  const canCompleteOnboarding = () => {
    return currentStep === 'choose-plan' && onboardingData.planSelected;
  };

  // Mark steps as completed
  const markBrokerConnected = () => {
    saveProgress('connect-broker', { brokerConnected: true });
  };

  const markPlanSelected = () => {
    saveProgress('choose-plan', { planSelected: true });
  };

  return {
    currentStep,
    onboardingData,
    goToWelcome,
    goToConnectBroker,
    goToChoosePlan,
    completeOnboarding,
    canProceedToConnectBroker,
    canProceedToChoosePlan,
    canCompleteOnboarding,
    markBrokerConnected,
    markPlanSelected,
  };
};
