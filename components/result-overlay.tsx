import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

export type ResultType = "success" | "error";

interface Palette {
  bg: string;
  ring: string;
  icon: string;
  title: string;
}

const PALETTES: Record<ResultType, Palette> = {
  success: { bg: "#0a2e1a", ring: "#22c55e", icon: "#22c55e", title: "#22c55e" },
  error: { bg: "#2e0a0a", ring: "#ef4444", icon: "#ef4444", title: "#ef4444" },
};

function SuccessIcon({ color }: { color: string }) {
  return (
    <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2} />
      <Path d="M8 12l3 3 5-5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ErrorIcon({ color }: { color: string }) {
  return (
    <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2} />
      <Path d="M15 9l-6 6M9 9l6 6" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

interface ResultOverlayProps {
  visible: boolean;
  type: ResultType;
  title: string;
  subtitle?: string;
  onDismiss: () => void;
  autoDismissMs?: number;
}

export default function ResultOverlay({
  visible,
  type,
  title,
  subtitle,
  onDismiss,
  autoDismissMs = 2500,
}: ResultOverlayProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      ]).start();

      const timer = setTimeout(onDismiss, autoDismissMs);
      return () => clearTimeout(timer);
    } else {
      opacity.setValue(0);
      scale.setValue(0.85);
    }
  }, [visible]);

  if (!visible) return null;

  const palette = PALETTES[type];
  const Icon = type === "success" ? SuccessIcon : ErrorIcon;

  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <Animated.View style={[styles.card, { backgroundColor: palette.bg, transform: [{ scale }] }]}>
        <View style={[styles.ring, { borderColor: palette.ring }]}>
          <Icon color={palette.icon} />
        </View>
        <Text style={[styles.title, { color: palette.title }]}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </Animated.View>
    </Animated.View>
  );
}

export function useResultOverlay() {
  const [state, setState] = React.useState<{
    visible: boolean;
    type: ResultType;
    title: string;
    subtitle?: string;
  }>({ visible: false, type: "success", title: "" });

  const show = (type: ResultType, title: string, subtitle?: string) =>
    setState({ visible: true, type, title, subtitle });

  const hide = () => setState((s) => ({ ...s, visible: false }));

  const overlay = (
    <ResultOverlay
      visible={state.visible}
      type={state.type}
      title={state.title}
      subtitle={state.subtitle}
      onDismiss={hide}
    />
  );

  return { show, hide, overlay };
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  card: {
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    width: 260,
  },
  ring: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#9ca3af", textAlign: "center" },
});
