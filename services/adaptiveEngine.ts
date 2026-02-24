
import { AdaptiveState, AdaptiveMode } from '../types';

export const INITIAL_ADAPTIVE_STATE: AdaptiveState = {
  currentDifficulty: 2, // Start at Medium (1-Easy, 2-Medium, 3-Hard, 4-Clinical, 5-Expert)
  streak: 0,
  mode: AdaptiveMode.NORMAL,
  topicPerformance: {},
  skillIndex: 0,
  lastResponses: [],
  avgTime: 0,
};

const ACCURACY_THRESHOLD = 0.75;
const BOOSTER_ACCURACY_THRESHOLD = 0.50;
const STREAK_THRESHOLD = 3;
const TIME_THRESHOLD = 45; // seconds per question

export const calculateSkillIndex = (accuracy: number, speed: number, consistency: number) => {
  // Skill Index = Accuracy × Speed × Consistency
  // Speed is normalized (e.g., 1 - (avgTime / maxTime))
  // Consistency is based on streak length
  return Math.round(accuracy * speed * consistency);
};

export const updateAdaptiveState = (
  prevState: AdaptiveState,
  isCorrect: boolean,
  timeTaken: number,
  topic: string
): AdaptiveState => {
  const newLastResponses = [...prevState.lastResponses, isCorrect].slice(-20);
  const newStreak = isCorrect ? prevState.streak + 1 : 0;
  
  // Update topic performance
  const topicPerf = prevState.topicPerformance[topic] || { correct: 0, total: 0 };
  const newTopicPerf = {
    correct: topicPerf.correct + (isCorrect ? 1 : 0),
    total: topicPerf.total + 1
  };
  
  const newTopicPerformance = {
    ...prevState.topicPerformance,
    [topic]: newTopicPerf
  };

  // Calculate overall accuracy
  const totalCorrect = Object.values(newTopicPerformance).reduce((acc, curr) => acc + curr.correct, 0);
  const totalQuestions = Object.values(newTopicPerformance).reduce((acc, curr) => acc + curr.total, 0);
  const accuracy = totalCorrect / totalQuestions;

  // Update average time
  const newAvgTime = (prevState.avgTime * (totalQuestions - 1) + timeTaken) / totalQuestions;

  let newDifficulty = prevState.currentDifficulty;
  let newMode = AdaptiveMode.NORMAL;

  // 1. Difficulty Escalation Logic
  if (isCorrect && accuracy > ACCURACY_THRESHOLD && newStreak >= STREAK_THRESHOLD) {
    if (newDifficulty < 5) {
      newDifficulty += 1;
    }
  } else if (!isCorrect && accuracy < 0.4 && newDifficulty > 1) {
    // Optional: De-escalation if performing very poorly
    newDifficulty -= 1;
  }

  // 2. Concept Booster Mode
  const topicAccuracy = newTopicPerf.correct / newTopicPerf.total;
  const recentTopicResponses = newLastResponses.slice(-5); // Look at last 5 overall for simplicity or track per topic
  // If incorrect 2+ times in same topic (simplified: if topic accuracy is low and just got it wrong)
  if (!isCorrect && (topicAccuracy < BOOSTER_ACCURACY_THRESHOLD || newTopicPerf.total >= 2 && newTopicPerf.correct === 0)) {
    newMode = AdaptiveMode.BOOSTER;
  }

  // 3. Time Pressure Training Mode
  if (newAvgTime > TIME_THRESHOLD && accuracy > 0.6) {
    newMode = AdaptiveMode.TIME_PRESSURE;
  }

  // Challenge Mode: If difficulty is high and accuracy is high
  if (newDifficulty >= 4 && accuracy > 0.8) {
    newMode = AdaptiveMode.CHALLENGE;
  }

  // Calculate Skill Index
  const speedFactor = Math.max(0.1, 1 - (newAvgTime / 120)); // 120s as max baseline
  const consistencyFactor = 1 + (newStreak * 0.1);
  const skillIndex = calculateSkillIndex(accuracy * 100, speedFactor, consistencyFactor);

  return {
    currentDifficulty: newDifficulty,
    streak: newStreak,
    mode: newMode,
    topicPerformance: newTopicPerformance,
    skillIndex,
    lastResponses: newLastResponses,
    avgTime: newAvgTime
  };
};

export const getModeInfo = (mode: AdaptiveMode) => {
  switch (mode) {
    case AdaptiveMode.CHALLENGE:
      return {
        label: 'Challenge Mode',
        icon: 'fa-fire-flame-curved',
        color: 'text-orange-500',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        description: 'High-intensity difficulty escalation active.'
      };
    case AdaptiveMode.BOOSTER:
      return {
        label: 'Concept Booster',
        icon: 'fa-rocket',
        color: 'text-synapse-aqua',
        bgColor: 'bg-synapse-aqua/10',
        borderColor: 'border-synapse-aqua/20',
        description: 'Reinforcing weak concepts with simplified insights.'
      };
    case AdaptiveMode.TIME_PRESSURE:
      return {
        label: 'Time Pressure',
        icon: 'fa-stopwatch',
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        description: 'Speed training active. Timer reduced.'
      };
    default:
      return {
        label: 'Normal Mode',
        icon: 'fa-brain',
        color: 'text-oneui-blue',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        description: 'Standard adaptive learning.'
      };
  }
};

export const getDifficultyLabel = (level: number) => {
  const labels = ['Novice', 'Easy', 'Intermediate', 'Hard', 'Clinical Case', 'Expert'];
  return labels[level] || 'Intermediate';
};
