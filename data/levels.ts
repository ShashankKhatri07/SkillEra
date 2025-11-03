import { Level } from '../types';

/**
 * Converts a number to its Roman numeral representation (for numbers 1-10).
 * @param num The number to convert.
 * @returns The Roman numeral as a string.
 */
const numberToRoman = (num: number): string => {
    const map: { [key: number]: string } = {
        1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
        6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X'
    };
    return map[num] || num.toString();
};

/**
 * Generates a list of 100 levels with progressively increasing point requirements.
 * @returns An array of Level objects.
 */
const generateLevels = (): Level[] => {
  const levels: Level[] = [];
  const tierNames = [
    "Novice", "Apprentice", "Journeyman", "Expert", "Master", 
    "Grandmaster", "Legend", "Mythic", "Celestial", "Ascendant"
  ];

  let pointsRequired = 0;
  let increment = 50;

  for (let i = 1; i <= 100; i++) {
    const tierIndex = Math.floor((i - 1) / 10);
    const subLevel = ((i - 1) % 10) + 1;
    const name = `${tierNames[tierIndex]} ${numberToRoman(subLevel)}`;
    
    levels.push({
      level: i,
      name,
      pointsRequired,
    });
    
    // Increase points required for the next level
    pointsRequired += increment;
    
    // Make leveling up harder over time by increasing the increment value
    // every 5 levels to create a smoother curve.
    if (i % 5 === 0) {
        increment = Math.floor(increment * 1.15 + 10); // Increase by 15% + a flat 10 points
    }
  }
  return levels;
};


export const allLevels: Level[] = generateLevels();
