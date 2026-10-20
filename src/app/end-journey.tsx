import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCompletedJourneys, saveCompletedJourney } from "./journey-storage";

export default function EndJourneyScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    vehicle?: string;
    startTime?: string;
    startRemarks?: string;
    endTime?: string;
    endRemarks?: string;
    fare?: string;
    fuelCostPerKm?: string;
    maintenancePerKm?: string;
    food?: string;
    hotel?: string;
    otherExpense?: string;
  }>();

  const hasSaved = useRef(false);

  const amount = (value?: string) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  };

  const food = amount(params.food);
  const hotel = amount(params.hotel);
  const other = amount(params.otherExpense);
  const fare = amount(params.fare);
  const total = food + hotel + other + fare;

  async function saveJourney() {
    try {
      await saveCompletedJourney({
        vehicle: params.vehicle || "Not available",
        startTime: params.startTime || "",
        startRemarks: params.startRemarks || "",
        endTime: params.endTime || new Date().toLocaleString(),
        endRemarks: params.endRemarks || "",
        fare: params.fare || "0",
        food: params.food || "0",
        hotel: params.hotel || "0",
        otherExpense: params.otherExpense || "0",
      });

      const saved = await getCompletedJourneys();

      Alert.alert(
        "Save check",
        `Save function finished. Journeys stored: ${saved.length}`,
      );
    } catch (error) {
      console.error("Journey save diagnostic:", error);

      Alert.alert("Save error", String(error));
    }
  }

  useEffect(() => {
    if (hasSaved.current) return;

    hasSaved.current = true;
    void saveJourney();
  }, []);

  function goHome() {
    router.replace("/dashboard");
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.successCircle}>
          <Text style={styles.check}>✓</Text>
        </View>

        <Text style={styles.title}>Journey Completed!</Text>
        <Text style={styles.subtitle}>
          Your journey has been marked as complete.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Journey Summary</Text>

          <Text style={styles.label}>Vehicle</Text>
          <Text style={styles.value}>{params.vehicle || "Not available"}</Text>

          <Text style={styles.label}>Start time</Text>
          <Text style={styles.value}>
            {params.startTime || "Not available"}
          </Text>

          <Text style={styles.label}>End time</Text>
          <Text style={styles.value}>{params.endTime || "Not available"}</Text>

          <Text style={styles.label}>Start remarks</Text>
          <Text style={styles.value}>{params.startRemarks || "None"}</Text>

          <Text style={styles.label}>End remarks</Text>
          <Text style={styles.value}>{params.endRemarks || "None"}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Expense Summary</Text>

          <View style={styles.row}>
            <Text style={styles.expenseLabel}>Travel fare</Text>
            <Text style={styles.expenseValue}>₹ {fare.toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.expenseLabel}>Food</Text>
            <Text style={styles.expenseValue}>₹ {food.toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.expenseLabel}>Hotel / accommodation</Text>
            <Text style={styles.expenseValue}>₹ {hotel.toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.expenseLabel}>Other expenses</Text>
            <Text style={styles.expenseValue}>₹ {other.toFixed(2)}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Entered expense total</Text>
            <Text style={styles.totalValue}>₹ {total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>About this summary</Text>
          <Text style={styles.noticeText}>
            This is a preliminary on-screen summary. Distance-based fuel costs,
            bills, receipts and PDF export are not included yet. Journey history
            is saved locally on this device.
          </Text>
        </View>

        <Pressable style={styles.primaryButton} onPress={goHome}>
          <Text style={styles.primaryText}>Return to Dashboard</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.replace("/journey")}
        >
          <Text style={styles.secondaryText}>Start Another Journey</Text>
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
    padding: 24,
    paddingBottom: 45,
  },
  successCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  check: {
    color: "#15803D",
    fontSize: 42,
    fontWeight: "800",
  },
  title: {
    color: "#172B4D",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 20,
  },
  subtitle: {
    color: "#64748B",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 19,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 17,
  },
  cardTitle: {
    color: "#172B4D",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  label: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 12,
  },
  value: {
    color: "#172B4D",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  expenseLabel: {
    color: "#475569",
    fontSize: 14,
    flex: 1,
  },
  expenseValue: {
    color: "#172B4D",
    fontSize: 14,
    fontWeight: "700",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#CBD5E1",
  },
  totalLabel: {
    color: "#172B4D",
    fontSize: 14,
    fontWeight: "800",
    flex: 1,
  },
  totalValue: {
    color: "#15803D",
    fontSize: 21,
    fontWeight: "800",
  },
  notice: {
    backgroundColor: "#EFF6FF",
    padding: 16,
    borderRadius: 13,
    marginBottom: 20,
  },
  noticeTitle: {
    color: "#1D4ED8",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 6,
  },
  noticeText: {
    color: "#475569",
    fontSize: 12,
    lineHeight: 19,
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 13,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    minHeight: 52,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  secondaryText: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "700",
  },
});
