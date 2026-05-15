import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  Circle,
  Marker,
  Region,
} from 'react-native-maps';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';

const AddSafeZoneScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();

  const [name, setName] = useState('');
  const [radius, setRadius] = useState(200); // Default 200m
  const [loading, setLoading] = useState(false);
  const [center, setCenter] = useState<Region>({
    latitude: 31.5204, // Default Lahore
    longitude: 74.3587,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter a name for the safe zone.');
      return;
    }

    setLoading(true);
    try {
      await firestore()
        .collection('familyGroups')
        .doc(user?.groupId)
        .collection('safeZones')
        .add({
          name,
          latitude: center.latitude,
          longitude: center.longitude,
          radius,
          createdAt: firestore.FieldValue.serverTimestamp(),
          createdBy: user?.uid,
        });

      Alert.alert('Success', 'Safe zone added successfully!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save safe zone.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Safe Zone</Text>
          <Text style={styles.subtitle}>
            Drag the map to set the center of your safe zone.
          </Text>
        </View>

        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={center}
            onRegionChangeComplete={setCenter}
          >
            <Circle
              center={{
                latitude: center.latitude,
                longitude: center.longitude,
              }}
              radius={radius}
              fillColor="rgba(0, 168, 107, 0.2)"
              strokeColor={COLORS.primary}
              strokeWidth={2}
            />
            <Marker
              coordinate={{
                latitude: center.latitude,
                longitude: center.longitude,
              }}
            />
          </MapView>
          <View style={styles.crosshair}>
            <Text style={styles.crosshairIcon}>📍</Text>
          </View>
        </View>

        <View style={styles.form}>
          <Input
            label="Zone Name"
            placeholder="e.g. Home, School, Office"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Radius: {radius} meters</Text>
          <View style={styles.radiusOptions}>
            {[100, 200, 500, 1000].map(r => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.radiusButton,
                  radius === r && styles.activeRadius,
                ]}
                onPress={() => setRadius(r)}
              >
                <Text
                  style={[
                    styles.radiusText,
                    radius === r && styles.activeRadiusText,
                  ]}
                >
                  {r}m
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button
            title="Save Safe Zone"
            onPress={handleSave}
            loading={loading}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  mapContainer: {
    height: 300,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  crosshair: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  crosshairIcon: {
    fontSize: 30,
    marginBottom: 30,
  },
  form: {
    marginTop: SPACING.md,
  },
  label: {
    ...FONTS.body2,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  radiusOptions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: SPACING.xl,
  },
  radiusButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  activeRadius: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  radiusText: {
    ...FONTS.body3,
    color: COLORS.text,
  },
  activeRadiusText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  saveButton: {
    marginTop: SPACING.md,
  },
});

export default AddSafeZoneScreen;
