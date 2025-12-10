import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Link } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const handleSubmit = async () => {
    if (!email || !password) {
      alert("Please enter email & password");
      return;
    }

    await login({ email, password });
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
          <Image
            style={styles.image}
            source={require('../../assets/images/img.png')}
          />

          <View style={styles.formContainer}>
            <Text style={styles.mainText}>Welcome Back!</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoComplete="email"
                returnKeyType="next" 
               
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            
            <TouchableOpacity
              style={[styles.signupButton, loading && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={styles.signupButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={styles.switchContainer}>
              <Text style={styles.switchText}>
                Do not have an account? <Link href="/(auth)/register">Register</Link>
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
  },
  image: {
    width: 400,
    height: 300,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  formContainer: {
    marginTop: 20,
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#fff',
    gap: 20,
  },
  mainText: {
    fontSize: 20,
    fontWeight: '700',
  },
  inputContainer: {
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 16,
  },
  signupButton: {
    backgroundColor: '#96d2ca',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  signupButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  switchText: {
    color: '#96d2ca',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText:{
    color:'red',
    fontSize:15,
    textAlign:'right'
  }
});
