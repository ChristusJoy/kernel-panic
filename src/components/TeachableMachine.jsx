import React, { useState, useEffect, useRef } from "react";
import * as tmImage from "@teachablemachine/image";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { showToast } from "./ToastNotification";

const TeachableMachine = () => {
  const modelURL = "https://teachablemachine.withgoogle.com/models/sgxIFGPXc/model.json";
  const metadataURL = "https://teachablemachine.withgoogle.com/models/sgxIFGPXc/metadata.json";

  const [model, setModel] = useState(null);
  const [webcam, setWebcam] = useState(null);
  
  const detectionCooldown = useRef(10000); // Use ref to persist value
  const lastDetectionTime = useRef(0);

  // Waste categories
  const categories = {
    paper: "Recyclable",
    metal: "Recyclable",
    plastic: "Selective",
    elastic: "Non-Recyclable",
  };

  useEffect(() => {
    loadModel();

    return () => {
      if (webcam) {
        webcam.stop();
      }
    };
  }, []);

  const loadModel = async () => {
    const loadedModel = await tmImage.load(modelURL, metadataURL);
    setModel(loadedModel);

    const newWebcam = new tmImage.Webcam(300, 300, true);
    await newWebcam.setup();
    await newWebcam.play();
    setWebcam(newWebcam);

    const webcamContainer = document.getElementById("webcam-container");

    if (webcamContainer.firstChild) {
      webcamContainer.removeChild(webcamContainer.firstChild);
    }

    webcamContainer.appendChild(newWebcam.canvas);
    loop(newWebcam, loadedModel);
  };

  const loop = async (webcamInstance, modelInstance) => {
    while (true) {
      if (!webcamInstance || !modelInstance) return;
      webcamInstance.update();

      const now = Date.now();
      if (now - lastDetectionTime.current >= detectionCooldown.current) {
        lastDetectionTime.current = now; // Update last detection time
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

    if (detectedObject === "nothing" || highestPrediction.probability < 0.85) {
      console.log("🚫 No valid object detected OR low confidence, skipping Firebase update.");
      return;
    }

    const type = categories[detectedObject] || "Non-Recyclable";

    // 🚨 Apply cooldown logic correctly using useRef
    if (type === "Selective") {
      detectionCooldown.current = 30000; // Increase cooldown to 30 sec
      console.log("⏳ Cooldown increased to 30 sec for selective waste");
    } else {
      detectionCooldown.current = 10000; // Reset to 10 sec for other types
      console.log("⏳ Cooldown reset to 10 sec");
    }

    console.log(`✅ Confirmed detection: ${detectedObject} → ${type}`);

    await addDoc(collection(db, "waste_detections"), {
      name: detectedObject,
      type: type,
      timestamp: Timestamp.now(),
    });

    showToast(detectedObject);
    console.log("✅ Data successfully added to Firebase.");
  };

  return (
    <div>
      <h2>Waste Detection</h2>
      <div id="webcam-container"></div>
      <p>Detecting objects...</p>
    </div>
  );
};

export default TeachableMachine;
