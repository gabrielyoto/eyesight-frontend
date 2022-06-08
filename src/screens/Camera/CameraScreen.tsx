import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, StatusBar, StyleSheet, Text } from 'react-native';
import Canvas from 'react-native-canvas';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { detectObjects } from '../../services/Tensorflow';
import { useModel } from '../../hooks/useModel';

const CameraScreen = () => {
  const devices = useCameraDevices();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const model = useModel();

  const canvas = useRef<Canvas | null>(null);
  const camera = useRef<Camera | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraAvailable, setIsCameraAvailable] = useState(false);
  const [predictions, setPredictions] = useState<
    Array<{
      bbox: number[];
      class: number;
      score: string;
      label: string;
    }>
  >([]);

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
      console.error(err);
    });
  }, []);

  useEffect(() => {
    const runCoco = async () => {
      const detectInSnapshot = async () => {
        if (!camera.current || !isCameraAvailable) {
          return;
        }
        console.error('taking snapshot');
        const snapshot = await camera.current.takeSnapshot({
          quality: 0.5,
        });
        if (!model) {
          return;
        }

        console.error('detecting objects');
        const objects = await detectObjects(
          {
            uri: `file://${snapshot.path}`,
            height: snapshot.height,
            width: snapshot.width,
          },
          model
        );
        console.error(objects);

        if (objects) {
          setPredictions(objects);
        }
        detectInSnapshot();
      };
      setTimeout(async () => {
        await detectInSnapshot().catch((err) => console.error(err));
      }, 2000);
    };
    runCoco().catch((err) =>
      console.error({ message: 'Erro ao carregar a rede', error: err })
    );
  }, [isCameraAvailable]);

  if (!device) {
    return <></>;
  }

  const renderPrediction = (
    prediction: {
      bbox: number[];
      class: number;
      score: string;
      label: string;
    },
    index: number
  ) => {
    const pclass = prediction.label;
    const score = prediction.score;
    const x = prediction.bbox[0];
    const y = prediction.bbox[1];
    const w = prediction.bbox[2];
    const h = prediction.bbox[3];

    return (
      <Text key={index} style={{ zIndex: 4 }}>
        Prediction: {pclass} {', '} Probability: {score} {', '} Bbox: {x} {', '}{' '}
        {y} {', '} {w} {', '} {h}
      </Text>
    );
  };

  return (
    <>
      <StatusBar hidden />
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isCameraActive}
        accessibilityHint={t('camera.accessibility.hint')}
        onInitialized={() => setIsCameraAvailable(true)}
      />
      {predictions.map(renderPrediction)}
      <Canvas ref={canvas} />
    </>
  );
};

export default CameraScreen;
