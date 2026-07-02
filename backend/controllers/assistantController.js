const AssistantLog = require('../models/AssistantLog');

const resolutionTree = {
  root: {
    id: "root",
    question: "What issue are you facing?",
    options: [
      { label: "SIP Failed", next: "sip_bank_change" },
      { label: "Statement Missing", next: "statement_issue" },
      { label: "KYC", next: "kyc_issue" },
      { label: "Nominee", next: "nominee_issue" }
    ]
  },
  sip_bank_change: {
    id: "sip_bank_change",
    question: "Has your bank account changed recently?",
    options: [
      { label: "Yes", next: "action_update_mandate" },
      { label: "No", next: "sip_balance" }
    ]
  },
  sip_balance: {
    id: "sip_balance",
    question: "Is there sufficient balance in your linked account?",
    options: [
      { label: "Yes", next: "action_retry_payment" },
      { label: "No", next: "action_maintain_balance" }
    ]
  },
  action_update_mandate: {
    id: "action_update_mandate",
    type: "action",
    title: "Update Your Bank Mandate",
    message: "Since your bank account changed, your old mandate failed. Please register a new mandate.",
    buttonText: "Go to SIPs",
    linkTo: "/sip",
    ticketFallback: true
  },
  action_retry_payment: {
    id: "action_retry_payment",
    type: "action",
    title: "Retry Payment",
    message: "If you have sufficient balance, it might be a temporary bank issue. You can retry the payment.",
    buttonText: "Go to SIPs to Retry",
    linkTo: "/sip",
    ticketFallback: true
  },
  action_maintain_balance: {
    id: "action_maintain_balance",
    type: "action",
    title: "Maintain Balance",
    message: "Please deposit funds into your linked bank account. The system will automatically retry in 2 days, or you can retry manually.",
    buttonText: "Go to SIPs",
    linkTo: "/sip",
    ticketFallback: true
  },
  kyc_issue: {
    id: "kyc_issue",
    question: "What is the status of your KYC?",
    options: [
      { label: "Not Submitted", next: "action_submit_kyc" },
      { label: "Rejected", next: "action_submit_kyc" },
      { label: "Pending for over 3 days", next: "action_contact_support" }
    ]
  },
  action_submit_kyc: {
    id: "action_submit_kyc",
    type: "action",
    title: "Submit KYC Documents",
    message: "Please navigate to the KYC section to upload your PAN, Aadhaar, and Address Proof.",
    buttonText: "Go to KYC",
    linkTo: "/kyc",
    ticketFallback: true
  },
  action_contact_support: {
    id: "action_contact_support",
    type: "action",
    title: "Verify documents manually",
    message: "KYC usually takes up to 3 business days. If it has been pending longer, please proceed to raise a ticket.",
    buttonText: "Proceed to Support",
    linkTo: "#",
    ticketFallback: true
  },
  nominee_issue: {
    id: "nominee_issue",
    type: "action",
    title: "Manage Nominees",
    message: "You can easily add, edit, or remove nominees directly from your dashboard.",
    buttonText: "Go to Nominees",
    linkTo: "/nominee",
    ticketFallback: true
  },
  statement_issue: {
    id: "statement_issue",
    type: "action",
    title: "Download Statements",
    message: "You can generate and download monthly statements instantly without waiting for support.",
    buttonText: "Go to Statements",
    linkTo: "/statements",
    ticketFallback: true
  }
};

const getAssistantNode = async (req, res) => {
  const { id } = req.params;
  const node = resolutionTree[id || 'root'];
  if (node) {
    res.json(node);
  } else {
    res.status(404).json({ message: 'Node not found' });
  }
};

const logResolution = async (req, res) => {
  const { issueType, resolvedWithoutTicket } = req.body;
  
  try {
    const log = await AssistantLog.create({
      userId: req.user._id,
      issueType,
      resolvedWithoutTicket
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAssistantNode,
  logResolution
};
