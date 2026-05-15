import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../types/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';
import Button from '../../components/common/Button';

const SafeZonesListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const { user } = useAuthStore();
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.groupId) return;

    const unsubscribe = firestore()
      .collection('familyGroups')
      .doc(user.groupId)
      .collection('safeZones')
      .onSnapshot(
        snapshot => {
          const zoneList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setZones(zoneList);
          setLoading(false);
        },
        error => {
          console.error(error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [user?.groupId]);

  const handleDeleteZone = (zoneId: string) => {
    firestore()
      .collection('familyGroups')
      .doc(user?.groupId)
      .collection('safeZones')
      .doc(zoneId)
      .delete();
  };

  const renderZone = ({ item }: { item: any }) => (
    <View style={styles.zoneItem}>
      <View style={styles.zoneInfo}>
        <Text style={styles.zoneName}>{item.name}</Text>
        <Text style={styles.zoneDetails}>Radius: {item.radius}m</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteZone(item.id)}
      >
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Safe Zones</Text>
          <Text style={styles.subtitle}>
            Get notified when family members enter or exit these areas.
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={zones}
            keyExtractor={item => item.id}
            renderItem={renderZone}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No safe zones added yet.</Text>
              </View>
            }
          />
        )}

        <Button
          title="Add New Safe Zone"
          onPress={() => navigation.navigate('AddSafeZone')}
          style={styles.addButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  loader: {
    marginTop: SPACING.xxl,
  },
  list: {
    paddingBottom: SPACING.xl,
  },
  zoneItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    ...FONTS.body1,
    fontWeight: '700',
    color: COLORS.text,
  },
  zoneDetails: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    fontSize: 18,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
  },
  emptyText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  addButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
});

export default SafeZonesListScreen;
