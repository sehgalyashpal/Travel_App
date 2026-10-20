import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StartJourneyScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    vehicle?: string;
    fuelType?: string;
    mileage?: string;
    fuelPrice?: string;
    maintenanceRate?: string;
    fuelCostPerKm?: string;
    maintenancePerKm?: string;
    fare?: string;
    journeyMode?: string;
    place?: string;
    tripRemarks?: string;
  }>();

  const vehicle = params.vehicle || "Unknown";
  const isFuelVehicle = vehicle === "Bike" || vehicle === "Car";

  const [startRemarks, setStartRemarks] = useState("");
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState("");

  function beginJourney() {
    if (!startRemarks.trim()) {
      Alert.alert(
        "Start remarks",
        "Please enter a short remark before starting the journey.",
      );
      return;
    }

    const now = new Date();

    setStartTime(now.toLocaleString());
    setStarted(true);

    Alert.alert(
      "Journey Started",
      `Your ${vehicle} journey has started and the start time has been recorded.`,
    );
  }

  function continueToTrip() {
    router.push({
      pathname: "/trip",
      params: {
        vehicle,
        fuelType: params.fuelType || "",
        mileage: params.mileage || "",
        fuelPrice: params.fuelPrice || "",
        maintenanceRate: params.maintenanceRate || "0",
        fuelCostPerKm: params.fuelCostPerKm || "0",
        maintenancePerKm: params.maintenancePerKm || "0",
        fare: params.fare || "",
        startTime,
        startRemarks,
        place: params.place || "",
        tripRemarks: params.tripRemarks || "",
      },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹ Back</Text>
        </Pressable>

        <Text style={styles.eyebrow}>
          {params.journeyMode === "continue"
            ? "CONTINUE JOURNEY"
            : "START JOURNEY"}
        </Text>

        <Text style={styles.heading}>Start Your Journey</Text>

        <Text style={styles.subtitle}>
          Check the details below and add your starting remark.
        </Text>

        {/* VEHICLE DETAILS */}

        <View style={styles.card}>
          <Text style={styles.label}>Vehicle</Text>
          <Text style={styles.value}>{vehicle}</Text>

          {isFuelVehicle ? (
            <>
              <Text style={styles.label}>Fuel type</Text>
              <Text style={styles.value}>
                {params.fuelType || "Not selected"}
              </Text>

              <Text style={styles.label}>Mileage</Text>
              <Text style={styles.value}>
                {params.mileage ? `${params.mileage} km/litre` : "Not entered"}
              </Text>

              <Text style={styles.label}>Fuel price</Text>
              <Text style={styles.value}>
                {params.fuelPrice ? `₹ ${params.fuelPrice}` : "Not entered"}
              </Text>

              <Text style={styles.label}>Maintenance allowance</Text>
              <Text style={styles.value}>{params.maintenanceRate || "0"}%</Text>

              <Text style={styles.label}>Fuel cost per km</Text>
              <Text style={styles.value}>
                ₹ {params.fuelCostPerKm || "0.00"} / km
              </Text>

              <Text style={styles.label}>Maintenance cost per km</Text>
              <Text style={styles.value}>
                ₹ {params.maintenancePerKm || "0.00"} / km
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.label}>Travel fare</Text>
              <Text style={styles.value}>
                {params.fare ? `₹ ${params.fare}` : "Not entered"}
              </Text>
            </>
          )}
        </View>

        {/* DESTINATION */}

        {params.place ? (
          <View style={styles.destinationCard}>
            <Text style={styles.destinationLabel}>Next destination</Text>

            <Text style={styles.destinationValue}>{params.place}</Text>
          </View>
        ) : null}

        {/* START REMARKS */}

        <Text style={styles.sectionTitle}>Start Journey Remarks</Text>

        <TextInput
          style={styles.remarksInput}
          placeholder="Example: Going to client office"
          placeholderTextColor="#94A3B8"
          value={startRemarks}
          onChangeText={setStartRemarks}
          multiline
          textAlignVertical="top"
        />

        {!started ? (
          <Pressable style={styles.button} onPress={beginJourney}>
            <Text style={styles.buttonText}>Start Journey</Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        ) : (
          <View style={styles.startedCard}>
            <Text style={styles.success}>✓ Journey is in progress</Text>

            <Text style={styles.timeLabel}>Journey started</Text>

            <Text style={styles.timeValue}>{startTime}</Text>

            <Text style={styles.note}>
              Your journey is now active. You can record expenses, continue to
              another place, change vehicle, or end the journey.
            </Text>

            <Pressable style={styles.button} onPress={continueToTrip}>
              <Text style={styles.buttonText}>Continue</Text>
              <Text style={styles.arrow}>→</Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.footer}>
          Start time and journey information will be used for the journey
          record.
        </Text>
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

  back: {
    color: "#2563EB",
    fontSize: 17,
    marginBottom: 22,
  },

  eyebrow: {
    color: "#2563EB",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  heading: {
    fontSize: 29,
    fontWeight: "800",
    color: "#172B4D",
    marginTop: 8,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#64748B",
    marginTop: 8,
    marginBottom: 22,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 12,
  },

  value: {
    fontSize: 17,
    fontWeight: "700",
    color: "#172B4D",
    marginTop: 4,
  },

  destinationCard: {
    backgroundColor: "#EFF6FF",
    padding: 17,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginBottom: 20,
  },

  destinationLabel: {
    color: "#64748B",
    fontSize: 12,
  },

  destinationValue: {
    color: "#1D4ED8",
    fontSize: 17,
    fontWeight: "700",
    marginTop: 5,
  },

  sectionTitle: {
    color: "#172B4D",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },

  remarksInput: {
    minHeight: 90,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8E0EB",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#172B4D",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#2563EB",
    minHeight: 55,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  arrow: {
    color: "#FFFFFF",
    fontSize: 22,
    marginLeft: 12,
  },

  startedCard: {
    backgroundColor: "#FFFFFF",
    padding: 19,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },

  success: {
    fontSize: 18,
    fontWeight: "800",
    color: "#15803D",
  },

  timeLabel: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 18,
  },

  timeValue: {
    color: "#172B4D",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },

  note: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
    marginBottom: 8,
  },

  footer: {
    color: "#94A3B8",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 18,
  },
});
