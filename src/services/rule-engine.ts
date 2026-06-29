// src/services/rule-engine.ts

export interface WeatherConditions {
  temp: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  rainProb: number;
  aqi: number;
  visibility: number;
}

export interface DecisionCard {
  activity: string;
  recommendation: 'Yes' | 'Caution' | 'No';
  reason: string;
  score: number; // 0-100
}

/**
 * Calculates a localized comfort score (0-100) based on human factors.
 */
export function calculateComfortScore(data: WeatherConditions): { score: number; reason: string } {
  let score = 100;
  let deductions = [];

  if (data.temp > 30) { score -= (data.temp - 30) * 3; deductions.push("High heat"); }
  if (data.temp < 10) { score -= (10 - data.temp) * 2; deductions.push("Chilly temps"); }
  if (data.humidity > 70) { score -= (data.humidity - 70) * 0.5; deductions.push("Muggy air"); }
  if (data.aqi > 100) { score -= 20; deductions.push("Poor air quality"); }
  if (data.windSpeed > 30) { score -= 10; deductions.push("Strong winds"); }

  score = Math.max(0, Math.min(100, Math.round(score)));

  let reason = "Perfect conditions outside.";
  if (deductions.length > 0) {
    reason = `Comfort reduced due to ${deductions.join(" and ")}.`;
  }

  return { score, reason };
}

export function getWeatherPersonality(data: WeatherConditions): string {
  if (data.rainProb > 70) return "Moody & Stormy";
  if (data.temp > 32) return "Fiery & Intense";
  if (data.temp < 10) return "Cozy & Chilly";
  if (data.uvIndex > 8) return "Vibrant & Energetic";
  return "Relaxed & Balanced";
}

/**
 * Generates an automated Weather Story template
 */
export function generateWeatherStory(data: WeatherConditions): string {
  let story = `Today is characterized by temperatures around ${Math.round(data.temp)}°C. `;
  
  if (data.uvIndex > 7) story += "The sun is quite harsh, making sunscreen essential. ";
  if (data.windSpeed > 25) story += "Expect breezy conditions that might make it feel a bit cooler. ";
  if (data.humidity > 80) story += "High humidity will make the air feel heavy. ";
  if (data.rainProb > 50) story += "Keep an umbrella handy as rain is highly likely. ";
  
  return story.trim();
}

/**
 * Generates Smart Decisions using strict meteorological thresholds.
 */
export function getSmartDecisions(data: WeatherConditions): DecisionCard[] {
  const decisions: DecisionCard[] = [];

  // 1. Walk / Stroll
  if (data.rainProb > 60 || data.aqi > 150) {
    decisions.push({ activity: "Walk", recommendation: "No", reason: data.rainProb > 60 ? "High chance of rain." : "Hazardous air quality.", score: 20 });
  } else if (data.temp > 35 || data.temp < 5) {
    decisions.push({ activity: "Walk", recommendation: "Caution", reason: "Extreme temperatures outside.", score: 50 });
  } else {
    decisions.push({ activity: "Walk", recommendation: "Yes", reason: "Great weather for a stroll.", score: 95 });
  }

  // 2. Running / Jogging (Stricter heat/humidity rules)
  if (data.temp > 30 || data.humidity > 85 || data.aqi > 100) {
    decisions.push({ activity: "Run", recommendation: "No", reason: "Poor conditions for heavy cardio.", score: 30 });
  } else if (data.temp > 25) {
    decisions.push({ activity: "Run", recommendation: "Caution", reason: "Warm weather. Stay hydrated.", score: 60 });
  } else {
    decisions.push({ activity: "Run", recommendation: "Yes", reason: "Ideal conditions for a run.", score: 90 });
  }

  // 3. Cycling
  if (data.windSpeed > 35 || data.rainProb > 50) {
    decisions.push({ activity: "Cycling", recommendation: "No", reason: data.windSpeed > 35 ? "Dangerous crosswinds." : "Wet roads are slippery.", score: 25 });
  } else if (data.windSpeed > 20) {
    decisions.push({ activity: "Cycling", recommendation: "Caution", reason: "Noticeable headwind today.", score: 65 });
  } else {
    decisions.push({ activity: "Cycling", recommendation: "Yes", reason: "Smooth riding conditions.", score: 95 });
  }

  // 4. Wash Clothes (Laundry)
  if (data.rainProb > 30 || data.humidity > 85) {
    decisions.push({ activity: "Laundry", recommendation: "No", reason: "High moisture; clothes won't dry well.", score: 15 });
  } else {
    decisions.push({ activity: "Laundry", recommendation: "Yes", reason: "Low humidity and clear skies.", score: 95 });
  }

  // 5. Wash Car
  if (data.rainProb > 20) {
    decisions.push({ activity: "Wash Car", recommendation: "No", reason: "Rain expected soon. Don't waste effort.", score: 10 });
  } else {
    decisions.push({ activity: "Wash Car", recommendation: "Yes", reason: "No rain in the immediate forecast.", score: 90 });
  }

  // 6. Open Windows (Ventilation)
  if (data.aqi > 80 || data.temp > 30 || data.temp < 12 || data.humidity > 80) {
    decisions.push({ activity: "Open Windows", recommendation: "No", reason: "Keep closed to maintain indoor comfort.", score: 20 });
  } else {
    decisions.push({ activity: "Open Windows", recommendation: "Yes", reason: "Perfect breeze for fresh indoor air.", score: 100 });
  }

  // 7. Sunscreen Required
  if (data.uvIndex >= 6) {
    decisions.push({ activity: "Sunscreen", recommendation: "Yes", reason: "High UV index. Reapply every 2 hours.", score: 100 });
  } else if (data.uvIndex >= 3) {
    decisions.push({ activity: "Sunscreen", recommendation: "Caution", reason: "Moderate UV. Recommended for sensitive skin.", score: 70 });
  }

  // 8. Carry Umbrella
  if (data.rainProb > 40) {
    if (data.windSpeed > 40) {
      decisions.push({ activity: "Umbrella", recommendation: "Caution", reason: "Rain expected, but winds might break umbrellas. Wear a raincoat.", score: 60 });
    } else {
      decisions.push({ activity: "Umbrella", recommendation: "Yes", reason: "High chance of precipitation.", score: 95 });
    }
  }

  // 9. Wear a Jacket
  if (data.temp < 15) {
    decisions.push({ activity: "Jacket", recommendation: "Yes", reason: "Chilly temperatures outside.", score: 90 });
  } else if (data.temp < 20 && data.windSpeed > 20) {
    decisions.push({ activity: "Jacket", recommendation: "Caution", reason: "Wind chill makes it feel colder.", score: 70 });
  }

  // 10. Hydration & Heat Stroke Risk
  if (data.temp > 35 || (data.temp > 30 && data.humidity > 70)) {
    decisions.push({ activity: "Hydration", recommendation: "Yes", reason: "High risk of heat exhaustion. Drink plenty of water.", score: 100 });
  }

  // 11. Wear a Mask
  if (data.aqi > 150) {
    decisions.push({ activity: "Wear Mask", recommendation: "Yes", reason: "Unhealthy air quality levels.", score: 100 });
  } else if (data.aqi > 100) {
    decisions.push({ activity: "Wear Mask", recommendation: "Caution", reason: "Air quality is poor for sensitive groups.", score: 70 });
  }

  // 12. Hair Frizz Warning
  if (data.humidity > 75) {
    decisions.push({ activity: "Hair Care", recommendation: "Caution", reason: "High humidity will likely cause frizz.", score: 80 });
  }

  // 13. Pet Walk (Dog Mode)
  // Asphalt gets incredibly hot when air temp is > 28C
  if (data.temp > 28 && data.uvIndex > 5) {
    decisions.push({ activity: "Walk Dog", recommendation: "No", reason: "Pavement is too hot for paws. Wait for evening.", score: 10 });
  } else if (data.rainProb > 50) {
    decisions.push({ activity: "Walk Dog", recommendation: "Caution", reason: "Wet conditions. Prepare for muddy paws.", score: 50 });
  } else {
    decisions.push({ activity: "Walk Dog", recommendation: "Yes", reason: "Safe pavement temperatures and clear skies.", score: 95 });
  }

  // 14. Water Plants
  if (data.rainProb > 60) {
    decisions.push({ activity: "Water Plants", recommendation: "No", reason: "Let nature do the watering today.", score: 10 });
  } else if (data.temp > 32) {
    decisions.push({ activity: "Water Plants", recommendation: "Yes", reason: "High heat dries out soil quickly.", score: 95 });
  }

  // 15. Photography (Visibility and Light)
  if (data.visibility > 10000 && data.rainProb < 20) {
    decisions.push({ activity: "Photography", recommendation: "Yes", reason: "Excellent visibility for landscape shots.", score: 95 });
  } else if (data.visibility < 3000) {
    decisions.push({ activity: "Photography", recommendation: "Caution", reason: "Low visibility. Good for moody/foggy shots only.", score: 50 });
  }

  // 16. Picnic / Camping
  if (data.rainProb > 30 || data.windSpeed > 25 || data.temp < 15 || data.temp > 32) {
    decisions.push({ activity: "Picnic", recommendation: "No", reason: "Weather is not conducive to sitting outside.", score: 20 });
  } else {
    decisions.push({ activity: "Picnic", recommendation: "Yes", reason: "Perfect outdoor lounging weather.", score: 95 });
  }

  // 17. Motorcycle Ride
  if (data.rainProb > 30 || data.windSpeed > 40 || data.visibility < 5000) {
    decisions.push({ activity: "Motorcycle", recommendation: "No", reason: "Hazardous riding conditions today.", score: 15 });
  } else {
    decisions.push({ activity: "Motorcycle", recommendation: "Yes", reason: "Clear roads and safe wind levels.", score: 90 });
  }

  // 18. Swimming
  if (data.temp > 28 && data.rainProb < 20) {
    decisions.push({ activity: "Swimming", recommendation: "Yes", reason: "Perfect weather for a cool dip.", score: 95 });
  } else if (data.temp < 22) {
    decisions.push({ activity: "Swimming", recommendation: "No", reason: "Too cold for outdoor swimming.", score: 20 });
  }

  // 19. Fly a Kite
  if (data.windSpeed >= 15 && data.windSpeed <= 35 && data.rainProb < 20) {
    decisions.push({ activity: "Fly Kite", recommendation: "Yes", reason: "Ideal wind speeds for kite flying.", score: 90 });
  }

  // 20. Stargazing
  if (data.visibility > 15000 && data.rainProb < 10) {
    decisions.push({ activity: "Stargazing", recommendation: "Yes", reason: "High visibility and clear skies expected.", score: 95 });
  }

  // Sort decisions by recommendation so "Caution" and "No" float to the top for safety
  return decisions.sort((a, b) => {
    const rank = { "No": 1, "Caution": 2, "Yes": 3 };
    return rank[a.recommendation] - rank[b.recommendation];
  });
}