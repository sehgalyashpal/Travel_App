import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const vehicles = [
  { name: "Bike", icon: "🏍️" },
  { name: "Car", icon: "🚗" },
  { name: "Train", icon: "🚆" },
  { name: "Bus", icon: "🚌" },
  { name: "Taxi / Auto", icon: "🚕" },
  { name: "Airplane", icon: "✈️" },
];

export default function NextTripScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ vehicle?: string }>();

  const [selectedVehicle, setSelectedVehicle] = useState(
    params.vehicle || "Bike",
  );
  const [place, setPlace] = useState("");
  const [remarks, setRemarks] = useState("");

  function continueToVehicleDetails() {
    router.push({
      pathname: "/vehicle-details",
      params: {
        vehicle: selectedVehicle,
        journeyMode: "continue",
        place,
        tripRemarks: remarks,
      },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹ Back to Current Trip</Text>
        </Pressable>

        <Text style={styles.eyebrow}>JOURNEY CONTINUES</Text>
        <Text style={styles.title}>Where to next?</Text>
        <Text style={styles.subtitle}>
          Your overall journey remains active. Choose the vehicle for your next
          trip, even if you are changing transport.
        </Text>

        <Text style={styles.sectionTitle}>Choose the next vehicle</Text>

        {vehicles.map((vehicle) => (
          <Pressable
            key={vehicle.name}
            style={[
              styles.vehicleOption,
              selectedVehicle === vehicle.name && styles.selectedOption,
            ]}
            onPress={() => setSelectedVehicle(vehicle.name)}
          >
            <Text style={styles.vehicleIcon}>{vehicle.icon}</Text>
            <Text style={styles.vehicleName}>{vehicle.name}</Text>
            <View
              style={[
                styles.radio,
                selectedVehicle === vehicle.name && styles.radioSelected,
              ]}
            >
              {selectedVehicle === vehicle.name ? (
                <View style={styles.radioDot} />
              ) : null}
            </View>
          </Pressable>
        ))}

        <Text style={styles.sectionTitle}>Next destination (optional)</Text>
        <TextInput
          style={styles.input}
          value={place}
          onChangeText={setPlace}
          placeholder="Example: Railway station"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.sectionTitle}>Trip remarks (optional)</Text>
        <TextInput
          style={styles.remarksInput}
          value={remarks}
          onChangeText={setRemarks}
          placeholder="Reason for stop or next trip"
          placeholderTextColor="#94A3B8"
          multiline
          textAlignVertical="top"
        />

        <Pressable style={styles.button} onPress={continueToVehicleDetails}>
          <Text style={styles.buttonText}>Continue with {selectedVehicle}</Text>
        </Pressable>

        <Text style={styles.note}>
          This starts the setup for your next trip. It does not end the overall
          journey.
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
    paddingBottom: 40,
  },
  back: {
    color: "#2563EB",
    fontSize: 15,
    marginBottom: 24,
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
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#172B4D",
    fontSize: 17,
    fontWeight: "800",
    marginTop: 10,
    marginBottom: 12,
  },
  vehicleOption: {
    minHeight: 62,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 13,
    paddingHorizontal: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedOption: {
    borderColor: "#2563EB",
    borderWidth: 2,
    backgroundColor: "#EFF6FF",
  },
  vehicleIcon: {
    fontSize: 25,
    width: 43,
  },
  vehicleName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#172B4D",
  },
  radio: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: "#2563EB",
  },
  radioDot: {
    width: 11,
    height: 11,
    backgroundColor: "#2563EB",
    borderRadius: 6,
  },
  input: {
    minHeight: 49,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8E0EB",
    borderRadius: 11,
    paddingHorizontal: 13,
    fontSize: 15,
    color: "#172B4D",
  },
  remarksInput: {
    minHeight: 90,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8E0EB",
    borderRadius: 11,
    padding: 13,
    fontSize: 15,
    color: "#172B4D",
  },
  button: {
    backgroundColor: "#2563EB",
    minHeight: 54,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  note: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 12,
  },
});
