import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';

const ROLES = [
  'Father',
  'Mother',
  'Son',
  'Daughter',
  'Brother',
  'Sister',
  'Other',
];

const ProfileSetupScreen = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { user, setUser } = useAuthStore();

  const handlePickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.5,
    });

    if (result.assets && result.assets[0].uri) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your full name.');
      return;
    }
    if (!role) {
      Alert.alert('Required', 'Please select your relationship role.');
      return;
    }

    setLoading(true);
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        // 1. Update Firebase Auth Profile
        await currentUser.updateProfile({
          displayName: name,
          photoURL: image || undefined,
        });

        // 2. Save to Firestore
        await firestore().collection('users').doc(currentUser.uid).set(
          {
            uid: currentUser.uid,
            displayName: name,
            phoneNumber: currentUser.phoneNumber,
            photoURL: image,
            role: role,
            createdAt: firestore.FieldValue.serverTimestamp(),
          },
          { merge: true },
        );

        // 3. Update Global State
        setUser({
          ...user!,
          displayName: name,
          photoURL: image || undefined,
          role: role,
        });
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Profile</Text>
          <Text style={styles.subtitle}>
            Set up your identity so your family members can recognize you.
          </Text>
        </View>

        <View style={styles.imageSection}>
          <TouchableOpacity
            onPress={handlePickImage}
            style={styles.imageContainer}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.profileImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.cameraIcon}>📸</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.imageLabel}>Add Photo</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="e.g. Ahmed Ali"
            value={name}
            onChangeText={setName}
          />

          <TouchableOpacity
            style={styles.rolePicker}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.label}>Relationship Role</Text>
            <View style={styles.roleValueContainer}>
              <Text style={[styles.roleText, !role && styles.placeholderText]}>
                {role || 'Select your role'}
              </Text>
              <Text style={styles.chevron}>▼</Text>
            </View>
          </TouchableOpacity>

          <Button
            title="Complete Setup"
            onPress={handleSaveProfile}
            loading={loading}
            style={styles.button}
          />
        </View>
      </ScrollView>

      {/* Role Selection Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Your Role</Text>
            <FlatList
              data={ROLES}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.roleItem}
                  onPress={() => {
                    setRole(item);
                    setIsModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.roleItemText,
                      role === item && styles.selectedRoleText,
                    ]}
                  >
                    {item}
                  </Text>
                  {role === item && <Text style={styles.checkIcon}>✓</Text>}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.xl,
  },
  header: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    fontSize: 40,
  },
  imageLabel: {
    ...FONTS.body3,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: SPACING.sm,
  },
  form: {
    marginTop: SPACING.md,
  },
  rolePicker: {
    marginBottom: SPACING.xl,
  },
  label: {
    ...FONTS.body2,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  roleValueContainer: {
    height: 56,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roleText: {
    ...FONTS.body1,
    color: COLORS.text,
  },
  placeholderText: {
    color: COLORS.textSecondary,
  },
  chevron: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  button: {
    marginTop: SPACING.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
    padding: SPACING.xl,
    maxHeight: '60%',
  },
  modalTitle: {
    ...FONTS.h2,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  roleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  roleItemText: {
    ...FONTS.body1,
    color: COLORS.text,
  },
  selectedRoleText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  checkIcon: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default ProfileSetupScreen;
