import React, { createContext, useContext, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as TensorflowService from '../services/Tensorflow';
import modelJson from '../assets/model.json';

const weight1 = require('../assets/group1-shard1of3.bin');
const weight2 = require('../assets/group1-shard2of3.bin');
const weight3 = require('../assets/group1-shard3of3.bin');

const ModelContext = createContext<tf.GraphModel | null>(null);

const ModelProvider: React.FC = ({ children }) => {
  const [model, setModel] = useState<tf.GraphModel | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        console.error('initializing tf');
        await tf.ready();
        console.error('loading model');
        const loadedModel = await TensorflowService.loadModel(
          modelJson as tf.io.ModelJSON,
          [weight1, weight2, weight3]
        );
        console.error('ready to go');

        setModel(loadedModel);
      } catch (err) {
        console.error(err, 'error loading');
      }
    };
    loadModel();
  }, []);

  return (
    <ModelContext.Provider value={model}>{children}</ModelContext.Provider>
  );
};

const useModel = () => {
  const context = useContext(ModelContext);

  if (context) {
    return context;
  }

  console.error('useModel hook can only be used inside ModelProvider');
};

export { ModelProvider, useModel };
