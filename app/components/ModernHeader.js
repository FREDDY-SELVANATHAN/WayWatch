import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { colors, spacing, typography, shadows } from "../theme/colors";

/**
 * ModernHeader - Premium animated header with system status
 */
export default function ModernHeader({
  title = "WAY WATCH",
  subtitle = "Smart City Dashboard",
  statusIndicator = "online",
  showAnimation = true,
}) {
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (showAnimation && statusIndicator === "online") {
      pulseScale.value = withRepeat(
        withTiming(1.2, { duration: 2000 }),
        -1,
        true
      );
    }
  }, [showAnimation, statusIndicator]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const statusColor =
    statusIndicator === "online" ? colors.low : colors.critical;
  const statusText = statusIndicator === "online" ? "Live data" : "Offline";

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <View style={styles.logoSection}>
            <View style={styles.logoMark}>
              <Text style={styles.logo}>W</Text>
            </View>
            <View>
              <Text style={[styles.title, typography.h5, { fontWeight: '700' }]}>{title}</Text>
              <Text style={[styles.subtitle, typography.body_sm]}>
                {subtitle}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statusIndicator}>
          <Animated.View
            style={[
              styles.statusPulse,
              {
                backgroundColor: statusColor,
              },
              pulseStyle,
            ]}
          />
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: statusColor,
              },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              {
                color: statusColor,
              },
            ]}
          >
            {statusText}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.glass_light,
    borderWidth: 1,
    borderColor: colors.border_light,
  },
  logo: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
  },
  title: {
    color: colors.text_primary,
    fontWeight: "700",
    letterSpacing: 1.4,
  },
  subtitle: {
    color: colors.text_tertiary,
    marginTop: 2,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.glass_light,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: colors.border_light,
  },
  statusPulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: "absolute",
    opacity: 0.3,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    elevation: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.border_light,
  },
});
