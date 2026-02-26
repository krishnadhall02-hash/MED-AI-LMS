
import { MCQ, AdaptiveMode, AdaptiveState } from '../types';
import { updateAdaptiveState, INITIAL_ADAPTIVE_STATE } from './adaptiveEngine';

export enum DailyStep {
  ADAPTIVE_MCQS = 'ADAPTIVE_MCQS',
  WEAK_BOOSTER = 'WEAK_BOOSTER',
  IMAGE_BASED = 'IMAGE_BASED',
  MINI_MOCK = 'MINI_MOCK',
  SUMMARY = 'SUMMARY'
}

export interface DailyRoutineState {
  currentStep: DailyStep;
  adaptiveState: AdaptiveState;
  step1Results: { questionId: string; correct: boolean; timeTaken: number; topic: string }[];
  step2Results: { questionId: string; correct: boolean }[];
  step3Results: { questionId: string; correct: boolean }[];
  step4Results: { questionId: string; correct: boolean; timeTaken: number }[];
  startTime: number;
  completedSteps: DailyStep[];
}

export const INITIAL_DAILY_STATE: DailyRoutineState = {
  currentStep: DailyStep.ADAPTIVE_MCQS,
  adaptiveState: INITIAL_ADAPTIVE_STATE,
  step1Results: [],
  step2Results: [],
  step3Results: [],
  step4Results: [],
  startTime: Date.now(),
  completedSteps: []
};

export const getWeakestTopicFromResults = (results: { topic: string; correct: boolean }[]): string => {
  const topicStats: { [key: string]: { correct: number; total: number } } = {};
  results.forEach(r => {
    if (!topicStats[r.topic]) topicStats[r.topic] = { correct: 0, total: 0 };
    topicStats[r.topic].total++;
    if (r.correct) topicStats[r.topic].correct++;
  });

  let weakestTopic = "";
  let lowestAccuracy = 1.1;

  Object.keys(topicStats).forEach(topic => {
    const accuracy = topicStats[topic].correct / topicStats[topic].total;
    if (accuracy < lowestAccuracy) {
      lowestAccuracy = accuracy;
      weakestTopic = topic;
    }
  });

  return weakestTopic || "General Medicine";
};
