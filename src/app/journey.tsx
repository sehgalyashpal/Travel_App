import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JourneyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>NEW JOURNEY</Text>

        <Text style={styles.title}>Start Your Journey</Text>

        <Text style={styles.subtitle}>
          Record your travel details. Your journey date will automatically use
          the current device date.
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Journey date</Text>
          <Text style={styles.cardValue}>
            {new Date().toLocaleDateString()}
          </Text>
          <Text style={styles.cardNote}>Current device date</Text>
        </View>

        <Text style={styles.sectionTitle}>What will you use?</Text>

       <Pressable
  style={styles.option}
  onPress={() =>
    router.push({
      pathname: "/vehicle-details",
      params: { vehicle: "Bike" },
    })
  }
>
          <Text style={styles.optionIcon}>🏍️</Text>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Bike</Text>
            <Text style={styles.optionDescription}>
              Calculate distance and fuel expense
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <Pressable
  style={styles.option}
  onPress={() =>
    router.push({
      pathname: "/vehicle-details",
      params: { vehicle: "Car" },
    })
  }
>
          <Text style={styles.optionIcon}>🚗</Text>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Car</Text>
            <Text style={styles.optionDescription}>
              Calculate distance and fuel expense
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <Pressable
  style={styles.option}
  onPress={() =>
    router.push({
      pathname: "/vehicle-details",
      params: { vehicle: "Train" },
    })
  }
>
          <Text style={styles.optionIcon}>🚆</Text>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Train</Text>
            <Text style={styles.optionDescription}>
              Record travel information and fare
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <Pressable
  style={styles.option}
  onPress={() =>
    router.push({
      pathname: "/vehicle-details",
      params: { vehicle: "Bus" },
    })
  }
>
          <Text style={styles.optionIcon}>🚌</Text>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Bus</Text>
            <Text style={styles.optionDescription}>
              Record travel information and fare
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <Pressable
  style={styles.option}
  onPress={() =>
    router.push({
      pathname: "/vehicle-details",
      params: { vehicle: "Taxi / Auto" },
    })
  }
>
          <Text style={styles.optionIcon}>🚕</Text>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Taxi / Auto</Text>
            <Text style={styles.optionDescription}>
              Record travel information and fare
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <Pressable
  style={styles.option}
  onPress={() =>
    router.push({
      pathname: "/vehicle-details",
      params: { vehicle: "Airplane" },
    })
  }
>
          <Text style={styles.optionIcon}>✈️</Text>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Airplane</Text>
            <Text style={styles.optionDescription}>
              Record travel information and fare
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.footer}>
          Photos, location and journey records will be stored locally on the
          device in Version 1.
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
    marginBottom: 22,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 18,
    marginBottom: 26,
  },
  cardTitle: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
  },
  cardValue: {
    color: "#172B4D",
    fontSize: 21,
    fontWeight: "800",
    marginTop: 5,
  },
  cardNote: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    color: "#172B4D",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  option: {
    minHeight: 76,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  optionIcon: {
    fontSize: 28,
    width: 46,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    color: "#172B4D",
    fontSize: 16,
    fontWeight: "700",
  },
  optionDescription: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 4,
  },
  arrow: {
    color: "#64748B",
    fontSize: 28,
    marginLeft: 8,
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
  footer: {
    color: "#94A3B8",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 18,
  },
});
