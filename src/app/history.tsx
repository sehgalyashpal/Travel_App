import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CompletedJourney, getCompletedJourneys } from "./journey-storage";

export default function HistoryScreen() {
  const router = useRouter();
  const [journeys, setJourneys] = useState<CompletedJourney[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    const savedJourneys = await getCompletedJourneys();
    setJourneys(savedJourneys);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadHistory();
    }, [loadHistory]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>Journey History</Text>
        <Text style={styles.subtitle}>
          Your completed journeys saved on this device.
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" />
        ) : journeys.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.emptyTitle}>No journeys saved yet</Text>
            <Text style={styles.detail}>
              Complete a journey and it will appear here.
            </Text>
          </View>
        ) : (
          journeys.map((journey) => (
            <View key={journey.id} style={styles.card}>
              <Text style={styles.vehicle}>{journey.vehicle}</Text>
              <Text style={styles.detail}>
                Started: {journey.startTime || "Not available"}
              </Text>
              <Text style={styles.detail}>
                Ended: {journey.endTime || "Not available"}
              </Text>
              <Text style={styles.detail}>
                Start remarks: {journey.startRemarks || "None"}
              </Text>
              <Text style={styles.detail}>
                End remarks: {journey.endRemarks || "None"}
              </Text>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total entered expenses</Text>
                <Text style={styles.totalValue}>
                  ₹ {journey.totalExpense.toFixed(2)}
                </Text>
              </View>
            </View>
          ))
        )}

        <Pressable
          style={styles.button}
          onPress={() => router.push("/journey")}
        >
          <Text style={styles.buttonText}>Start New Journey</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  content: {
    padding: 22,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    marginBottom: 12,
  },
  backText: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "700",
  },
  title: {
    color: "#172B4D",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    color: "#64748B",
    fontSize: 14,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 15,
  },
  vehicle: {
    color: "#172B4D",
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 10,
  },
  detail: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 21,
    marginBottom: 4,
  },
  emptyTitle: {
    color: "#172B4D",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    marginTop: 12,
    paddingTop: 12,
  },
  totalLabel: {
    flex: 1,
    color: "#172B4D",
    fontWeight: "700",
    fontSize: 13,
  },
  totalValue: {
    color: "#15803D",
    fontSize: 17,
    fontWeight: "800",
  },
  button: {
    minHeight: 52,
    borderRadius: 13,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
