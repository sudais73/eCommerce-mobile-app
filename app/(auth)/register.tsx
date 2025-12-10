import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import React, { useState } from 'react';
import { Link } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.loading);

  const handleSubmit = async () => {
    if (!username || !email || !password) {
      alert("All fields required!");
      return;
    }

    await register({ username, email, password });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 50}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        <View style={styles.container}>
          <Image style={styles.image} source={require('../../assets/images/img.png')} />

          <View style={styles.formContainer}>
            <Text style={styles.mainText}>Sign up to get started!</Text>

            <View style={styles.inputContainer}>
              <TextInput
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                placeholder="Username"
              />

              <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholder="Email Address"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                placeholder="Password"
                secureTextEntry
              />
            </View>


            <TouchableOpacity style={styles.signupButton} onPress={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.signupButtonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <View style={styles.switchContainer}>
              <Text style={styles.switchText}>
                Already have an account? <Link href="/(auth)/login">Log in</Link>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#96d2ca',
    padding: 20,
    justifyContent: 'center',
  },
  image: {
    width: "100%",
    height: 240,
    resizeMode: "contain",
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 14,
    gap: 20,
    elevation: 5,
  },
  mainText: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  inputContainer: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: "#96d2ca",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  signupButtonText: {
    color: "black",
    fontWeight: "700",
    fontSize: 17,
  },
  switchContainer: {
    marginTop: 5,
    alignItems: "center",
  },
  switchText: {
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontWeight: "600",
  },
});
