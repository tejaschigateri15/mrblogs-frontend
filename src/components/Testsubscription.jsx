import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [userID, setUserID] = useState("");
  const [email, setEmail] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [duration, setDuration] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  // Fetch Subscriptions when userID changes
  useEffect(() => {
    if (userID) {
      axios.get(`http://127.0.0.1:8000/subscriptions/${userID}`)
        .then(response => {
          setSubscriptions(response.data);
        })
        .catch(error => console.error("Error fetching subscriptions:", error));
    }
  }, [userID]);

  // WebSocket Connection - Reconnect when userID changes
  useEffect(() => {
    let ws = null;
    
    if (userID) {
      ws = new WebSocket(`ws://127.0.0.1:8000/ws/${userID}`);
      
      ws.onopen = () => {
        console.log('WebSocket Connected');
      };
      
      ws.onmessage = (event) => {
        console.log('Received message:', event.data);  // Add this for debugging
        setNotifications(prev => [...prev, event.data]);
      };
  
      ws.onclose = () => {
        console.log('WebSocket Disconnected');
      };
  
      setSocket(ws);
    }
  
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [userID]);

  // Handle Subscription Form Submit
  const handleSubscribe = async () => {
    if (!userID || !email || !serviceName || !duration) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/subscribe/", {
        user_id: parseInt(userID),
        email,
        service_name: serviceName,
        duration_minutes: parseInt(duration),
      });

      alert(response.data.message);
      setSubscriptions([...subscriptions, { service_name: serviceName, end_date: response.data.expires_at }]);
    } catch (error) {
      console.error("Subscription error:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Subscription Manager</h1>
      
      {/* User ID Input */}
      <div className="mt-4">
        <label>User ID:</label>
        <input type="number" className="border p-2 ml-2" value={userID} onChange={(e) => setUserID(e.target.value)} />
      </div>

      {/* Subscription Form */}
      <div className="mt-4">
        <label>Email:</label>
        <input type="email" className="border p-2 ml-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="ml-4">Service:</label>
        <input type="text" className="border p-2 ml-2" value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
        <label className="ml-4">Duration (minutes):</label>
        <input type="number" className="border p-2 ml-2" value={duration} onChange={(e) => setDuration(e.target.value)} />
        <button onClick={handleSubscribe} className="bg-blue-500 text-white p-2 ml-4">Subscribe</button>
      </div>

      {/* Active Subscriptions */}
      <h2 className="text-xl font-bold mt-4">Active Subscriptions</h2>
      <ul className="mt-2">
        {subscriptions.map((sub, index) => (
          <li key={index} className="bg-white p-2 rounded shadow-md mb-2 w-80">
            {sub.service_name} (Ends at: {new Date(sub.end_date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })})
          </li>
        ))}
      </ul>

      {/* Notifications */}
      <h2 className="text-xl font-bold mt-4">Notifications</h2>
      <ul className="mt-2">
        {notifications.map((note, index) => (
          <li key={index} className="bg-red-300 p-2 rounded shadow-md mb-2 w-80">{note}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
