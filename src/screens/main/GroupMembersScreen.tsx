import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useRoute, RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../../types/navigation';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';

const GroupMembersScreen = () => {
  const route = useRoute<RouteProp<MainStackParamList, 'GroupMembers'>>();
  const { groupId } = route.params;
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('familyGroups')
      .doc(groupId)
      .collection('members')
      .onSnapshot(
        snapshot => {
          const memberList = snapshot.docs.map(doc => doc.data());
          setMembers(memberList);
          setLoading(false);
        },
        error => {
          console.error(error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [groupId]);

  const renderMember = ({ item }: { item: any }) => (
    <View style={styles.memberItem}>
      <View style={styles.avatarContainer}>
        {item.photoURL ? (
          <Image source={{ uri: item.photoURL }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <Text style={styles.avatarInitial}>
              {item.displayName?.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.displayName}</Text>
        <Text style={styles.memberRole}>{item.role}</Text>
      </View>
      <View style={styles.statusIndicator} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Circle Members</Text>
          <Text style={styles.subtitle}>
            Everyone who is part of your family circle.
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
            data={members}
            keyExtractor={item => item.uid}
            renderItem={renderMember}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No members found.</Text>
            }
          />
        )}
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
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarContainer: {
    marginRight: SPACING.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderAvatar: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    ...FONTS.h3,
    color: COLORS.white,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    ...FONTS.body1,
    fontWeight: '700',
    color: COLORS.text,
  },
  memberRole: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.success,
  },
  emptyText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xxl,
  },
});

export default GroupMembersScreen;
