import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PROFILE_KEY = "travel_app_profile";
const PIN_KEY = "travel_app_pin";

export default function ProfileScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(true);
  const [existingProfile, setExistingProfile] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const savedProfile = await AsyncStorage.getItem(PROFILE_KEY);

        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          setUserId(profile.userId ?? "");
          setName(profile.name ?? "");
          setCompany(profile.company ?? "");
          setExistingProfile(true);
        }
      } catch {
        Alert.alert("Error", "Could not load the saved profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleContinue() {
    if (!userId.trim() || !pin.trim() || !name.trim()) {
      Alert.alert(
        "Missing information",
        "Please enter your user ID, PIN and traveller name.",
      );
      return;
    }

    if (!/^\d{4,6}$/.test(pin)) {
      Alert.alert("Invalid PIN", "Please enter a PIN of 4 to 6 digits.");
      return;
    }

    try {
      const profile = {
        userId: userId.trim(),
        name: name.trim(),
        company: company.trim(),
      };

      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      await SecureStore.setItemAsync(PIN_KEY, pin);

      setExistingProfile(true);
      setPin("");

      Alert.alert(
        "Profile saved",
        "Your profile has been saved on this device. Next, we'll add the journey dashboard.",
      );
    } catch {
      Alert.alert(
        "Save failed",
        "Your profile could not be saved. Please try again.",
      );
    }
  }

  async function handleLogin() {
    if (!enteredPin) {
      Alert.alert("Enter PIN", "Please enter your PIN.");
      return;
    }

    try {
      const savedPin = await SecureStore.getItemAsync(PIN_KEY);

      if (savedPin !== enteredPin) {
        Alert.alert("Incorrect PIN", "Please check your PIN and try again.");
        return;
      }

      setEnteredPin("");
      router.replace("/dashboard");
    } catch {
      Alert.alert(
        "Login failed",
        "Could not verify your PIN. Please try again.",
      );
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.subtitle}>Loading your profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (existingProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>🔐</Text>
            </View>

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Hello, {name}. Enter your PIN to continue.
            </Text>

            <Text style={styles.label}>User ID</Text>
            <TextInput style={styles.input} value={userId} editable={false} />

            <Text style={styles.label}>PIN</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your 4–6 digit PIN"
              placeholderTextColor="#94A3B8"
              value={enteredPin}
              onChangeText={setEnteredPin}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={6}
            />

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>Unlock App</Text>
              <Text style={styles.arrow}>→</Text>
            </Pressable>

            <Text style={styles.note}>
              Your profile is stored on this device. This PIN is a local app
              lock, not company-verified authentication.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>👤</Text>
          </View>

          <Text style={styles.title}>Traveller Profile</Text>
          <Text style={styles.subtitle}>
            Set up your details before managing your journeys.
          </Text>

          <Text style={styles.label}>User ID *</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a user ID"
            placeholderTextColor="#94A3B8"
            value={userId}
            onChangeText={setUserId}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>PIN (4–6 digits) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a PIN"
            placeholderTextColor="#94A3B8"
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={6}
          />

          <Text style={styles.label}>Traveller Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Company Name (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your company name"
            placeholderTextColor="#94A3B8"
            value={company}
            onChangeText={setCompany}
            autoCapitalize="words"
          />

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>Save Profile</Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>

          <Text style={styles.note}>
            Your details will be saved locally on this device. Your company name
            is optional.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#DCEAFE",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 27,
    fontWeight: "700",
    color: "#172B4D",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#64748B",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 26,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: "#D8E0EB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#172B4D",
  },
  button: {
    minHeight: 54,
    borderRadius: 13,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
  },
  buttonPressed: {
    backgroundColor: "#1D4ED8",
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
  note: {
    fontSize: 12,
    lineHeight: 18,
    color: "#64748B",
    textAlign: "center",
    marginTop: 18,
  },
});
