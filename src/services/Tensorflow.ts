import * as tf from '@tensorflow/tfjs';
import { Image, ImageSourcePropType } from 'react-native';
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';

export const loadModel = (modelJson: tf.io.ModelJSON, weights: any[]) => {
  return tf.loadGraphModel(bundleResourceIO(modelJson, weights));
};

export const imageToTensor = (rawImageData: Uint8Array) => {
  return decodeJpeg(rawImageData, 3)
    .resizeBilinear([480, 480])
    .reshape([1, 480, 480, 3])
    .toInt();
};

type ClassDir = {
  name: string;
  id: number;
};

let labels = {
  1: {
    name: 'ThumbsUp',
    id: 1,
  },
  2: {
    name: 'cadeira',
    id: 2,
  },
  3: { name: 'ok', id: 3 },
  4: { name: 'paz', id: 4 },
  5: { name: 'suave', id: 5 },
};

export type DetectedObject = {
  scores: number[][];
  threshold: number;
  imageWidth: number;
  imageHeight: number;
  boxes: Uint8Array | Float32Array | Int32Array;
  classes: Uint8Array | Float32Array | Int32Array;
  classesDir: any;
};

const buildDetectedObjects = ({
  scores,
  threshold,
  imageWidth,
  imageHeight,
  boxes,
  classes,
  classesDir,
}: DetectedObject) => {
  const detectionObjects: {
    bbox: number[];
    class: number;
    score: string;
    label: string;
  }[] = [];
  console.error('buildando', scores[0].length);

  scores[0].forEach((score, i) => {
    if (score > threshold) {
      const bbox = [];
      const minY = boxes[i * 4] * imageHeight;
      const minX = boxes[i * 4 + 1] * imageWidth;
      const maxY = boxes[i * 4 + 2] * imageHeight;
      const maxX = boxes[i * 4 + 3] * imageWidth;
      bbox[0] = minX;
      bbox[1] = minY;
      bbox[2] = maxX - minX;
      bbox[3] = maxY - minY;

      detectionObjects.push({
        class: classes[i],
        label: classesDir[classes[i]].name,
        score: score.toFixed(4),
        bbox: bbox,
      });
    }
  });

  return detectionObjects;
};

export const detectObjects = async (
  image: ImageSourcePropType,
  model: tf.GraphModel
) => {
  try {
    const imageAssetPath = Image.resolveAssetSource(image);

    const imgB64 = await FileSystem.readAsStringAsync(imageAssetPath.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
    const raw = new Uint8Array(imgBuffer);
    const imageTensor = imageToTensor(raw);

    const predictions = await model.executeAsync(imageTensor);
    if (Array.isArray(predictions)) {
      const boxes = predictions[6].dataSync();
      const scores = predictions[7].arraySync();
      const classes = predictions[3].dataSync();

      return buildDetectedObjects({
        boxes,
        classes,
        classesDir: labels,
        imageHeight: imageAssetPath.height,
        imageWidth: imageAssetPath.width,
        scores: scores as number[][],
        threshold: 0.75,
      });
    }
  } catch (error) {
    console.error('Exception Error: ', error);
  }
};
