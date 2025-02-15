import React from "react";
import PendingApprovalsAccordion from "./timesheet/PendingApprovalsAccordion";
import LeaveApplicationAccordion from "./leave requests/LeaveApplicationAccordion";
import LeaveAdjustmentAccordion from "./adjustment ai/LeaveAdjustmentAccordion";

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
    const pendingData = parsedData.filter((doc) => doc.Status === "Open");

    if (pendingData.length > 0) {
      // Define a refresh function to re-fetch pending approvals
      const refreshApprovals = async () => {
        await handlePendingApprovalIntent(
          addBotMessage,
          setRequestSent,
          csrfToken
        );
      };

      // Separate data by document type
      const timesheetData = pendingData.filter(
        (item) => item.DocumentType === "TimeSheet"
      );
      const leaveApplicationData = pendingData.filter(
        (item) => item.DocumentType === "LeaveApplication"
      );
      const leaveAdjustmentData = pendingData.filter(
        (item) => item.DocumentType === "LeaveAdjustment"
      );

      // Render the appropriate accordion based on document type
      if (timesheetData.length > 0) {
        addBotMessage(
          "Here are your pending timesheet approvals:",
          <PendingApprovalsAccordion
            approvals={timesheetData}
            refreshApprovals={refreshApprovals}
          />
        );
      }

      if (leaveApplicationData.length > 0) {
        addBotMessage(
          "Here are your pending leave application approvals:",
          <LeaveApplicationAccordion
            approvals={leaveApplicationData}
            refreshApprovals={refreshApprovals}
          />
        );
      }

      if (leaveAdjustmentData.length > 0) {
        addBotMessage(
          "Here are your pending leave adjustment approvals:",
          <LeaveAdjustmentAccordion
            approvals={leaveAdjustmentData}
            refreshApprovals={refreshApprovals}
          />
        );
      }

      // If no pending approvals of any type are found
      if (
        timesheetData.length === 0 &&
        leaveApplicationData.length === 0 &&
        leaveAdjustmentData.length === 0
      ) {
        console.log("No pending approvals found.");
        addBotMessage("No pending approvals found.");
      }
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

export const handleApprovedDocumentIntent = async (
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
    const approvedData = parsedData.filter((doc) => doc.Status === "Approved");

    if (approvedData.length > 0) {
      // Define a refresh function to re-fetch pending approvals
      const refreshApprovals = async () => {
        await handleApprovedDocumentIntent(
          addBotMessage,
          setRequestSent,
          csrfToken
        );
      };

      // Separate data by document type
      const timesheetData = approvedData.filter(
        (item) => item.DocumentType === "TimeSheet"
      );
      const leaveApplicationData = approvedData.filter(
        (item) => item.DocumentType === "LeaveApplication"
      );
      const leaveAdjustmentData = approvedData.filter(
        (item) => item.DocumentType === "LeaveAdjustment"
      );

      // Render the appropriate accordion based on document type
      if (timesheetData.length > 0) {
        addBotMessage(
          "Here are timesheet doucumnts that you your approved:",
          <PendingApprovalsAccordion
            approvals={timesheetData}
            refreshApprovals={refreshApprovals}
          />
        );
      }

      if (leaveApplicationData.length > 0) {
        addBotMessage(
          "Here are leave application that you your approved:",
          <LeaveApplicationAccordion
            approvals={leaveApplicationData}
            refreshApprovals={refreshApprovals}
          />
        );
      }

      if (leaveAdjustmentData.length > 0) {
        addBotMessage(
          "Here are leave adjustment documents that you your approved:",
          <LeaveAdjustmentAccordion
            approvals={leaveAdjustmentData}
            refreshApprovals={refreshApprovals}
          />
        );
      }

      // If no approved documents of any type are found
      if (
        timesheetData.length === 0 &&
        leaveApplicationData.length === 0 &&
        leaveAdjustmentData.length === 0
      ) {
        console.log("No approved documents found.");
        addBotMessage("No approved documents found.");
      }
    } else {
      addBotMessage("You have no approved documents at the moment.");
    }
  } catch (error) {
    console.error("Error fetching approved documents:", error);
    addBotMessage("Sorry, I couldn't retrieve documents that you approved.");
  } finally {
    setRequestSent(false);
  }
};

export const handleRejectedDocumentIntent = async (
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
    const rejectedData = parsedData.filter((doc) => doc.Status === "Rejected");

    if (rejectedData.length > 0) {
      // Define a refresh function to re-fetch pending approvals
      const refreshApprovals = async () => {
        await handleRejectedDocumentIntent(
          addBotMessage,
          setRequestSent,
          csrfToken
        );
      };

      // Separate data by document type
      const timesheetData = rejectedData.filter(
        (item) => item.DocumentType === "TimeSheet"
      );
      const leaveApplicationData = rejectedData.filter(
        (item) => item.DocumentType === "LeaveApplication"
      );
      const leaveAdjustmentData = rejectedData.filter(
        (item) => item.DocumentType === "LeaveAdjustment"
      );

      // Render the appropriate accordion based on document type
      if (timesheetData.length > 0) {
        addBotMessage(
          "Here are timesheet approvals that you rejected:",
          <PendingApprovalsAccordion
            approvals={timesheetData}
            refreshApprovals={refreshApprovals}
          />
        );
      }

      if (leaveApplicationData.length > 0) {
        addBotMessage(
          "Here are leave application approvals that you rejected:",
          <LeaveApplicationAccordion
            approvals={leaveApplicationData}
            refreshApprovals={refreshApprovals}
          />
        );
      }

      if (leaveAdjustmentData.length > 0) {
        addBotMessage(
          "Here are leave adjustment approvals that you rejected:",
          <LeaveAdjustmentAccordion
            approvals={leaveAdjustmentData}
            refreshApprovals={refreshApprovals}
          />
        );
      }

      // If no approved documents of any type are found
      if (
        timesheetData.length === 0 &&
        leaveApplicationData.length === 0 &&
        leaveAdjustmentData.length === 0
      ) {
        console.log("No rejected documents found.");
        addBotMessage("No rejected documents found.");
      }
    } else {
      addBotMessage("You have no rejected documents at the moment.");
    }
  } catch (error) {
    console.error("Error fetching approved documents:", error);
    addBotMessage("Sorry, I couldn't retrieve  documents that you rejected.");
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
