
import { WeaknessInsight, MisconceptionType, MCQ } from '../types';

export const calculateWeaknessScore = (
  accuracy: number,
  errorFrequency: number,
  recencyWeight: number
): number => {
  // Weakness Score = (1 - Accuracy%) × Error Frequency × Recency Weight
  return (1 - accuracy) * errorFrequency * recencyWeight;
};

export const getWeaknessStatus = (score: number): 'Weak' | 'Severe' | 'Critical' | 'Normal' => {
  if (score > 0.85) return 'Critical';
  if (score > 0.75) return 'Severe';
  if (score > 0.6) return 'Weak';
  return 'Normal';
};

export const detectMisconception = (lastWrongAnswers: MCQ[]): MisconceptionType => {
  // In a real app, this would use AI or complex rule-based matching
  // For now, we'll return a random one or base it on some simple logic
  const types = Object.values(MisconceptionType);
  return types[Math.floor(Math.random() * types.length)];
};

export const mapWeaknesses = (
  topicPerformance: { [topic: string]: { correct: number, total: number } },
  lastResponses: boolean[]
): WeaknessInsight[] => {
  const insights: WeaknessInsight[] = [];

  Object.entries(topicPerformance).forEach(([topic, perf]) => {
    const accuracy = perf.correct / perf.total;
    const errorFrequency = (perf.total - perf.correct) / perf.total;
    
    // Recency weight: if recent answers are wrong, weight is higher
    const recentAccuracy = lastResponses.slice(-5).filter(r => r).length / 5;
    const recencyWeight = 1 + (1 - recentAccuracy);

    const score = calculateWeaknessScore(accuracy, errorFrequency, recencyWeight);
    const status = getWeaknessStatus(score);

    if (status !== 'Normal') {
      insights.push({
        topic,
        subtopic: 'General', // Simplified
        score,
        errorFrequency,
        recencyWeight,
        misconceptionPattern: MisconceptionType.CONCEPT_CONFUSION, // Placeholder
        status,
        improvementTrend: accuracy > 0.5 ? 'improving' : 'declining'
      });
    }
  });

  return insights.sort((a, b) => b.score - a.score);
};
