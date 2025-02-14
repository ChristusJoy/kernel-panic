import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastNotification = () => {
  return <ToastContainer position="top-right" autoClose={3000} />;
};

// Correct way to export
export const showToast = (objectName) => {
  toast.success(`Detected: ${objectName}`);
};

export default ToastNotification; 
