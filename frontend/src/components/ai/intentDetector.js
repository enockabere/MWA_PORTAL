import nlp from "compromise";

export const detectIntent = (message, intentCache) => {
  if (intentCache[message]) return intentCache[message];

  let doc = nlp(message.toLowerCase());

  if (
    doc.has("leave balance") ||
    doc.has("remaining leave days") ||
    doc.has("balance ya leave") ||
    doc.has("leave balance")
  ) {
    intentCache[message] = "get_leave_balance";
  } else if (
    doc.has("document pending") ||
    doc.has("pending approval") ||
    doc.has("approval request") ||
    doc.has("approve") ||
    doc.has("documents sent for approval") ||
    doc.has("which document do i need to approve")
  ) {
    intentCache[message] = "get_pending_approvals";
  } else if (doc.has("hello") || doc.has("hi")) {
    intentCache[message] = "greeting";
  } else {
    intentCache[message] = "unknown";
  }

  return intentCache[message];
};
