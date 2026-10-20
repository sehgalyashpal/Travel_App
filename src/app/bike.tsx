import { useRouter } from "expo-router";
import { useState } from "react";
import * as Location from "expo-location";
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

export default function BikeScreen() {
  const router = useRouter();
  async function continueToJourney() {
  try {
    const permission =
      await Location.requestForegroundPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Location Permission Required",
        "Please allow location access to record your journey location."
      );
      return;
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    router.push({
      pathname: "/start-journey",
      params: {
        vehicle: "Bike",
        fuelType,
        mileage,
        fuelPrice,
        maintenanceRate,
        latitude: String(position.coords.latitude),
        longitude: String(position.coords.longitude),
      },
    });
  } catch {
    Alert.alert(
      "Location Error",
      "Could not get your location. Please check that Location is enabled on your device."
    );
  }
}
  const [fuelType, setFuelType] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuelPrice, setFuelPrice] = useState("");
  const [maintenanceRate, setMaintenanceRate] = useState("0");
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>BIKE JOURNEY</Text>

        <Text style={styles.title}>Bike Details</Text>

        <Text style={styles.subtitle}>
          Enter your bike's fuel and mileage information before starting the
          journey.
        </Text>

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

        <Text style={styles.label}>Mileage (km per litre)</Text>

        <TextInput
          style={styles.input}
          placeholder="Example: 45"
          placeholderTextColor="#94A3B8"
          keyboardType="decimal-pad"
          value={mileage}
          onChangeText={setMileage}
        />

        <View style={styles.priceCard}>
          <Text style={styles.priceTitle}>Fuel price (₹ per litre)</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter current fuel price"
            placeholderTextColor="#94A3B8"
            keyboardType="decimal-pad"
            value={fuelPrice}
            onChangeText={setFuelPrice}
          />

          <Text style={styles.priceNote}>
            Enter the current price for your selected fuel type. Check a
            reliable local source when prices change.
          </Text>
        </View>

        <View style={styles.costCard}>
          <Text style={styles.costTitle}>Estimated cost per km</Text>
          <Text style={styles.costValue}>
            {Number(mileage) > 0 && Number(fuelPrice) > 0
              ? `₹ ${(Number(fuelPrice) / Number(mileage)).toFixed(2)} / km`
              : "₹ — / km"}
          </Text>
          <Text style={styles.costNote}>
            Calculated from fuel price ÷ mileage.
          </Text>

          <View style={styles.priceCard}>
            <Text style={styles.priceTitle}>
              Vehicle Maintenance Allowance (%)
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter percentage, e.g. 7.5"
              placeholderTextColor="#94A3B8"
              keyboardType="decimal-pad"
              value={maintenanceRate}
              onChangeText={setMaintenanceRate}
            />

            <Text style={styles.priceNote}>
              Applies to Bike and Car fuel costs. Enter 0 or any non-negative
              percentage.
            </Text>

            <Text style={styles.priceTitle}>Maintenance cost per km</Text>

            <Text style={styles.priceNote}>
              ₹
              {Number(mileage) > 0 &&
              Number(fuelPrice) >= 0 &&
              fuelPrice.trim() !== "" &&
              Number(maintenanceRate) >= 0 &&
              maintenanceRate.trim() !== ""
                ? (
                    (Number(fuelPrice) / Number(mileage)) *
                    (Number(maintenanceRate) / 100)
                  ).toFixed(2)
                : "0.00"}{" "}
              per km
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.startButton}
       onPress={continueToJourney}
        >
          <Text style={styles.startText}>Continue to Start Journey</Text>
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
    paddingBottom: 40,
  },
  eyebrow: {
    color: "#2563EB",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginTop: 10,
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
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#172B4D",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  fuelRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  fuelOption: {
    flex: 1,
    minHeight: 70,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
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
    marginTop: 5,
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
  priceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 18,
    marginBottom: 12,
  },
  priceTitle: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
  },
  priceValue: {
    color: "#172B4D",
    fontSize: 21,
    fontWeight: "800",
    marginTop: 5,
  },
  priceNote: {
    color: "#94A3B8",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  costCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 22,
  },
  costTitle: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "600",
  },
  costValue: {
    color: "#1D4ED8",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 5,
  },
  costNote: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 5,
  },
  startButton: {
    minHeight: 55,
    borderRadius: 13,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  startText: {
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
