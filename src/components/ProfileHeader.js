import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { spacing, borderRadius } from '../theme';
import { uploadProfilePicture } from '../services/imageUpload';

const ProfileHeader = ({ profile, role, onEdit }) => {
  const { colors, textStyles } = useTheme();
  const { user, syncProfile } = useAuth();
  const [uploading, setUploading] = useState(false);

  const displayName = () => {
    if (role === 'pharmacy') return profile?.businessName || 'Pharmacy';
    return profile?.fullName || user?.name || 'Your Name';
  };

  const subtitle = () => {
    if (role === 'doctor') return profile?.specialization || 'Doctor';
    if (role === 'pharmacy') return 'Pharmacy';
    return 'Patient';
  };

  const initials = () => {
    const name = displayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
  };

  const requestPermissions = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') { Alert.alert('Permission needed', 'Please grant media permissions.'); return false; }
      if (Platform.OS === 'ios') {
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus.status !== 'granted') Alert.alert('Camera permission needed', 'Grant camera permission to take photos.');
      }
      return true;
    } catch { return false; }
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1,1], quality: 0.7 });
    if (!result.canceled && result.assets?.[0]) await uploadImage(result.assets[0]);
  };

  const openImageLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1,1], quality: 0.7 });
    if (!result.canceled && result.assets?.[0]) await uploadImage(result.assets[0]);
  };

  const uploadImage = async (asset) => {
    if (!user?.id) { Alert.alert('Error', 'Please log in again'); return; }
    try {
      setUploading(true);
      await uploadProfilePicture(user.id, asset.uri);
      await syncProfile();
      Alert.alert('Success', 'Profile picture updated');
    } catch (e) {
      Alert.alert('Upload Error', e.message || 'Failed to update profile picture');
    } finally { setUploading(false); }
  };

  const handleImagePicker = async () => {
    const ok = await requestPermissions();
    if (!ok) return;
    Alert.alert('Profile Picture', 'Choose an option', [
      { text: 'Take Photo', onPress: openCamera },
      { text: 'Choose from Library', onPress: openImageLibrary },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const profileImageUrl = user?.profilePicture || profile?.profilePicture;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.xl, backgroundColor: colors.background.card, marginHorizontal: spacing.base, borderRadius: borderRadius.lg, marginBottom: spacing.lg }}>
      <TouchableOpacity onPress={handleImagePicker} disabled={uploading} style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: profileImageUrl ? 'transparent' : colors.primary.main, justifyContent: 'center', alignItems: 'center', marginRight: spacing.base, position: 'relative', overflow: 'hidden' }}>
        {profileImageUrl ? (
          <Image source={{ uri: profileImageUrl }} style={{ width: 80, height: 80, borderRadius: 40 }} resizeMode="cover" />
        ) : (
          <Text style={[textStyles.h2, { color: colors.text.inverse, fontSize: 28 }]}>{initials()}</Text>
        )}
        {uploading && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 40, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="cloud-upload-outline" size={24} color="white" />
          </View>
        )}
        <View style={{ position: 'absolute', bottom: -2, right: -2, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary.main, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.background.card }}>
          <Ionicons name="camera" size={14} color={colors.text.inverse} />
        </View>
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        <Text style={[textStyles.h3, { marginBottom: spacing.xs }]}>{displayName()}</Text>
        <Text style={[textStyles.bodySmall, { color: colors.text.secondary, marginBottom: spacing.sm }]}>{subtitle()}</Text>
        {(profile?.email || user?.email) && (
          <Text style={[textStyles.bodySmall, { color: colors.text.tertiary }]}>{profile?.email || user?.email}</Text>
        )}
      </View>

      <TouchableOpacity onPress={onEdit} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary.bg, justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name="create-outline" size={20} color={colors.primary.main} />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileHeader;
