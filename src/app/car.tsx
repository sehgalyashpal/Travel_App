import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function CarScreen() {
  const router = useRouter();
  const [fuelType, setFuelType] = useState("Petrol");
  const [mileage, setMileage] = useState("");
  const [fuelPrice, setFuelPrice] = useState("");
  const [maintenanceRate, setMaintenanceRate] = useState("0");

  const fuelCostPerKm =
    Number(mileage) > 0 && fuelPrice.trim() !== "" && Number(fuelPrice) >= 0
      ? Number(fuelPrice) / Number(mileage)
      : 0;

  const maintenancePerKm = fuelCostPerKm * (Number(maintenanceRate) / 100);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>‹ Back</Text>
      </Pressable>

      <Text style={styles.heading}>Car Details</Text>
      <Text style={styles.subtitle}>
        Enter your fuel and maintenance details.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Fuel Type</Text>

        <View style={styles.fuelRow}>
          {["Petrol", "Diesel", "CNG"].map((fuel) => (
            <Pressable
              key={fuel}
              style={[
                styles.fuelButton,
                fuelType === fuel && styles.selectedFuel,
              ]}
              onPress={() => setFuelType(fuel)}
            >
              <Text
                style={[
                  styles.fuelText,
                  fuelType === fuel && styles.selectedFuelText,
                ]}
              >
                {fuel}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Mileage (km per litre/kg)</Text>
        <TextInput
          style={styles.input}
          value={mileage}
          onChangeText={setMileage}
          placeholder="Enter mileage"
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Fuel price (₹ per litre/kg)</Text>
        <TextInput
          style={styles.input}
          value={fuelPrice}
          onChangeText={setFuelPrice}
          placeholder="Enter fuel price"
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Fuel cost per km</Text>
        <Text style={styles.amount}>₹{fuelCostPerKm.toFixed(2)} / km</Text>

        <Text style={styles.label}>Vehicle Maintenance Allowance (%)</Text>
        <TextInput
          style={styles.input}
          value={maintenanceRate}
          onChangeText={setMaintenanceRate}
          placeholder="Enter any percentage, e.g. 7.5"
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Maintenance cost per km</Text>
        <Text style={styles.amount}>₹{maintenancePerKm.toFixed(2)} / km</Text>

        <Text style={styles.note}>
          Maintenance is calculated from fuel cost per km. Enter 0 or any
          non-negative percentage.
        </Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={() =>
          Alert.alert(
            "Car Details",
            `Fuel: ${fuelType}\nFuel cost: ₹${fuelCostPerKm.toFixed(
              2,
            )}/km\nMaintenance: ₹${maintenancePerKm.toFixed(2)}/km`,
          )
        }
      >
        <Text style={styles.buttonText}>Check Calculation</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    padding: 22,
    paddingTop: 55,
  },
  back: {
    fontSize: 17,
    color: "#2563EB",
    marginBottom: 22,
  },
  heading: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 8,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
  },
  label: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 14,
  },
  fuelRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  fuelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
  },
  selectedFuel: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  fuelText: {
    color: "#334155",
    fontWeight: "600",
  },
  selectedFuelText: {
    color: "#FFFFFF",
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    padding: 12,
    marginTop: 7,
    fontSize: 16,
    color: "#0F172A",
  },
  amount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#15803D",
    marginTop: 6,
  },
  note: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 12,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 18,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },
});
