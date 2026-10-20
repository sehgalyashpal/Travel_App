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

export default function VehicleDetailsScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    vehicle?: string;
    journeyMode?: string;
    place?: string;
    tripRemarks?: string;
  }>();

  const vehicle = params.vehicle || "Bike";
  const isFuelVehicle = vehicle === "Bike" || vehicle === "Car";

  const [fuelType, setFuelType] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuelPrice, setFuelPrice] = useState("");
  const [maintenanceRate, setMaintenanceRate] = useState("0");

  const [fare, setFare] = useState("");

  function continueJourney() {
    if (isFuelVehicle) {
      if (!fuelType) {
        Alert.alert(
          "Fuel type required",
          "Please select Petrol, Diesel or CNG.",
        );
        return;
      }

      if (!mileage.trim() || Number(mileage) <= 0) {
        Alert.alert("Mileage required", "Please enter a valid mileage.");
        return;
      }

      if (!fuelPrice.trim() || Number(fuelPrice) <= 0) {
        Alert.alert("Fuel price required", "Please enter a valid fuel price.");
        return;
      }

      if (!maintenanceRate.trim() || Number(maintenanceRate) < 0) {
        Alert.alert(
          "Invalid maintenance",
          "Maintenance allowance must be 0 or a positive percentage.",
        );
        return;
      }
    } else {
      if (!fare.trim() || Number(fare) < 0) {
        Alert.alert("Fare required", "Please enter the travel fare.");
        return;
      }
    }

    const fuelCostPerKm =
      isFuelVehicle && Number(mileage) > 0
        ? Number(fuelPrice) / Number(mileage)
        : 0;

    const maintenancePerKm = isFuelVehicle
      ? fuelCostPerKm * (Number(maintenanceRate) / 100)
      : 0;

    router.push({
      pathname: "/start-journey",
      params: {
        vehicle,
        fuelType,
        mileage,
        fuelPrice,
        maintenanceRate,
        fuelCostPerKm: fuelCostPerKm.toFixed(2),
        maintenancePerKm: maintenancePerKm.toFixed(2),
        fare,
        journeyMode: params.journeyMode || "new",
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
          {params.journeyMode === "continue" ? "NEXT TRIP" : "VEHICLE DETAILS"}
        </Text>

        <Text style={styles.title}>{vehicle} Details</Text>

        <Text style={styles.subtitle}>
          Enter the information needed to calculate and record this part of your
          journey.
        </Text>

        {params.place ? (
          <View style={styles.destinationCard}>
            <Text style={styles.destinationLabel}>Next destination</Text>
            <Text style={styles.destinationValue}>{params.place}</Text>
          </View>
        ) : null}

        {isFuelVehicle ? (
          <>
            <Text style={styles.sectionTitle}>Fuel type</Text>

            <View style={styles.fuelRow}>
              <Pressable
                style={[
                  styles.fuelOption,
                  fuelType === "Petrol" && styles.fuelOptionSelected,
                ]}
                onPress={() => setFuelType("Petrol")}
              >
                <Text style={styles.fuelIcon}>⛽</Text>
                <Text style={styles.fuelText}>Petrol</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.fuelOption,
                  fuelType === "Diesel" && styles.fuelOptionSelected,
                ]}
                onPress={() => setFuelType("Diesel")}
              >
                <Text style={styles.fuelIcon}>⛽</Text>
                <Text style={styles.fuelText}>Diesel</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.fuelOption,
                  fuelType === "CNG" && styles.fuelOptionSelected,
                ]}
                onPress={() => setFuelType("CNG")}
              >
                <Text style={styles.fuelIcon}>⛽</Text>
                <Text style={styles.fuelText}>CNG</Text>
              </Pressable>
            </View>

            <Text style={styles.label}>
              Mileage (km per litre / equivalent)
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Example: 45"
              placeholderTextColor="#94A3B8"
              keyboardType="decimal-pad"
              value={mileage}
              onChangeText={setMileage}
            />

            <Text style={styles.label}>{fuelType || "Fuel"} price (₹)</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter current fuel price"
              placeholderTextColor="#94A3B8"
              keyboardType="decimal-pad"
              value={fuelPrice}
              onChangeText={setFuelPrice}
            />

            <View style={styles.calculationCard}>
              <Text style={styles.calculationTitle}>
                Estimated fuel cost per km
              </Text>

              <Text style={styles.calculationValue}>
                {Number(mileage) > 0 && Number(fuelPrice) > 0
                  ? `₹ ${(Number(fuelPrice) / Number(mileage)).toFixed(2)} / km`
                  : "₹ — / km"}
              </Text>

              <Text style={styles.calculationNote}>Fuel price ÷ mileage</Text>
            </View>

            <Text style={styles.sectionTitle}>
              Vehicle Maintenance Allowance (%)
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Example: 5 or 10"
              placeholderTextColor="#94A3B8"
              keyboardType="decimal-pad"
              value={maintenanceRate}
              onChangeText={setMaintenanceRate}
            />

            <Text style={styles.note}>
              Applies to both Bike and Car. Enter 0 or any non-negative
              percentage.
            </Text>

            <View style={styles.maintenanceCard}>
              <Text style={styles.calculationTitle}>
                Maintenance cost per km
              </Text>

              <Text style={styles.calculationValue}>
                {Number(mileage) > 0 &&
                Number(fuelPrice) > 0 &&
                Number(maintenanceRate) >= 0
                  ? `₹ ${(
                      (Number(fuelPrice) / Number(mileage)) *
                      (Number(maintenanceRate) / 100)
                    ).toFixed(2)} / km`
                  : "₹ 0.00 / km"}
              </Text>

              <Text style={styles.calculationNote}>
                Fuel cost per km × maintenance percentage
              </Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Travel fare</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter fare / ticket amount ₹"
              placeholderTextColor="#94A3B8"
              keyboardType="decimal-pad"
              value={fare}
              onChangeText={setFare}
            />

            <View style={styles.fareCard}>
              <Text style={styles.calculationTitle}>Recorded travel fare</Text>

              <Text style={styles.calculationValue}>
                {fare.trim() ? `₹ ${fare}` : "₹ —"}
              </Text>
            </View>
          </>
        )}

        <Pressable style={styles.button} onPress={continueJourney}>
          <Text style={styles.buttonText}>
            {params.journeyMode === "continue"
              ? "Continue Journey"
              : "Continue"}
          </Text>
          <Text style={styles.arrow}>→</Text>
        </Pressable>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
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

  back: {
    color: "#2563EB",
    fontSize: 16,
    marginBottom: 22,
  },

  eyebrow: {
    color: "#2563EB",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  title: {
    color: "#172B4D",
    fontSize: 29,
    fontWeight: "800",
    marginTop: 8,
  },

  subtitle: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 22,
  },

  destinationCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 15,
    padding: 17,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#BFDBFE",
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
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 11,
    marginTop: 5,
  },

  fuelRow: {
    flexDirection: "row",
    gap: 9,
    marginBottom: 20,
  },

  fuelOption: {
    flex: 1,
    minHeight: 68,
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },

  fuelOptionSelected: {
    borderColor: "#2563EB",
    borderWidth: 2,
    backgroundColor: "#EFF6FF",
  },

  fuelIcon: {
    fontSize: 20,
  },

  fuelText: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },

  label: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    minHeight: 50,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8E0EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#172B4D",
    marginBottom: 18,
  },

  calculationCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 22,
  },

  maintenanceCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  fareCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
  },

  calculationTitle: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "600",
  },

  calculationValue: {
    color: "#1D4ED8",
    fontSize: 23,
    fontWeight: "800",
    marginTop: 5,
  },

  calculationNote: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 5,
  },

  note: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
    marginTop: -8,
    marginBottom: 15,
  },

  button: {
    minHeight: 55,
    backgroundColor: "#2563EB",
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

  backButton: {
    minHeight: 50,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  backText: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "600",
  },
});
