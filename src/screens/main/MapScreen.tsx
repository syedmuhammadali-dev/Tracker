import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';

const MapScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.placeholderText}>Google Maps Integrated Here</Text>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text>⬅️</Text>
      </TouchableOpacity>

      <View style={styles.overlay}>
        <View style={styles.membersList}>
          <Text style={styles.overlayTitle}>Family Circle</Text>
          {/* List of members will go here */}
          <View style={styles.memberItem}>
            <View style={styles.avatarPlaceholder} />
            <View>
              <Text style={styles.memberName}>You (Live)</Text>
              <Text style={styles.memberStatus}>Sharing location</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#D1D1D1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...FONTS.body1,
    color: COLORS.textSecondary,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
    padding: SPACING.lg,
    elevation: 10,
  },
  overlayTitle: {
    ...FONTS.h3,
    marginBottom: SPACING.md,
  },
  membersList: {
    width: '100%',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    marginRight: SPACING.md,
  },
  memberName: {
    ...FONTS.body1,
    fontWeight: '600',
  },
  memberStatus: {
    ...FONTS.body3,
    color: COLORS.success,
  },
});

export default MapScreen;
