import React from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBar, StyleSheet } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

const CameraScreen = () => {
  const devices = useCameraDevices();
  const { t } = useTranslation();
  const device = devices.back;

  if (!device) {
    return <></>;
  }

  return (
    <>
      <StatusBar hidden />
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        accessibilityHint={t('camera.accessibility.hint')}
      />
    </>
  );
};

export default CameraScreen;
