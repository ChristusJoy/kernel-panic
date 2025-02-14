import React, { useEffect, useState } from "react";
import { db } from "../firebase";  
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

const HistoryTable = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "waste_detections"), orderBy("timestamp", "desc"));
    
    // Real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const historyData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(historyData);
    });

    return () => unsubscribe(); // Cleanup function
  }, []);

  return (
    <div>
      <h2>Waste Detection History</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td 
                style={{ 
                  color: item.type === "Recyclable" ? "green" : item.type === "Selective" ? "yellow" : "red",
                  fontWeight: "bold" 
                }}
              >
                {item.type}
              </td>
              <td>{new Date(item.timestamp.toDate()).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;
