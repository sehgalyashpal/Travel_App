import { useRouter } from "expo-router";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FB" />

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>🚗</Text>
        </View>

        <Text style={styles.title}>Conveyance Travel Calculator</Text>

        <Text style={styles.description}>
          Track your journeys, record travel expenses, calculate distance and
          prepare expense reports in one place.
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Your journey, organised</Text>
          <Text style={styles.infoText}>
            📍 Record journey locations and distance
          </Text>
          <Text style={styles.infoText}>
            ⛽ Calculate estimated fuel expenses
          </Text>
          <Text style={styles.infoText}>
            🧾 Keep travel expenses and bills together
          </Text>
          <Text style={styles.infoText}>📄 Prepare travel expense reports</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.buttonText}>Start Journey</Text>
          <Text style={styles.arrow}>→</Text>
        </Pressable>

        <Text style={styles.footer}>
          Your travel records will be stored on your device in Version 1.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: "#DCEAFE",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  icon: {
    fontSize: 38,
  },
  title: {
    fontSize: 29,
    fontWeight: "700",
    color: "#172B4D",
    textAlign: "center",
    lineHeight: 36,
  },
  description: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 23,
    marginTop: 14,
    marginBottom: 28,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E6EAF0",
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#172B4D",
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 24,
    marginBottom: 10,
  },
  button: {
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  buttonPressed: {
    backgroundColor: "#1D4ED8",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  arrow: {
    color: "#FFFFFF",
    fontSize: 23,
    marginLeft: 12,
  },
  footer: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
    marginTop: 22,
  },
});
