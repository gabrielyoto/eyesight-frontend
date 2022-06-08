import { CanvasRenderingContext2D } from 'react-native-canvas';

export type TFDataNestedArray =
  | number
  | number[]
  | number[][]
  | number[][][]
  | number[][][][]
  | number[][][][][];

export const drawRect = (
  boxes: TFDataNestedArray,
  classes: TFDataNestedArray,
  scores: TFDataNestedArray,
  threshold: number,
  imgWidth: number,
  imgHeight: number,
  ctx: CanvasRenderingContext2D
) => {
  console.error(boxes, classes, scores, threshold, imgWidth, imgHeight, ctx);
};
