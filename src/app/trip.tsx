import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

export default function TripScreen() {
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
    startTime?: string;
    startRemarks?: string;
    place?: string;
    tripRemarks?: string;
  }>();

  const vehicle = params.vehicle || "Unknown";
  const isFuelVehicle = vehicle === "Bike" || vehicle === "Car";

  const [hotel, setHotel] = useState("");
  const [food, setFood] = useState("");
  const [otherExpense, setOtherExpense] = useState("");
  const [endRemarks, setEndRemarks] = useState("");

  const [ended, setEnded] = useState(false);
  const [endTime, setEndTime] = useState("");
    const [gpsDistance, setGpsDistance] = useState(0);
    const previousGpsPoint =
  useRef<Location.LocationObjectCoords | null>(null);
  function calculateGpsDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return (
    earthRadiusKm *
    2 *
    Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  );
}
  const [locationSubscription, setLocationSubscription] =
    useState<Location.LocationSubscription | null>(null);
  const [gpsStatus, setGpsStatus] = useState("Starting GPS...");
  const [gpsCoordinates, setGpsCoordinates] = useState("");
const [lastLatitude, setLastLatitude] = useState<number | null>(null);
const [lastLongitude, setLastLongitude] = useState<number | null>(null);
    useEffect(() => {
    let mounted = true;

    async function startGpsTracking() {
      try {
        setGpsStatus("Requesting GPS permission...");

        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          if (mounted) {
            setGpsStatus("GPS permission denied");
          }
          Alert.alert(
            "GPS permission required",
            "Please allow location access so the app can record journey distance.",
          );
          return;
        }

        if (mounted) {
          setGpsStatus("GPS tracking active");
        }

        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 10,
          },
   (location) => {
  const { latitude, longitude, accuracy } = location.coords;

  setGpsCoordinates(
    `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
  );

  setLastLatitude(latitude);
  setLastLongitude(longitude);

  console.log(
    "GPS update:",
    latitude,
    longitude,
    "Accuracy:",
    accuracy,
  );

  if (accuracy !== null && accuracy > 50) {
    setGpsStatus(
      `GPS signal weak: ${Math.round(accuracy)} m accuracy`,
    );
    return;
  }

  setGpsStatus("GPS tracking active");

  const previous = previousGpsPoint.current;

  if (previous) {
    const segmentKm = calculateGpsDistance(
      previous.latitude,
      previous.longitude,
      latitude,
      longitude,
    );

    console.log("GPS segment:", segmentKm, "km");

    if (segmentKm <= 100) {
      setGpsDistance((current) => {
        const newDistance = current + segmentKm;

        console.log("TOTAL GPS DISTANCE:", newDistance, "km");

        return newDistance;
      });
    } else {
      console.log(
        "GPS segment ignored because it is over 10 km:",
        segmentKm,
        "km",
      );
    }
  } else {
    console.log("First GPS point recorded");
  }

  previousGpsPoint.current = {
    latitude,
    longitude,
    accuracy,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  };
},


        );

        if (mounted) {
          setLocationSubscription(subscription);
        } else {
          subscription.remove();
        }
      } catch (error) {
        console.error("GPS start error:", error);

        if (mounted) {
          setGpsStatus("GPS unavailable");
        }
      }
    }

    void startGpsTracking();

    return () => {
      mounted = false;
    };
  }, []);

  function endJourneyNow() {
    if (!endRemarks.trim()) {
      Alert.alert(
        "End remarks",
        "Please enter a short remark before ending the journey.",
      );
      return;
    }

    const finalEndTime = new Date().toLocaleString();

    router.push({
      pathname: "/end-journey",
      params: {
        vehicle,
        startTime: params.startTime || "",
        startRemarks: params.startRemarks || "",
        endTime: finalEndTime,
endRemarks: endRemarks.trim(),
gpsDistance: String(gpsDistance),
fare: String(fareAmount),
        fuelCostPerKm: String(fuelAmount),
        maintenancePerKm: String(maintenanceAmount),
        food: String(foodAmount),
        hotel: String(hotelAmount),
        otherExpense: String(otherAmount),
      },
    });
  }

  function continueToNextPlace() {
    router.push({
      pathname: "/next-trip",
      params: {
        vehicle,
      },
    });
  }

  const hotelAmount = Number(hotel) || 0;
  const foodAmount = Number(food) || 0;
  const otherAmount = Number(otherExpense) || 0;

  const fuelAmount =
    isFuelVehicle && params.fuelCostPerKm ? Number(params.fuelCostPerKm) : 0;

  const maintenanceAmount =
    isFuelVehicle && params.maintenancePerKm
      ? Number(params.maintenancePerKm)
      : 0;

  const fareAmount = !isFuelVehicle && params.fare ? Number(params.fare) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>CURRENT TRIP</Text>

        <Text style={styles.title}>Journey in Progress</Text>

        <Text style={styles.subtitle}>
          Record expenses and decide whether to continue to another place or end
          the complete journey.
        </Text>

        {/* VEHICLE */}

        <View style={styles.vehicleCard}>
          <Text style={styles.vehicleIcon}>
            {vehicle === "Bike"
              ? "🏍️"
              : vehicle === "Car"
                ? "🚗"
                : vehicle === "Train"
                  ? "🚆"
                  : vehicle === "Bus"
                    ? "🚌"
                    : vehicle === "Taxi / Auto"
                      ? "🚕"
                      : "✈️"}
          </Text>

          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleLabel}>Current vehicle</Text>
            <Text style={styles.vehicleName}>{vehicle}</Text>
          </View>
        </View>

        {/* JOURNEY INFORMATION */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Journey information</Text>

          <Text style={styles.label}>Start time</Text>
          <Text style={styles.value}>
            {params.startTime || "Not available"}
          </Text>

          {params.place ? (
            <>
              <Text style={styles.label}>Destination</Text>
              <Text style={styles.value}>{params.place}</Text>
            </>
          ) : null}

          {params.startRemarks ? (
            <>
              <Text style={styles.label}>Start remarks</Text>
              <Text style={styles.value}>{params.startRemarks}</Text>
            </>
          ) : null}

          {params.tripRemarks ? (
            <>
              <Text style={styles.label}>Trip remarks</Text>
              <Text style={styles.value}>{params.tripRemarks}</Text>
            </>
          ) : null}
        </View>
{/* GPS DISTANCE TRACKING */}
<View style={styles.card}>
  <Text style={styles.cardTitle}>GPS Distance Tracking</Text>

  <Text style={styles.label}>GPS Status</Text>
  <Text style={styles.value}>{gpsStatus}</Text>

  <Text style={styles.label}>Latest Coordinates</Text>
  <Text style={styles.value}>
    {gpsCoordinates || "Waiting for GPS location..."}
  </Text>

  <Text style={styles.label}>Distance Recorded</Text>
  <Text style={styles.value}>{gpsDistance.toFixed(3)} km</Text>
</View>
        {/* FUEL / VEHICLE COST */}

        {isFuelVehicle ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Vehicle calculation</Text>

            <Text style={styles.label}>Fuel</Text>
            <Text style={styles.value}>
              {params.fuelType || "Not selected"}
            </Text>

            <Text style={styles.label}>Mileage</Text>
            <Text style={styles.value}>
              {params.mileage ? `${params.mileage} km/litre` : "Not available"}
            </Text>

            <Text style={styles.label}>Fuel price</Text>
            <Text style={styles.value}>
              {params.fuelPrice ? `₹ ${params.fuelPrice}` : "Not available"}
            </Text>

            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Fuel cost/km</Text>

              <Text style={styles.calculationValue}>
                ₹ {params.fuelCostPerKm || "0.00"}
              </Text>
            </View>

            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>
                Maintenance ({params.maintenanceRate || "0"}%)
              </Text>

              <Text style={styles.calculationValue}>
                ₹ {params.maintenancePerKm || "0.00"}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Travel fare</Text>

            <Text style={styles.value}>
              {params.fare ? `₹ ${params.fare}` : "₹ 0"}
            </Text>
          </View>
        )}

        {/* EXPENSES */}

        <Text style={styles.sectionTitle}>Other journey expenses</Text>

        <View style={styles.expenseCard}>
          <Text style={styles.label}>🏨 Hotel / accommodation</Text>

          <TextInput
            style={styles.input}
            placeholder="₹ Amount"
            placeholderTextColor="#94A3B8"
            keyboardType="decimal-pad"
            value={hotel}
            onChangeText={setHotel}
          />

          <Text style={styles.label}>🍴 Fooding</Text>

          <TextInput
            style={styles.input}
            placeholder="₹ Amount"
            placeholderTextColor="#94A3B8"
            keyboardType="decimal-pad"
            value={food}
            onChangeText={setFood}
          />

          <Text style={styles.label}>📌 Other expense</Text>

          <TextInput
            style={styles.input}
            placeholder="₹ Amount"
            placeholderTextColor="#94A3B8"
            keyboardType="decimal-pad"
            value={otherExpense}
            onChangeText={setOtherExpense}
          />

          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Other expenses total</Text>

            <Text style={styles.totalValue}>
              ₹ {(hotelAmount + foodAmount + otherAmount).toFixed(2)}
            </Text>
          </View>
        </View>

        {!ended ? (
          <>
            {/* CONTINUE */}

            <Pressable
              style={styles.continueButton}
              onPress={continueToNextPlace}
            >
              <Text style={styles.continueText}>Continue to Next Place</Text>
              <Text style={styles.arrow}>→</Text>
            </Pressable>

            <Text style={styles.continueNote}>
              The overall journey remains active. You can select the same
              vehicle or another vehicle for the next trip.
            </Text>

            {/* END JOURNEY */}

            <Text style={styles.sectionTitle}>End the complete journey</Text>

            <TextInput
              style={styles.remarksInput}
              placeholder="End journey remarks"
              placeholderTextColor="#94A3B8"
              value={endRemarks}
              onChangeText={setEndRemarks}
              multiline
              textAlignVertical="top"
            />

            <Pressable style={styles.endButton} onPress={endJourneyNow}>
              <Text style={styles.endText}>End Journey Now</Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.endedCard}>
            <Text style={styles.endedTitle}>✓ Journey Completed</Text>

            <Text style={styles.label}>End time</Text>

            <Text style={styles.value}>{endTime}</Text>

            <Text style={styles.label}>End remarks</Text>

            <Text style={styles.value}>{endRemarks}</Text>

            <Text style={styles.completedNote}>
              The complete journey has been ended.
            </Text>
          </View>
        )}

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

  eyebrow: {
    color: "#2563EB",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginTop: 8,
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

  vehicleCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  vehicleIcon: {
    fontSize: 34,
    marginRight: 15,
  },

  vehicleInfo: {
    flex: 1,
  },

  vehicleLabel: {
    color: "#64748B",
    fontSize: 12,
  },

  vehicleName: {
    color: "#1D4ED8",
    fontSize: 21,
    fontWeight: "800",
    marginTop: 3,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 18,
    marginBottom: 18,
  },

  cardTitle: {
    color: "#172B4D",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 10,
  },

  label: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 10,
  },

  value: {
    color: "#172B4D",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 4,
  },

  calculationRow: {
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    marginTop: 14,
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  calculationLabel: {
    color: "#64748B",
    fontSize: 13,
  },

  calculationValue: {
    color: "#1D4ED8",
    fontSize: 14,
    fontWeight: "800",
  },

  sectionTitle: {
    color: "#172B4D",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 12,
  },

  expenseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 18,
    marginBottom: 22,
  },

  input: {
    minHeight: 48,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#D8E0EB",
    borderRadius: 11,
    paddingHorizontal: 13,
    fontSize: 15,
    color: "#172B4D",
    marginTop: 7,
  },

  totalBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 14,
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "600",
  },

  totalValue: {
    color: "#1D4ED8",
    fontSize: 17,
    fontWeight: "800",
  },

  continueButton: {
    minHeight: 55,
    backgroundColor: "#2563EB",
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  continueText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  arrow: {
    color: "#FFFFFF",
    fontSize: 22,
    marginLeft: 12,
  },

  continueNote: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  remarksInput: {
    minHeight: 85,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8E0EB",
    borderRadius: 12,
    padding: 13,
    fontSize: 15,
    color: "#172B4D",
    marginBottom: 12,
  },

  endButton: {
    minHeight: 54,
    backgroundColor: "#DC2626",
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  endText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  endedCard: {
    backgroundColor: "#F0FDF4",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    padding: 18,
    marginTop: 8,
  },

  endedTitle: {
    color: "#15803D",
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 8,
  },

  completedNote: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 18,
  },

  backButton: {
    minHeight: 50,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },

  backText: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "600",
  },
});

