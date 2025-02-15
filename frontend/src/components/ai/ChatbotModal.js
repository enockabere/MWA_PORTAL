import React, { useState } from "react";
import { Modal, Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { Send, Bot, User, CheckCircle, Clock } from "lucide-react";
import "./ChatbotModal.css";
import { detectIntent } from "./intentDetector";
import {
  handleLeaveBalanceIntent,
  handleGreetingIntent,
  handleUnknownIntent,
  handlePendingApprovalIntent,
  handleApprovedDocumentIntent,
  handleRejectedDocumentIntent,
} from "./intentHandlers";
import { useDashboard } from "../context/DashboardContext";

const ChatbotModal = ({ isOpen, onClose }) => {
  const { dashboardData, profileImage } = useDashboard();
  const imageSrc =
    profileImage &&
    `data:image/${profileImage.image_format};base64,${profileImage.encoded_string}`;
  const [messages, setMessages] = useState([
    {
      text: "Hello! How can I assist you today?",
      sender: "bot",
      senderName: "Robot", // Bot's name
      timestamp: new Date().toLocaleTimeString(), // Current time
      component: (
        <ol className="quick-links text-primary">
          <li>
            <CheckCircle size={10} />{" "}
            <a
              href="#"
              className="text-primary"
              onClick={(e) => handleLeaveBalance(e)}
            >
              <i>Check my leave balance?</i>
            </a>
          </li>
          <li>
            <Clock size={10} />{" "}
            <a
              href="#"
              className="text-primary"
              onClick={(e) => handlePendingApprovals(e)}
            >
              <i>What is pending my approvals?</i>
            </a>
          </li>
          <li>
            <Clock size={10} />{" "}
            <a
              href="#"
              className="text-primary"
              onClick={(e) => handleApprovedDocuments(e)}
            >
              <i>Documents that I approved?</i>
            </a>
          </li>
          <li>
            <Clock size={10} />{" "}
            <a
              href="#"
              className="text-primary"
              onClick={(e) => handleRejectedDocuments(e)}
            >
              <i>Documents that I rejected?</i>
            </a>
          </li>
        </ol>
      ),
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [intentCache, setIntentCache] = useState({});
  const [requestSent, setRequestSent] = useState(false);
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const addBotMessage = (text, component = null) => {
    setMessages((prev) => [
      ...prev,
      {
        text: text,
        component: component,
        sender: "bot",
        senderName: "Robot", // Bot's name
        timestamp: new Date().toLocaleTimeString(), // Current time
      },
    ]);
    setLoading(false);
  };

  const handleLeaveBalance = (e) => {
    e.preventDefault();
    setLoading(true);
    setRequestSent(true);
    handleLeaveBalanceIntent(addBotMessage, setRequestSent, csrfToken);
  };

  const handlePendingApprovals = (e) => {
    e.preventDefault();
    setLoading(true);
    setRequestSent(true);
    handlePendingApprovalIntent(addBotMessage, setRequestSent, csrfToken);
  };

  const handleApprovedDocuments = (e) => {
    e.preventDefault();
    setLoading(true);
    setRequestSent(true);
    handleApprovedDocumentIntent(addBotMessage, setRequestSent, csrfToken);
  };

  const handleRejectedDocuments = (e) => {
    e.preventDefault();
    setLoading(true);
    setRequestSent(true);
    handleRejectedDocumentIntent(addBotMessage, setRequestSent, csrfToken);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || loading) return;

    setMessages([
      ...messages,
      {
        text: userInput,
        sender: "user",
        senderName: dashboardData.user_data.full_name, // User's name
        timestamp: new Date().toLocaleTimeString(), // Current time
      },
    ]);
    setUserInput("");

    const intent = detectIntent(userInput, intentCache);
    setLoading(true);

    if (intent === "get_leave_balance" && !requestSent) {
      setRequestSent(true);
      handleLeaveBalance({ preventDefault: () => {} });
    } else if (intent === "get_pending_approvals" && !requestSent) {
      setRequestSent(true);
      handlePendingApprovals({ preventDefault: () => {} });
    } else if (intent === "get_approved_documents" && !requestSent) {
      setRequestSent(true);
      handleApprovedDocuments({ preventDefault: () => {} });
    } else if (intent === "get_rejected_documents" && !requestSent) {
      setRequestSent(true);
      handleRejectedDocuments({ preventDefault: () => {} });
    } else if (intent === "greeting") {
      handleGreetingIntent(addBotMessage);
    } else {
      handleUnknownIntent(addBotMessage, userInput, csrfToken);
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <h5>Chatbot Assistant</h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="chat-container">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              {/* Profile Image or Icon */}
              <div className="profile-image">
                {msg.sender === "user" ? (
                  imageSrc ? (
                    <img
                      src={imageSrc}
                      alt="Profile"
                      className="rounded-image"
                    />
                  ) : (
                    <User size={24} className="default-icon" />
                  )
                ) : (
                  <Bot size={24} />
                )}
              </div>

              {/* Message Content */}
              <div className="message-content">
                <div className="message-header">
                  <span className="sender-name">{msg.senderName}</span>
                  <span className="timestamp">{msg.timestamp}</span>
                </div>
                <div className="message-text">
                  {msg.text}
                  {msg.component && msg.component}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message bot">
              <Bot size={24} />
              <Spinner animation="grow" size="sm" />
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="no-border-radius"
          />
          <Button
            variant="primary"
            onClick={handleSendMessage}
            disabled={loading}
          >
            <Send size={20} />
          </Button>
        </InputGroup>
      </Modal.Footer>
    </Modal>
  );
};

export default ChatbotModal;
