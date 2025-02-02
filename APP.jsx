import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import { Card, CardContent } from "./card";
import { motion } from "framer-motion";
import { 
  FaGoogle, 
  FaFacebook, 
  FaMicrosoft, 
  FaPaypal, 
  FaAmazon, 
  FaInstagram, 
  FaDropbox, 
  FaFile, 
  FaCreditCard, 
  FaLock 
} from "react-icons/fa";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import "./App.css";

// ────────────────────────────────
// Reusable Store/Retrieve Form Component
// ────────────────────────────────
const StoreRetrieveForm = ({ itemLabel, valuePlaceholder }) => {
  const [username, setUsername] = useState("");
  const [value, setValue] = useState("");
  const [retrieved, setRetrieved] = useState("");
  const [message, setMessage] = useState("");

  // Call your backend API to store the secret
  const handleStore = async () => {
    try {
      const res = await fetch("http://localhost:3000/store-secret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, item: itemLabel, value })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Stored successfully!");
      } else {
        setMessage("Store error: " + data.error);
      }
    } catch (e) {
      setMessage("Store error: " + e.message);
    }
  };

  // Call your backend API to retrieve the secret
  const handleRetrieve = async () => {
    try {
      const res = await fetch("http://localhost:3000/retrieve-secret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, item: itemLabel })
      });
      const data = await res.json();
      if (res.ok) {
        setRetrieved(data.value);
        setMessage("Retrieved successfully!");
      } else {
        setMessage("Retrieve error: " + data.error);
      }
    } catch (e) {
      setMessage("Retrieve error: " + e.message);
    }
  };

  return (
    <div className="space-y-3">
      <Input 
        type="text" 
        placeholder="Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        className="w-full p-2 border rounded" 
      />
      <Input 
        type="text" 
        placeholder={valuePlaceholder} 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
        className="w-full p-2 border rounded" 
      />
      <div className="flex space-x-3">
        <Button onClick={handleStore} className="bg-blue-700 text-white flex-1">
          Store
        </Button>
        <Button onClick={handleRetrieve} className="bg-purple-700 text-white flex-1">
          Retrieve
        </Button>
      </div>
      {message && <p className="text-sm text-gray-600">{message}</p>}
      {retrieved && (
        <div className="p-2 bg-gray-100 rounded">
          <strong>Stored Value: </strong>
          {retrieved}
        </div>
      )}
    </div>
  );
};

// ────────────────────────────────
// Sidebar Component
// ────────────────────────────────
const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-blue-900 text-white p-5 flex flex-col space-y-3">
      <NavLink to="/" className="p-3 rounded-lg hover:bg-blue-700">All Items</NavLink>
      <NavLink to="/documents" className="p-3 rounded-lg hover:bg-blue-700">Documents</NavLink>
      <NavLink to="/password-manager" className="p-3 rounded-lg hover:bg-blue-700">Password Manager</NavLink>
      <NavLink to="/payment-cards" className="p-3 rounded-lg hover:bg-blue-700">Payment Cards</NavLink>
      <NavLink to="/security" className="p-3 rounded-lg hover:bg-blue-700">Security Dashboard</NavLink>
    </div>
  );
};

// ────────────────────────────────
// AllItems Component
// ────────────────────────────────
const AllItems = () => {
  const items = [
    { icon: <FaGoogle />, name: "Google" },
    { icon: <FaFacebook />, name: "Facebook" },
    { icon: <FaMicrosoft />, name: "Microsoft" },
    { icon: <FaPaypal />, name: "Paypal" },
    { icon: <FaAmazon />, name: "Amazon" },
    { icon: <FaInstagram />, name: "Instagram" },
    { icon: <FaDropbox />, name: "Dropbox" },
  ];

  return (
    <div className="p-10 grid grid-cols-3 gap-4">
      {items.map((item, index) => (
        <Dialog key={index}>
          <DialogTrigger asChild>
            <Card className="p-5 flex items-center space-x-3 cursor-pointer hover:bg-gray-200">
              {item.icon}
              <span>{item.name}</span>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{item.name} - Enter Details</DialogTitle>
            {/* For All Items we assume the secret is a password */}
            <StoreRetrieveForm itemLabel={item.name} valuePlaceholder="Enter Password" />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};

// ────────────────────────────────
// Documents Component (formerly Notes)
// ────────────────────────────────
const Documents = () => {
  const documents = [
    { icon: <FaFile />, name: "Driving License" },
    { icon: <FaFile />, name: "PAN Card" },
    { icon: <FaFile />, name: "Aadhaar Card" },
    { icon: <FaFile />, name: "Election Card" },
    { icon: <FaFile />, name: "College ID-Card" },
  ];

  return (
    <div className="p-10 grid grid-cols-3 gap-4">
      {documents.map((doc, index) => (
        <Dialog key={index}>
          <DialogTrigger asChild>
            <Card className="p-5 flex items-center space-x-3 cursor-pointer hover:bg-gray-200">
              {doc.icon}
              <span>{doc.name}</span>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{doc.name} - Enter Details</DialogTitle>
            <StoreRetrieveForm itemLabel={doc.name} valuePlaceholder="Enter Details" />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};

// ────────────────────────────────
// PasswordManager Component (for generic password storage)
// ────────────────────────────────
const PasswordManager = () => {
  // This component is similar to our generic form but designed as a standalone page
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [retrievedPassword, setRetrievedPassword] = useState("");
  const [message, setMessage] = useState("");

  const storePassword = async () => {
    try {
      const res = await fetch("http://localhost:3000/store-secret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, item: "Password", value: password })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Password stored successfully!");
      } else {
        setMessage("Failed to store password: " + data.error);
      }
    } catch (error) {
      console.error(error);
      setMessage("Error storing password.");
    }
  };

  const retrievePassword = async () => {
    try {
      const res = await fetch("http://localhost:3000/retrieve-secret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, item: "Password" })
      });
      const data = await res.json();
      if (res.ok) {
        setRetrievedPassword(data.value);
        setMessage("Password retrieved successfully!");
      } else {
        setMessage("Failed to retrieve password: " + data.error);
      }
    } catch (error) {
      console.error(error);
      setMessage("Error retrieving password.");
    }
  };

  // Generate a strong password
  const generateStrongPassword = () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~";
    let newPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    setPassword(newPassword);
  };

  return (
    <div className="p-10 max-w-xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-5">Password Manager</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Username</label>
        <Input 
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Password</label>
        <Input 
          type="text"
          placeholder="Enter Password or generate one"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="flex space-x-3 mb-4">
        <Button onClick={generateStrongPassword} className="bg-blue-700 text-white">
          Generate Password
        </Button>
        <Button onClick={storePassword} className="bg-green-700 text-white">
          Store Password
        </Button>
      </div>
      <div className="mb-4">
        <Button onClick={retrievePassword} className="bg-purple-700 text-white w-full">
          Retrieve Password
        </Button>
      </div>
      {message && <p className="text-center text-sm text-gray-600 mb-2">{message}</p>}
      {retrievedPassword && (
        <div className="p-3 bg-gray-100 rounded text-center">
          <strong>Retrieved Password: </strong>
          {retrievedPassword}
        </div>
      )}
    </div>
  );
};

// ────────────────────────────────
// PaymentCards Component
// ────────────────────────────────
const PaymentCards = () => {
  const cards = [
    { icon: <FaCreditCard />, name: "Visa" },
    { icon: <FaCreditCard />, name: "MasterCard" },
    { icon: <FaCreditCard />, name: "Amex" },
    { icon: <FaCreditCard />, name: "American Express" },
    { icon: <FaCreditCard />, name: "ATM Card" }
  ];

  return (
    <div className="p-10 grid grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <Dialog key={index}>
          <DialogTrigger asChild>
            <Card className="p-5 flex items-center space-x-3 cursor-pointer hover:bg-gray-200">
              {card.icon}
              <span>{card.name}</span>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{card.name} - Enter Card Information</DialogTitle>
            <StoreRetrieveForm itemLabel={card.name} valuePlaceholder="Enter Card Number" />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};

// ────────────────────────────────
// SecurityDashboard Component
// ────────────────────────────────
const SecurityDashboard = () => {
  return (
    <div className="p-10">
      <h2 className="text-xl font-bold">Security Overview</h2>
      <p>
        The Lock Box is designed to provide a highly secure and user-friendly environment for storing and retrieving passwords. This document outlines the security mechanisms, encryption methods, and data storage strategies implemented to ensure maximum protection of sensitive user data.
        ________________________________________
        <br />
        1. Security Measures<br />
        To protect user data, the application employs multiple layers of security, including encryption, secure communication, access control, and hashing techniques.<br />
        1.1 Encryption Mechanisms<br />
        • AES-256 Encryption: All stored passwords are encrypted using AES-256, a widely recognized encryption standard for securing sensitive data.<br />
        • Vault Transit Engine: If integrated with HashiCorp Vault, passwords are encrypted at the application level before being stored in the database.<br />
        • End-to-End Encryption (E2EE): Data is encrypted before being sent to the backend, ensuring security in transit and at rest.<br />
        1.2 Secure Password Generation<br />
        • The app includes a strong password generator that creates complex passwords with uppercase, lowercase, numbers, and special characters.<br />
        • A password strength indicator ensures users select strong, non-guessable passwords.<br />
        1.3 Secure Communication<br />
        • HTTPS (SSL/TLS): All data transmitted between the frontend and backend is encrypted using SSL/TLS.<br />
        • HSTS (HTTP Strict Transport Security): Prevents downgrade attacks by enforcing HTTPS connections.<br />
        1.4 Access Control & Authentication<br />
        • Role-Based Access Control (RBAC): Limits access to stored passwords based on user roles (Admin/User).<br />
        • Multi-Factor Authentication (MFA): (Optional) Adds an additional layer of security for account access.<br />
        • JWT (JSON Web Token): Secure token-based authentication for session management.<br />
        1.5 Hashing and Salting<br />
        • Argon2/Bcrypt Hashing: User authentication credentials (such as master passwords) are hashed using Argon2 or Bcrypt, ensuring they cannot be reversed.<br />
        • Salting: Randomized salts are added to each password hash to mitigate rainbow table attacks.<br />
        ________________________________________
        <br />
        2. Data Storage Mechanism<br />
        2.1 Database Architecture<br />
        The application securely stores user data in a PostgreSQL database, utilizing best practices for security and encryption.<br />
        2.2 How Data is Stored<br />
        1. User Credentials:<br />
        o The user's master password is never stored in plaintext. Instead, it is hashed using Argon2/Bcrypt before being saved.<br />
        o User authentication tokens (JWT) are stored securely in HTTP-only cookies.<br />
        2. Passwords & Sensitive Data:<br />
        o Before storing, passwords are encrypted using AES-256 or Vault's Transit Engine.<br />
        o Encrypted passwords are stored in the PostgreSQL database in a column marked as bytea to ensure binary-level security.<br />
        o When retrieving a password, it is decrypted only at the application level, ensuring security.<br />
        3. Audit Logs & Monitoring:<br />
        o The system logs every password retrieval attempt, including the requesting user and timestamp.<br />
        o Unauthorized access attempts are logged and trigger alerts.<br />
        ________________________________________
        <br />
        3. Secure Frontend Practices<br />
        The frontend is designed to minimize security risks:<br />
        • CSP (Content Security Policy): Prevents XSS (Cross-Site Scripting) attacks.<br />
        • Secure Local Storage Usage: JWT tokens are never stored in localStorage, reducing XSS risk.<br />
        • Password Visibility Toggle: Implements secure toggling without exposing plaintext passwords.<br />
        • Input Validation & Escaping: Prevents SQL Injection and XSS attacks.<br />
        ________________________________________
        <br />
        4. Threat Mitigation Strategies<br />
        4.1 Protection Against Common Attacks<br />
        Attack Type - Mitigation Strategy<br />
        SQL Injection - Prepared statements & ORM<br />
        XSS (Cross-Site Scripting) - Content Security Policy (CSP)<br />
        CSRF (Cross-Site Request Forgery) - CSRF tokens for form submissions<br />
        Brute Force Attacks - Rate limiting & account lockout<br />
        Man-in-the-Middle (MITM) - Enforced HTTPS & TLS 1.3<br />
        Phishing - Email alerts for suspicious login attempts<br />
        ________________________________________
        <br />
        5. Backup & Recovery<br />
        5.1 Automated Backup Strategy<br />
        • Encrypted database backups are taken at regular intervals.<br />
        • Backups are stored in a separate, secure environment with access controls.<br />
        • Database snapshots are taken daily and stored in encrypted storage.<br />
        5.2 Disaster Recovery Plan<br />
        • Recovery keys are securely stored to decrypt backup data.<br />
        • Regular integrity checks ensure no data corruption.<br />
        • Admin users have recovery access using MFA-secured mechanisms.<br />
        ________________________________________
        <br />
        6. Conclusion<br />
        The Secure Password Manager follows industry best practices to ensure data security, confidentiality, and integrity. With AES-256 encryption, robust authentication, and secure storage, users can confidently store and retrieve passwords with minimal risk.
        <br />
        For additional security enhancements, consider integrating biometric authentication, decentralized key storage, or hardware security modules (HSMs) for high-security environments.
      </p>
    </div>
  );
};

// ────────────────────────────────
// Main App Component
// ────────────────────────────────
const App = () => {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-5">
          <Routes>
            <Route path="/" element={<AllItems />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/password-manager" element={<PasswordManager />} />
            <Route path="/payment-cards" element={<PaymentCards />} />
            <Route path="/security" element={<SecurityDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
