import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/useAuthStore';
import MemberMarker from '../../components/MemberMarker';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';

const FamilyMapScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [followUser, setFollowUser] = useState(false);
  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState<Region>({
    latitude: 31.5204, // Default to Lahore
    longitude: 74.3587,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    if (!user?.groupId) return;

    const unsubscribe = firestore()
      .collection('familyGroups')
      .doc(user.groupId)
      .collection('members')
      .onSnapshot(
        snapshot => {
          const memberList = snapshot.docs.map(doc => doc.data());
          setMembers(memberList);
          setLoading(false);

          // If following user, update region to current user's location
          if (followUser) {
            const currentUserData = memberList.find(m => m.uid === user.uid);
            if (currentUserData?.location) {
              mapRef.current?.animateToRegion({
                latitude: currentUserData.location.latitude,
                longitude: currentUserData.location.longitude,
                latitudeDelta: region.latitudeDelta,
                longitudeDelta: region.longitudeDelta,
              });
            }
          }
        },
        error => {
          console.error(error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [user?.groupId, followUser]);

  const recenterToMembers = () => {
    if (members.length === 0) return;

    const validLocations = members.filter(m => m.location);
    if (validLocations.length === 0) return;

    if (validLocations.length === 1) {
      mapRef.current?.animateToRegion({
        latitude: validLocations[0].location.latitude,
        longitude: validLocations[0].location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      return;
    }

    mapRef.current?.fitToCoordinates(
      validLocations.map(m => ({
        latitude: m.location!.latitude,
        longitude: m.location!.longitude,
      })),
      {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      },
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={false}
        showsMyLocationButton={false}
        onRegionChangeComplete={setRegion}
      >
        {members.map(member => (
          <MemberMarker key={member.uid} member={member} />
        ))}
      </MapView>

      {/* Header / Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, followUser && styles.activeControl]}
          onPress={() => setFollowUser(!followUser)}
        >
          <Text style={styles.controlIcon}>{followUser ? '📍' : '🧭'}</Text>
          <Text style={styles.controlText}>Follow Me</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={recenterToMembers}
        >
          <Text style={styles.controlIcon}>🎯</Text>
          <Text style={styles.controlText}>Fit All</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}

      {/* Members Bottom Bar (Optional summary) */}
      <View style={styles.bottomBar}>
        <Text style={styles.membersCount}>
          {members.length} Members in Circle
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.text,
  },
  controls: {
    position: 'absolute',
    right: 20,
    top: 50,
    gap: 12,
  },
  controlButton: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 70,
  },
  activeControl: {
    backgroundColor: COLORS.primary,
  },
  controlIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  controlText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: SIZES.radius,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    alignItems: 'center',
  },
  membersCount: {
    ...FONTS.body3,
    fontWeight: '700',
    color: COLORS.text,
  },
});

export default FamilyMapScreen;
