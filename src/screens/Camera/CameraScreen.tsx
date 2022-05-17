import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, StatusBar, StyleSheet } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

const CameraScreen = () => {
  const devices = useCameraDevices();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [isCameraActive, setIsCameraActive] = useState(false);

  const device = devices.back;

  useEffect(() => {
    const authorizeCamera = async () => {
      const permissionStatus = await Camera.getCameraPermissionStatus();
      if (permissionStatus === 'denied') {
        const result = await Camera.requestCameraPermission();
        if (result !== 'authorized') {
          Linking.openSettings();
          navigation.goBack();
        } else {
          setIsCameraActive(true);
        }
      } else if (permissionStatus === 'authorized') {
        setIsCameraActive(true);
      }
    };
    authorizeCamera().catch((err) => {
      console.log(err);
    });
  }, []);

  if (!device) {
    return <></>;
  }

  return (
    <>
      <StatusBar hidden />
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isCameraActive}
        accessibilityHint={t('camera.accessibility.hint')}
      />
    </>
  );
};

export default CameraScreen;
