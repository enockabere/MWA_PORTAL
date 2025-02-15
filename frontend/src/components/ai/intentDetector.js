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
    doc.has("approval") ||
    doc.has("pending approval") ||
    doc.has("approval request") ||
    doc.has("approve") ||
    doc.has("documents sent for approval") ||
    doc.has("documents that i should approve") ||
    doc.has("documents nafaa kuapprove") ||
    doc.has("request to approve") ||
    doc.has("documents za kuapprove") ||
    doc.has("approval requests") ||
    doc.has("which document do i need to approve")
  ) {
    intentCache[message] = "get_pending_approvals";
  } else if (
    doc.has("document that i have approved") ||
    doc.has("documents that i approved") ||
    doc.has("i approved")
  ) {
    intentCache[message] = "get_approved_documents";
  } else if (
    doc.has("document that i have rejected") ||
    doc.has("documents that i rejected") ||
    doc.has("i rejected")
  ) {
    intentCache[message] = "get_approved_documents";
  } else if (
    doc.has("hello") ||
    doc.has("niaje") ||
    doc.has("vipi") ||
    doc.has("sasa") ||
    doc.has("mambo") ||
    doc.has("how are you") ||
    doc.has("how do you do") ||
    doc.has("hi")
  ) {
    intentCache[message] = "greeting";
  } else {
    intentCache[message] = "unknown";
  }

  return intentCache[message];
};
