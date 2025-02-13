import React, { useState } from "react";
import ChatbotModal from "../ai/ChatbotModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Optional: for icons
import { faComment } from "@fortawesome/free-solid-svg-icons"; // Optional: for icons
import "./float.css";

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Floating Chat Icon */}
      <div className="floating-chat-icon bg-primary" onClick={openModal}>
        <FontAwesomeIcon icon={faComment} />
      </div>

      {/* Footer Content */}
      <footer className="footer">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 p-0 footer-copyright">
              <p className="mb-0">Copyright 2024 © Millenium Water Alliance.</p>
            </div>
            <div className="col-md-6 p-0">
              <p className="heart mb-0">
                Powered by <span className="text-primary">Sy-intelli</span>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot Modal */}
      <ChatbotModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default Footer;
