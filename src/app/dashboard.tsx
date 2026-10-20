import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>TRAVEL EXPENSE MANAGER</Text>
        <Text style={styles.title}>Your Dashboard</Text>
        <Text style={styles.subtitle}>
          Manage your journeys and travel expenses in one place.
        </Text>

        <Pressable
          style={styles.primaryCard}
          onPress={() =>
            router.push({
              pathname: "/journey",
            })
          }
        >
          <Text style={styles.primaryIcon}>📍</Text>
          <Text style={styles.primaryTitle}>Start New Journey</Text>
          <Text style={styles.primaryDescription}>
            Record a trip and track your travel expenses.
          </Text>
          <Text style={styles.primaryAction}>Start journey →</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Other options</Text>
        <View style={styles.grid}>
          <Pressable
            style={styles.card}
            onPress={() => router.push("/history")}
          >
            <Text style={styles.cardIcon}>🕘</Text>
            <Text style={styles.cardTitle}>Journey History</Text>
            <Text style={styles.cardDescription}>View your saved trips.</Text>
          </Pressable>

          <View style={styles.card}>
            <Text style={styles.cardIcon}>🧮</Text>
            <Text style={styles.cardTitle}>Cost Calculator</Text>
            <Text style={styles.cardDescription}>
              Calculate fuel and expenses.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardIcon}>📄</Text>
            <Text style={styles.cardTitle}>Reports</Text>
            <Text style={styles.cardDescription}>Prepare travel reports.</Text>
          </View>

          <Pressable
            style={styles.card}
            onPress={() => router.push("/profile")}
          >
            <Text style={styles.cardIcon}>👤</Text>
            <Text style={styles.cardTitle}>My Profile</Text>
            <Text style={styles.cardDescription}>
              View your profile screen.
            </Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          Your journey records will be stored locally on this device.
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
    paddingBottom: 36,
  },
  eyebrow: {
    color: "#2563EB",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginTop: 14,
  },
  title: {
    color: "#172B4D",
    fontSize: 30,
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
  primaryCard: {
    backgroundColor: "#2563EB",
    borderRadius: 20,
    padding: 22,
    marginBottom: 28,
  },
  primaryIcon: {
    fontSize: 30,
    marginBottom: 12,
  },
  primaryTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
  },
  primaryDescription: {
    color: "#EAF1FF",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  primaryAction: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 22,
  },
  sectionTitle: {
    color: "#172B4D",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "48%",
    flexGrow: 1,
    flexBasis: "44%",
    minHeight: 145,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
  },
  cardIcon: {
    fontSize: 24,
    marginBottom: 12,
  },
  cardTitle: {
    color: "#172B4D",
    fontSize: 14,
    fontWeight: "700",
  },
  cardDescription: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
  footer: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 24,
  },
});
