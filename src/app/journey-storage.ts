import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "completed_journeys_v1";

export type CompletedJourney = {
  id: string;
  vehicle: string;
  startTime: string;
  startRemarks: string;
  endTime: string;
  endRemarks: string;
  fare: string;
  food: string;
  hotel: string;
  otherExpense: string;
  totalExpense: number;
};

export async function getCompletedJourneys(): Promise<CompletedJourney[]> {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Could not load journeys:", error);
    return [];
  }
}

export async function saveCompletedJourney(
  journey: Omit<CompletedJourney, "id" | "totalExpense">,
): Promise<void> {
  const existing = await getCompletedJourneys();

  const totalExpense =
    (Number(journey.fare) || 0) +
    (Number(journey.food) || 0) +
    (Number(journey.hotel) || 0) +
    (Number(journey.otherExpense) || 0);

  const newJourney: CompletedJourney = {
    ...journey,
    id: `${Date.now()}`,
    totalExpense,
  };

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([newJourney, ...existing]),
  );
}
