import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";

// Components
import PotholeMap from "./components/PotholeMap";
import ModernHeader from "./components/ModernHeader";
import LoadingScreen from "./components/LoadingScreen";
import EmptyState from "./components/EmptyState";
import GlassCard from "./components/GlassCard";
import AnimatedStatCard from "./components/AnimatedStatCard";
import AIInsightCard from "./components/AIInsightCard";
import PotholeBottomSheet from "./components/PotholeBottomSheet";

// Theme
import { colors, spacing, typography } from "./theme/colors";

/**
 * Smart Road Quality Monitoring System - React Native App
 * Modern, premium smart-city dashboard for real-time pothole detection
 */

const BACKEND_IP = "192.168.56.100";
const BACKEND_PORT = 3000;
const BACKEND_HOST =
  Platform.OS === "web"
    ? "localhost"
    : Platform.OS === "android"
    ? "10.0.2.2"
    : BACKEND_IP;
const BACKEND_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}`;

const DEFAULT_REGION = {
  latitude: 13.0827,
  longitude: 80.2707,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// Modern severity colors
const SEVERITY_COLORS = {
  1: colors.low,
  2: colors.medium,
  3: colors.critical,
};

const SEVERITY_LABELS = {
  1: "Low Impact",
  2: "Medium Impact",
  3: "Critical",
};

export default function App() {
  const scrollViewRef = React.useRef(null);
  const [potholes, setPotholes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [currentRegion, setCurrentRegion] = useState(DEFAULT_REGION);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPothole, setSelectedPothole] = useState(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [systemStatus, setSystemStatus] = useState("online");

  /**
   * Fetch potholes from backend
   */
  const fetchPotholes = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/potholes`, {
        timeout: 5000,
      });
      setPotholes(response.data.potholes || []);
      setError(null);
      setSystemStatus("online");
    } catch (err) {
      console.log("Connection error:", err.message);
      setError(`Cannot connect to backend at ${BACKEND_URL}`);
      setSystemStatus("offline");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Fetch statistics from backend
   */
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/stats`, {
        timeout: 5000,
      });
      setStats(response.data);
    } catch (err) {
      console.log("Stats error:", err.message);
    }
  };

  const buildAddress = (reverseGeocodeResult) => ({
    street:
      reverseGeocodeResult?.street ||
      reverseGeocodeResult?.name ||
      "Unknown street",
    area:
      reverseGeocodeResult?.district ||
      reverseGeocodeResult?.subregion ||
      reverseGeocodeResult?.city ||
      "Unknown area",
    pincode: reverseGeocodeResult?.postalCode || "Unknown pincode",
    displayName: [
      reverseGeocodeResult?.street || reverseGeocodeResult?.name,
      reverseGeocodeResult?.district ||
        reverseGeocodeResult?.subregion ||
        reverseGeocodeResult?.city,
      reverseGeocodeResult?.postalCode,
    ]
      .filter(Boolean)
      .join(", "),
  });

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return {
        street: data.address?.road || "Unknown",
        area: data.address?.suburb || data.address?.city || "Unknown",
        pincode: data.address?.postcode || "Unknown",
        displayName: data.display_name || "Unknown",
      };
    } catch (err) {
      console.log("Reverse geocoding failed", err);
      return {
        street: "Unknown",
        area: "Unknown",
        pincode: "Unknown",
        displayName: "Unknown",
      };
    }
  };

  const publishCurrentDeviceLocation = async () => {
    try {
      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        console.log("Location permission denied");
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const address = await reverseGeocode(location.lat, location.lng);

      setCurrentRegion({
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });

      await axios.post(
        `${BACKEND_URL}/device-location`,
        { location, address },
        { timeout: 5000 }
      );

      console.log("Location sent:", location);
    } catch (err) {
      console.log("Location publish error:", err.message);
    }
  };

  /**
   * Confirm pothole existence (user action)
   */
  const confirmPothole = async (id, exists) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/confirm`,
        { id, exists },
        { timeout: 5000 }
      );

      if (response.status === 200) {
        const action = exists ? "Still Exists - Confirmed" : "Resolved";
        Alert.alert("Success", `Pothole ${action}! Thank you for the update.`);
        fetchPotholes();
        fetchStats();
      }
    } catch (err) {
      Alert.alert("Error", "Failed to update pothole: " + err.message);
    }
  };

  /**
   * Handle pothole marker press
   */
  const handlePotholePress = (pothole) => {
    setSelectedPothole(pothole);
    setBottomSheetVisible(true);
  };

  const refreshDashboard = () => {
    setRefreshing(true);
    fetchPotholes();
    fetchStats();
  };

  const jumpToMap = () => {
    scrollViewRef.current?.scrollToEnd?.({ animated: true });
  };

  // Setup data polling
  useEffect(() => {
    publishCurrentDeviceLocation();
    fetchPotholes();
    fetchStats();

    const interval = setInterval(() => {
      fetchPotholes();
      fetchStats();
    }, 1000);

    const locationInterval = setInterval(publishCurrentDeviceLocation, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(locationInterval);
    };
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  const criticalCount = stats?.severityCounts?.[3] || 0;
  const mediumCount = stats?.severityCounts?.[2] || 0;
  const lowCount = stats?.severityCounts?.[1] || 0;

  return (
    <LinearGradient
      colors={[colors.bg_primary, colors.bg_secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <ModernHeader
          title="WAY WATCH"
          subtitle="Pothole Detection System"
          statusIndicator={systemStatus}
        />

        {/* Error Banner */}
        {error && (
          <GlassCard
            style={styles.errorBanner}
            shadow="md"
            hasGradient={false}
          >
            <Text style={[styles.errorText, typography.body_sm]}>
              System warning: {error}
            </Text>
            <Text style={[styles.errorSubtext, typography.caption]}>
              Start the backend from the backend folder to restore live data.
            </Text>
          </GlassCard>
        )}

        {/* Main Content */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshDashboard}
              tintColor={colors.primary}
            />
          }
        >
          <View style={styles.heroSection}>
            <View style={styles.heroBadge}>
              <View style={styles.heroBadgeDot} />
              <Text style={styles.heroBadgeText}>Live system overview</Text>
            </View>

            <Text style={[styles.heroTitle, typography.h1]}>
              WAY WATCH{"\n"}
              <Text style={styles.heroTitleAccent}>Road Monitoring</Text>
            </Text>

            <Text style={[styles.heroSubtitle, typography.body_lg]}>
              Tap markers to confirm potholes and help keep roads safe.
            </Text>

            <View style={styles.heroActions}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={refreshDashboard}
                style={[styles.primaryButton, styles.heroButtonShadow]}
              >
                <Text style={styles.primaryButtonText}>Refresh data</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={jumpToMap}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>View map</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={jumpToMap}
              style={styles.inlineLink}
            >
              <Text style={styles.inlineLinkText}>Jump to detected issues</Text>
            </TouchableOpacity>
          </View>

          {/* Dashboard Stats */}
          {stats && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, typography.h3]}>
                Dashboard
              </Text>

              <View style={styles.statsGrid}>
                <View style={styles.statColumn}>
                  <AnimatedStatCard
                    label="Total Potholes"
                    value={stats.totalPotholes || 0}
                    color={colors.primary}
                    unit=""
                  />
                </View>
                <View style={styles.statColumn}>
                  <AnimatedStatCard
                    label="Critical (Red)"
                    value={criticalCount}
                    color={colors.critical}
                    unit=""
                  />
                </View>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statColumn}>
                  <AnimatedStatCard
                    label="Medium (Yellow)"
                    value={mediumCount}
                    color={colors.medium}
                    unit=""
                  />
                </View>
                <View style={styles.statColumn}>
                  <AnimatedStatCard
                    label="Small (Low)"
                    value={lowCount}
                    color={colors.low}
                    unit=""
                  />
                </View>
              </View>

              <AnimatedStatCard
                label="Confirmations"
                value={stats.totalConfirmations || 0}
                color={colors.secondary}
              />
            </View>
          )}

          {/* AI Insights Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, typography.h3]}>
              AI Insights
            </Text>

            {criticalCount > 0 && (
              <AIInsightCard
                title="Critical Zones Detected"
                description={`${criticalCount} critical potholes detected. Immediate action recommended for road safety.`}
                severity="critical"
                actionText="View Details"
                onPress={() => {}}
              />
            )}

            {mediumCount > 0 && (
              <AIInsightCard
                title="Maintenance Hotspots"
                description={`${mediumCount} medium-impact issues identified. Schedule preventive maintenance.`}
                severity="warning"
                actionText="Plan Repairs"
              />
            )}

            <AIInsightCard
              title="Road Health Status"
              description={
                potholes.length === 0
                  ? "Excellent condition! Roads are well-maintained."
                  : `${potholes.length} issues monitored. Continuous surveillance active.`
              }
              severity={potholes.length === 0 ? "info" : "warning"}
              actionText="Full Report"
            />
          </View>

          {/* Map Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, typography.h3]}>
              Detected Issues Map
            </Text>

            <GlassCard hasGradient={true} style={styles.mapContainer}>
              <PotholeMap
                initialRegion={currentRegion}
                potholes={potholes}
                severityColors={SEVERITY_COLORS}
                severityLabels={SEVERITY_LABELS}
                onPotholePress={handlePotholePress}
              />
            </GlassCard>
          </View>

          {/* Empty State */}
          {potholes.length === 0 && <EmptyState />}
        </ScrollView>

        {/* Bottom Sheet Modal */}
        <PotholeBottomSheet
          visible={bottomSheetVisible}
          pothole={selectedPothole}
          onClose={() => setBottomSheetVisible(false)}
          onConfirm={confirmPothole}
          severityLabels={SEVERITY_LABELS}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    backgroundColor: colors.bg_primary,
  },
  container: {
    flex: 1,
  },
  errorBanner: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.critical,
    padding: spacing.md,
  },
  errorText: {
    color: colors.text_primary,
    fontWeight: "600",
  },
  errorSubtext: {
    color: colors.text_tertiary,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  heroSection: {
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.glass_light,
    borderWidth: 1,
    borderColor: colors.border_light,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 9999,
    marginBottom: spacing.lg,
  },
  heroBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  heroBadgeText: {
    color: colors.text_secondary,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  heroTitle: {
    color: colors.text_primary,
    textAlign: "center",
    fontWeight: "800",
    letterSpacing: -1,
    lineHeight: 46,
    maxWidth: 560,
    fontSize: 38,
  },
  heroTitleAccent: {
    color: colors.text_secondary,
  },
  heroSubtitle: {
    color: colors.text_secondary,
    textAlign: "center",
    maxWidth: 560,
    marginTop: spacing.md,
  },
  heroActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  primaryButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 16,
  },
  heroButtonShadow: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  secondaryButton: {
    backgroundColor: colors.glass_light,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border_medium,
  },
  secondaryButtonText: {
    color: colors.text_primary,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  inlineLink: {
    marginTop: spacing.md,
  },
  inlineLinkText: {
    color: colors.text_secondary,
    textDecorationLine: "underline",
    fontSize: 13,
    fontWeight: "600",
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    color: colors.text_primary,
    fontWeight: "700",
    marginBottom: spacing.lg,
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statColumn: {
    flex: 1,
  },
  mapContainer: {
    height: 300,
    borderRadius: 20,
    overflow: "hidden",
  },
});
