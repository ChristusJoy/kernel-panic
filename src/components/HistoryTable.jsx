import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";

const HistoryTable = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "waste_detections"), orderBy("timestamp", "desc"), limit(10));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const historyData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(historyData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="tile history-tile">
      <h2 className="history-title">Waste Detection History</h2>
      <div className="table-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td className={`type-${item.type.toLowerCase()}`}>{item.type}</td>
                  <td>
                    {item.timestamp && item.timestamp.toDate
                      ? new Date(item.timestamp.toDate()).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">No recent detections</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;
