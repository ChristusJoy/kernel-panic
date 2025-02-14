import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as tmImage from "@teachablemachine/image";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const TeachableMachine = () => {
  const modelURL = "https://teachablemachine.withgoogle.com/models/SqWJkpzAZ/model.json";
  const metadataURL = "https://teachablemachine.withgoogle.com/models/SqWJkpzAZ/metadata.json";

  const [model, setModel] = useState(null);
  const [webcam, setWebcam] = useState(null);
  const detectionCooldown = 10000; // 10 seconds
  let lastDetectionTime = 0;

  // Waste categories
  const categories = {
    "paper": "Recyclable",
    "metal": "Recyclable",
    "plastic": "Selective",
    "elastic": "Non-Recyclable",
  };

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    const loadedModel = await tmImage.load(modelURL, metadataURL);
    setModel(loadedModel);

    const newWebcam = new tmImage.Webcam(300, 300, true);
    await newWebcam.setup();
    await newWebcam.play();
    setWebcam(newWebcam);

    document.getElementById("webcam-container").appendChild(newWebcam.canvas);
    loop(newWebcam, loadedModel);
  };

  const loop = async (webcamInstance, modelInstance) => {
    while (true) {
      if (!webcamInstance || !modelInstance) return;
      webcamInstance.update();

      const now = Date.now();
      if (now - lastDetectionTime >= detectionCooldown) {
        lastDetectionTime = now;
        await predict(modelInstance, webcamInstance);
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  const predict = async (modelInstance, webcamInstance) => {
    const prediction = await modelInstance.predict(webcamInstance.canvas);
    let highestPrediction = prediction.reduce((max, p) => (p.probability > max.probability ? p : max), prediction[0]);

    console.log("🔍 Prediction results:", prediction);
    console.log("🎯 Highest detected class:", highestPrediction.className, "with confidence:", highestPrediction.probability);

    const detectedObject = highestPrediction.className.trim().toLowerCase();

    // 🚨 IGNORE "Nothing" category properly
    if (detectedObject === "nothing" || highestPrediction.probability < 0.85) {
      console.log("🚫 No valid object detected OR low confidence, skipping Firebase update.");
      return;
    }

    // Assign category properly
    const type = categories[detectedObject] || "Non-Recyclable";

    console.log(`✅ Confirmed detection: ${detectedObject} → ${type}`);

    await addDoc(collection(db, "waste_detections"), {
      name: detectedObject,
      type: type,
      timestamp: Timestamp.now(),
    });

    console.log("✅ Data successfully added to Firebase.");
  };

  return (
    <div>
      <h2>Teachable Machine Waste Detection</h2>
      <div id="webcam-container"></div>
      <p>Detecting objects...</p>
    </div>
  );
};

export default TeachableMachine;
