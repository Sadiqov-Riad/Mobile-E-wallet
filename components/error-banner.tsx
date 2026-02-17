import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";

interface ErrorBannerProps {
  message: string | null;
  onDismiss: () => void;
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  const translateY = useRef(new Animated.Value(-80)).current;

  useEffect(() => {
    if (message) {
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
      const timer = setTimeout(onDismiss, 5000);
      return () => clearTimeout(timer);
    } else {
      Animated.timing(translateY, { toValue: -80, duration: 200, useNativeDriver: true }).start();
    }
  }, [message]);

  if (!message) return null;

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY }] }]}>
      <Text style={styles.text} numberOfLines={2}>
        {message}
      </Text>
      <TouchableOpacity onPress={onDismiss}>
        <Text style={styles.dismiss}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: "#dc2626",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  text: { color: "#fff", fontSize: 14, fontWeight: "500", flex: 1, marginRight: 8 },
  dismiss: { color: "#fff", fontSize: 18, fontWeight: "700", padding: 4 },
});
