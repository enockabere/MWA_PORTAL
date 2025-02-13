import React from "react";

export const handleLeaveBalanceIntent = async (
  addBotMessage,
  setRequestSent
) => {
  try {
    const response = await fetch("/selfservice/all-leave-balance/");
    if (!response.ok) throw new Error("Error fetching leave balance");

    let data = await response.json();
    const parsedData = typeof data === "string" ? JSON.parse(data) : data;

    const leaveTypes = Object.keys(parsedData);
    const leaveBalances = Object.values(parsedData);

    if (leaveTypes.length && leaveBalances.length) {
      const leaveBalanceList = (
        <ol className="leave-balance-list">
          {leaveTypes.map((leaveType, index) => (
            <li key={index}>
              {leaveType.toLowerCase()}: {leaveBalances[index]} days
            </li>
          ))}
        </ol>
      );

      addBotMessage("Here are your leave balances:", leaveBalanceList);
    } else {
      addBotMessage("Invalid leave balance data.");
    }
  } catch (error) {
    console.error("Error fetching leave balance:", error);
    addBotMessage(
      "Sorry, I couldn't retrieve your leave balance at the moment."
    );
  } finally {
    setRequestSent(false);
  }
};

export const handlePendingApprovalIntent = async (
  addBotMessage,
  setRequestSent,
  csrfToken
) => {
  try {
    const response = await fetch("/selfservice/Approve/");
    if (!response.ok) throw new Error("Error fetching approval requests");

    let data = await response.json();
    const parsedData = typeof data === "string" ? JSON.parse(data) : data;

    // Filter documents with Status "Open"
    const pendingApprovals = parsedData.filter(
      (doc) => doc.Status.toLowerCase() === "open"
    );

    if (pendingApprovals.length > 0) {
      const approvalList = (
        <ul className="pending-approval-list">
          {pendingApprovals.map((doc, index) => (
            <li key={index}>
              <strong>Document No:</strong> {doc.DocumentNo} <br />
              <strong>Type:</strong> {doc.DocumentType} <br />
              <strong>Sender:</strong> {doc.Sender_Name} <br />
              <strong>Due Date:</strong> {doc.Due_Date} <br />
            </li>
          ))}
        </ul>
      );

      addBotMessage("Here are your pending approval requests:", approvalList);
    } else {
      addBotMessage("You have no pending approvals at the moment.");
    }
  } catch (error) {
    console.error("Error fetching pending approvals:", error);
    addBotMessage(
      "Sorry, I couldn't retrieve your pending approvals at the moment."
    );
  } finally {
    setRequestSent(false);
  }
};

export const handleGreetingIntent = (addBotMessage) => {
  addBotMessage("Hello! How can I assist you today?");
};

export const handleUnknownIntent = async (
  addBotMessage,
  message,
  csrfToken
) => {
  addBotMessage("I'm still learning! I'll get back to you soon.");
  await fetch("/selfservice/Save_Unknown_Query/", {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken, "Content-Type": "application/json" },
    body: JSON.stringify({ text: message }),
  });
};
