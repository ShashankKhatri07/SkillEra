import { allLevels } from '../data/levels';
import { Level } from '../types';

export const getUserLevelInfo = (points: number): Level => {
  let currentLevel: Level = allLevels[0];
  for (const level of allLevels) {
    if (points >= level.pointsRequired) {
      currentLevel = level;
    } else {
      break;
    }
  }
  return currentLevel;
};

export const getNextLevelInfo = (points: number): Level | null => {
  const currentLevel = getUserLevelInfo(points);
  const nextLevelIndex = allLevels.findIndex(l => l.level === currentLevel.level + 1);
  return nextLevelIndex !== -1 ? allLevels[nextLevelIndex] : null;
};