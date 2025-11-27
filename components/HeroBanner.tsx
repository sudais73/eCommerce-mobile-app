import { View, Image, StyleSheet } from "react-native";

export default function HeroBanner() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://picsum.photos/201" }}
        style={styles.banner}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  banner: {
    width: "100%",
    height: 160,
    borderRadius: 14,
  },
});
