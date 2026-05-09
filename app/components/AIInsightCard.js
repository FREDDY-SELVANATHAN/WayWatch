import React from "react";
import { View, Text, StyleSheet } from "react-native";
import GlassCard from "./GlassCard";
import { colors, typography, spacing } from "../theme/colors";

/**
 * AIInsightCard - Premium card for AI-generated insights
 */
export default function AIInsightCard({
  title,
  description,
  severity,
  actionText,
  onPress,
}) {
  const severityLabel =
    severity === "critical"
      ? "Critical"
      : severity === "warning"
      ? "Warning"
      : severity === "info"
      ? "Info"
      : "Insight";

  const severityColor =
    severity === "critical"
      ? colors.critical
      : severity === "warning"
      ? colors.medium
      : severity === "info"
      ? colors.primary
      : colors.secondary;

  const severityBackground =
    severity === "critical"
      ? "rgba(225, 29, 72, 0.06)"
      : severity === "warning"
      ? "rgba(217, 119, 6, 0.06)"
      : severity === "info"
      ? "rgba(17, 24, 39, 0.05)"
      : "rgba(17, 24, 39, 0.04)";

  return (
    <GlassCard
      onPress={onPress}
      hasGradient={false}
      shadow="md"
      padding={0}
      style={styles.card}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: severityBackground,
            borderBottomColor: colors.border_light,
          },
        ]}
      >
        <View style={styles.headerTextBlock}>
          <Text style={styles.headerTitle}>AI review</Text>
          <Text style={styles.headerSubtitle}>{severityLabel}</Text>
        </View>

        <View style={[styles.severityChip, { borderColor: severityColor }]}>
          <Text style={[styles.severityText, { color: severityColor }]}>
            {severityLabel}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, typography.body_lg]}>
          {title}
        </Text>
        <Text style={[styles.description, typography.body_sm]}>
          {description}
        </Text>

        {actionText && (
          <View style={styles.actionContainer}>
            <Text style={styles.actionText}>{actionText}</Text>
            <Text style={styles.arrow}>→</Text>
          </View>
        )}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  headerTextBlock: {
    flex: 1,
  },
  headerTitle: {
    color: colors.text_primary,
    fontWeight: "600",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerSubtitle: {
    color: colors.text_tertiary,
    fontSize: 12,
    marginTop: 2,
  },
  severityChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 9999,
    backgroundColor: colors.glass_light,
  },
  severityText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    color: colors.text_primary,
    fontWeight: "600",
  },
  description: {
    color: colors.text_secondary,
    lineHeight: 18,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border_light,
  },
  actionText: {
    color: colors.text_primary,
    fontWeight: "600",
    fontSize: 12,
  },
  arrow: {
    color: colors.text_primary,
    fontSize: 16,
    fontWeight: "700",
  },
});
