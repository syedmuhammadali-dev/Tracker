import Geolocation from 'react-native-geolocation-service';
import BackgroundService from 'react-native-background-actions';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import DeviceInfo from 'react-native-device-info';
import { Alert, PermissionsAndroid, Platform } from 'react-native';

const sleep = (time: number) =>
  new Promise(resolve => setTimeout(resolve, time));

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

const backgroundOptions = {
  taskName: 'SafeCirclePKLocation',
  taskTitle: 'SafeCircle PK',
  taskDesc: 'Sharing live location with your family',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#00A86B',
  parameters: {
    delay: 30000, // 30 seconds
  },
};

export const LocationService = {
  async requestPermissions() {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('always');
      return auth === 'granted';
    }

    if (Platform.OS === 'android') {
      const foreground = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (foreground !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          'Permission Denied',
          'Foreground location permission is required.',
        );
        return false;
      }

      // For Android 10+
      if (Platform.Version >= 29) {
        const background = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        );
        if (background !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission Denied',
            'Background location permission is required for continuous family safety.',
          );
          return false;
        }
      }
      return true;
    }
    return false;
  },

  async locationTask(taskDataArguments: any) {
    const { delay } = taskDataArguments;
    await new Promise(async resolve => {
      while (BackgroundService.isRunning()) {
        Geolocation.getCurrentPosition(
          async position => {
            await LocationService.updateFirestoreLocation(position);
          },
          error => {
            console.error('Location Error:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
            forceRequestLocation: true,
          },
        );
        await sleep(delay);
      }
    });
  },

  async startSharing() {
    const hasPermissions = await this.requestPermissions();
    if (!hasPermissions) return false;

    try {
      if (!BackgroundService.isRunning()) {
        await BackgroundService.start(this.locationTask, backgroundOptions);
      }
      return true;
    } catch (error) {
      console.error('Start Sharing Error:', error);
      return false;
    }
  },

  async stopSharing() {
    try {
      if (BackgroundService.isRunning()) {
        await BackgroundService.stop();
      }
      return true;
    } catch (error) {
      console.error('Stop Sharing Error:', error);
      return false;
    }
  },

  async updateFirestoreLocation(position: Geolocation.GeoPosition) {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    try {
      const batteryLevel = await DeviceInfo.getBatteryLevel();
      const { latitude, longitude, accuracy } = position.coords;

      const locationData = {
        location: {
          latitude,
          longitude,
          accuracy,
        },
        batteryLevel: Math.round(batteryLevel * 100),
        lastUpdated: firestore.FieldValue.serverTimestamp(),
      };

      // Always update user's own profile
      await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .set(locationData, { merge: true });

      // Fetch user data to check groupId
      const userDoc = await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .get();
      const userData = userDoc.data();
      const groupId = userData?.groupId;

      if (groupId) {
        const memberDoc = await firestore()
          .collection('familyGroups')
          .doc(groupId)
          .collection('members')
          .doc(currentUser.uid)
          .get();

        const memberData = memberDoc.data();

        // 1. Check Pause Sharing
        if (memberData?.pauseSharing) {
          console.log('Location sharing is paused by user');
          return;
        }

        // 2. Check Scheduled Sharing
        if (memberData?.shareDuringHours) {
          const now = new Date();
          const currentTime = `${now
            .getHours()
            .toString()
            .padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
          const start = memberData.startHour || '00:00';
          const end = memberData.endHour || '23:59';

          if (currentTime < start || currentTime > end) {
            console.log('Outside sharing hours');
            return;
          }
        }

        // 3. Update in group members
        const groupLocationData = {
          ...locationData,
          isInvisible: memberData?.invisibleMode || false,
        };

        await firestore()
          .collection('familyGroups')
          .doc(groupId)
          .collection('members')
          .doc(currentUser.uid)
          .set(groupLocationData, { merge: true });

        // Check Safe Zones
        await this.checkSafeZones(
          groupId,
          currentUser.uid,
          latitude,
          longitude,
        );
      }
    } catch (error) {
      console.error('Error updating location to Firestore:', error);
    }
  },

  async checkSafeZones(
    groupId: string,
    userId: string,
    lat: number,
    lng: number,
  ) {
    try {
      const zonesSnapshot = await firestore()
        .collection('familyGroups')
        .doc(groupId)
        .collection('safeZones')
        .get();

      const userDoc = await firestore().collection('users').doc(userId).get();
      const userData = userDoc.data();
      const previousZones = userData?.currentZones || [];
      const newZones: string[] = [];

      for (const zoneDoc of zonesSnapshot.docs) {
        const zone = zoneDoc.data();
        const distance = calculateDistance(
          lat,
          lng,
          zone.latitude,
          zone.longitude,
        );

        if (distance <= zone.radius) {
          newZones.push(zone.name);
          if (!previousZones.includes(zone.name)) {
            // Entered Zone
            this.sendZoneAlert(
              groupId,
              userData?.displayName,
              zone.name,
              'entered',
            );
          }
        } else if (previousZones.includes(zone.name)) {
          // Exited Zone
          this.sendZoneAlert(
            groupId,
            userData?.displayName,
            zone.name,
            'exited',
          );
        }
      }

      await firestore().collection('users').doc(userId).update({
        currentZones: newZones,
      });
    } catch (error) {
      console.error('Error checking safe zones:', error);
    }
  },

  async sendZoneAlert(
    groupId: string,
    userName: string,
    zoneName: string,
    action: 'entered' | 'exited',
  ) {
    // In a real app, this would trigger a push notification via Firebase Functions.
    // For now, we'll log it and create a notification in Firestore.
    try {
      await firestore()
        .collection('familyGroups')
        .doc(groupId)
        .collection('alerts')
        .add({
          title: 'Safe Zone Alert',
          message: `${userName} has ${action} the ${zoneName} safe zone.`,
          type: 'geofence',
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.error('Error sending zone alert:', error);
    }
  },
};
