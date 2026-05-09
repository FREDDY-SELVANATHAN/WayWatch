import React from "react";
import { View, Text, StyleSheet } from "react-native";
import GlassCard from "./GlassCard";
import { colors, typography, spacing } from "../theme/colors";

/**
 * EmptyState - Shows when no potholes exist
 */
export default function EmptyState() {
  return (
    <View style={styles.container}>
      <GlassCard hasGradient={false} style={styles.panel}>
        <View style={styles.content}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>System clear</Text>
          </View>

          <Text style={[styles.title, typography.h2]}>
            No issues detected
          </Text>

          <Text style={[styles.description, typography.body_md]}>
            The road network in your area is currently clear and being
            monitored continuously.
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, typography.h4]}>24/7</Text>
              <Text style={[styles.statLabel, typography.caption]}>
                Monitoring
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, typography.h4]}>Live</Text>
              <Text style={[styles.statLabel, typography.caption]}>
                System status
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, typography.h4]}>0</Text>
              <Text style={[styles.statLabel, typography.caption]}>
                Active issues
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.pulse} />
            <Text style={[styles.footerText, typography.body_sm]}>
              Scanned just now
            </Text>
          </View>
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  panel: {
    width: "100%",
    maxWidth: 560,
  },
  content: {
    alignItems: "center",
    gap: spacing.lg,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 9999,
    backgroundColor: colors.bg_secondary,
    borderWidth: 1,
    borderColor: colors.border_light,
  },
  badgeText: {
    color: colors.text_secondary,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  title: {
    color: colors.text_primary,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  description: {
    color: colors.text_secondary,
    textAlign: "center",
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
    width: "100%",
    paddingTop: spacing.sm,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderRadius: 16,
    backgroundColor: colors.glass_light,
    borderWidth: 1,
    borderColor: colors.border_light,
  },
  statValue: {
    color: colors.text_primary,
    fontWeight: "800",
  },
  statLabel: {
    color: colors.text_tertiary,
    textAlign: "center",
    marginTop: 2,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  pulse: {
    width: 8,
    height: 8,
    borderRadius: 9999,
    backgroundColor: colors.primary,
  },
  footerText: {
    color: colors.text_muted,
  },
});
