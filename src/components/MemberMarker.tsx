import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { COLORS, FONTS, SIZES } from '../constants/theme';

interface MemberMarkerProps {
  member: {
    uid: string;
    displayName: string;
    photoURL?: string;
    role: string;
    location?: {
      latitude: number;
      longitude: number;
      accuracy: number;
    };
    batteryLevel?: number;
    lastUpdated?: any;
  };
  onPress?: () => void;
}

const MemberMarker: React.FC<MemberMarkerProps> = ({ member, onPress }) => {
  if (!member.location) return null;

  const lastSeen = member.lastUpdated
    ? new Date(member.lastUpdated.seconds * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  return (
    <Marker
      coordinate={{
        latitude: member.location.latitude,
        longitude: member.location.longitude,
      }}
      onPress={onPress}
    >
      <View style={styles.markerContainer}>
        <View style={styles.avatarContainer}>
          {member.photoURL ? (
            <Image source={{ uri: member.photoURL }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholderAvatar]}>
              <Text style={styles.avatarInitial}>
                {member.displayName?.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.arrow} />
      </View>

      <Callout tooltip>
        <View style={styles.callout}>
          <Text style={styles.calloutName}>{member.displayName}</Text>
          <Text style={styles.calloutRole}>{member.role}</Text>
          <Text style={styles.calloutMeta}>
            🔋 {member.batteryLevel}% • 🕒 {lastSeen}
          </Text>
        </View>
      </Callout>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    padding: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  placeholderAvatar: {
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    ...FONTS.h3,
    color: COLORS.white,
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.primary,
    marginTop: -1,
  },
  callout: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 10,
    width: 150,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  calloutName: {
    ...FONTS.body2,
    fontWeight: '700',
    color: COLORS.text,
  },
  calloutRole: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  calloutMeta: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
});

export default MemberMarker;
