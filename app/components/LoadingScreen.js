import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { colors, typography } from "../theme/colors";

/**
 * LoadingScreen - Elegant loading animation
 */
export default function LoadingScreen() {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.1, { duration: 2000 }),
      -1,
      true
    );
    opacity.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <LinearGradient
      colors={[colors.bg_primary, colors.bg_secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.card}>
        <Animated.View style={[styles.mark, animatedStyle]}>
          <Text style={styles.markText}>W</Text>
        </Animated.View>

        <Text style={[styles.title, typography.h2]}>WAY WATCH</Text>
        <Text style={[styles.subtitle, typography.body_md]}>
          Pothole Detection System
        </Text>

        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>

        <Text style={[styles.loadingText, typography.body_sm]}>
          Fetching data
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    alignItems: "center",
    backgroundColor: colors.glass_light,
    borderWidth: 1,
    borderColor: colors.border_light,
    borderRadius: 28,
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  mark: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.bg_primary,
    borderWidth: 1,
    borderColor: colors.border_light,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  markText: {
    color: colors.text_primary,
    fontWeight: "700",
    fontSize: 32,
  },
  title: {
    color: colors.text_primary,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.text_tertiary,
    marginBottom: 32,
  },
  loaderContainer: {
    marginVertical: 24,
  },
  loadingText: {
    color: colors.text_secondary,
    marginTop: 24,
    letterSpacing: 0.3,
  },
});