import { UnderstandResult, AdaptiveData, ActionChecklistItem, CommunicationFragment } from '../types';

export const INITIAL_USER_PROFILE = {
  name: "Alex",
  experienceStyle: "adaptive" as const,
  communicationModes: ["Voice", "Tapping", "Visual cards"],
  explanationStyle: "adaptive" as const,
  accessibility: {
    largerText: false,
    highContrast: false,
    voiceGuidance: false,
    reducedMotion: false,
    simplifiedLanguage: true,
  },
  languages: ["English", "Spanish"],
  personalizationEnabled: true,
  onboardingCompleted: false,
};

export const SAMPLE_DOCUMENTS: Record<string, { label: string; icon: string; result: UnderstandResult; rawDocumentText: string; adaptiveData: AdaptiveData }> = {
  university: {
    label: "University Scholarship Notice",
    icon: "GraduationCap",
    rawDocumentText: `OFFICE OF STUDENT FINANCIAL SERVICES — ACADEMIC YEAR 2026-2027
NOTICE OF PROVISIONAL MERIT SUBSIDY ALLOCATION (REF: AURA-9921)
Dear Student,
Pursuant to Section 4.8 of the Higher Education Affordability Directive, your application for the Merit Tuition Subsidy has been provisionally accepted. To finalize the disbursement of funds ($4,500/semester), all recipients must submit Annexure-B (Certified Gross Familial Income Certificate or IRS 1040 summary) no later than September 17, 2026 at 17:00 EST. Failure to submit required annexures by the prescribed cutoff will result in automatic nullification of the allocated financial concession. Submissions may be delivered via the Student Self-Service Portal (Section: Document Upload) or physically at Administration Hall, Counter 4.`,
    result: {
      id: "doc-univ-01",
      classification: "🎓 University Financial Notice",
      title: "Merit Tuition Subsidy Confirmation",
      oneLineSummary: "You received a $4,500 scholarship, but you must upload your Income Certificate before September 17 to keep it.",
      essentialFacts: [
        {
          id: "f-1",
          label: "Disbursement Amount",
          value: "$4,500 / semester provisional grant",
          sourceExcerpt: "Disbursement of funds ($4,500/semester)",
          locationCitation: "Found on Page 1, Paragraph 2 (Allocation Terms)",
          confidence: 0.99,
          highlightCoordinates: { x: 10, y: 35, width: 80, height: 10 }
        },
        {
          id: "f-2",
          label: "Hard Deadline",
          value: "September 17, 2026 (5:00 PM EST)",
          sourceExcerpt: "no later than September 17, 2026 at 17:00 EST.",
          locationCitation: "Found on Page 1, Line 6 (Cutoff & Deadlines)",
          confidence: 0.98,
          highlightCoordinates: { x: 10, y: 48, width: 80, height: 10 }
        },
        {
          id: "f-3",
          label: "Missing Item",
          value: "Annexure-B (Certified Income Certificate)",
          sourceExcerpt: "all recipients must submit Annexure-B (Certified Gross Familial Income Certificate)",
          locationCitation: "Found on Page 1, Paragraph 2 (Required Annexures)",
          confidence: 0.97,
          highlightCoordinates: { x: 10, y: 40, width: 80, height: 10 }
        },
        {
          id: "f-4",
          label: "Submission Method",
          value: "Upload to Student Portal or Hand-in Counter 4",
          sourceExcerpt: "delivered via the Student Self-Service Portal or physically at Administration Hall, Counter 4.",
          locationCitation: "Found on Page 1, Final Sentence",
          confidence: 0.96,
          highlightCoordinates: { x: 10, y: 75, width: 80, height: 12 }
        }
      ],
      whatToDoNext: [
        "Locate your family's recent Certified Income Certificate or Tax Summary",
        "Sign and date Annexure-B",
        "Log into Student Portal and upload before Sept 17, 2026",
        "Keep confirmation receipt #AURA-9921 for your records"
      ],
      simplifiedExplanation: "Good news: your scholarship was approved! There is just one simple step left: upload your family income paper online before September 17 at 5 PM so your money is sent to your school account.",
      confidenceScore: 0.98,
      explainabilityNote: "Verified directly against institutional financial regulation clauses and date-stamp parameters detected in the official letterhead.",
      timestamp: "Today, 10:14 AM",
      sampleType: "university"
    },
    adaptiveData: {
      sourceTitle: "Merit Tuition Subsidy Notice",
      standard: "Pursuant to Section 4.8 of the Higher Education Affordability Directive, your application for the Merit Tuition Subsidy has been provisionally accepted. To finalize the disbursement of funds ($4,500/semester), all recipients must submit Annexure-B (Certified Gross Familial Income Certificate) no later than September 17, 2026 at 17:00 EST. Failure to submit required annexures by the prescribed cutoff will result in automatic nullification of the allocated financial concession.",
      simple: "You won the $4,500 Merit Scholarship! To receive the money, upload your family Income Certificate before September 17 at 5:00 PM.",
      visualSteps: [
        { stepNumber: 1, title: "Grant Awarded", description: "Merit Scholarship provisionally approved ($4,500)", icon: "CheckCircle", status: "Completed" },
        { stepNumber: 2, title: "Income Certificate", description: "Annexure-B or IRS 1040 tax document", icon: "FileText", status: "Action Needed" },
        { stepNumber: 3, title: "Upload to Portal", description: "Student Self-Service or Counter 4 in person", icon: "Send", status: "Pending" },
        { stepNumber: 4, title: "Deadline Cutoff", description: "Sept 17, 2026 at 5:00 PM", icon: "Clock", status: "Important" }
      ],
      voiceScript: "Congratulations! You have received the Merit Tuition Subsidy worth $4,500. There is just one task to complete: please upload your income certificate to the student portal before September 17th at 5 PM so your funding is guaranteed.",
      keyMetrics: [
        { label: "Status", value: "Provisionally Approved" },
        { label: "Amount", value: "$4,500 / Sem" },
        { label: "Deadline", value: "Sept 17, 2026" },
        { label: "Missing", value: "Income Cert" }
      ]
    }
  },
  medical: {
    label: "Medical Care Plan & Prescription",
    icon: "HeartPulse",
    rawDocumentText: `ST. JUDE HEALTHCARE PARTNERS — DISCHARGE & THERAPEUTIC DIRECTIVE
PATIENT: Alex Rivera | DOB: 1994-04-12 | CLINICIAN: Dr. Sarah Vance, MD
DIAGNOSIS: Post-operative recovery / acute inflammation
MEDICATION REGIMEN:
1. Amoxicillin-Clav 500mg: Take 1 tablet orally BID (twice daily) every 12 hours with a full glass of water and food for 7 days. Do not discontinue early.
2. Ibuprofen 400mg: Take 1 tablet every 6-8 hours PRN (as needed) for discomfort. Maximum 1200mg/24 hours.
PRECAUTIONARY PROTOCOL: If gastrointestinal upset or cutaneous rash develops, cease NSAID and notify clinic immediately at (555) 019-2834.
FOLLOW-UP: Mandatory surgical wound review scheduled for October 4, 2026 at 10:30 AM in Suite 3B.`,
    result: {
      id: "doc-med-02",
      classification: "🏥 Medical Care Plan",
      title: "Prescription & Follow-up Instructions",
      oneLineSummary: "Take your antibiotic twice a day with food for 7 days, and come back on October 4 for your checkup.",
      essentialFacts: [
        {
          id: "m-1",
          label: "Antibiotic Schedule",
          value: "Amoxicillin 500mg — 2 times a day with meals (finish all 7 days)",
          sourceExcerpt: "Take 1 tablet orally BID (twice daily) every 12 hours with a full glass of water and food for 7 days.",
          locationCitation: "Found on Page 1, Medication Regimen #1",
          confidence: 0.99,
          highlightCoordinates: { x: 10, y: 38, width: 80, height: 12 }
        },
        {
          id: "m-2",
          label: "Pain Relief Limit",
          value: "Ibuprofen 400mg as needed — max 3 pills per day",
          sourceExcerpt: "Take 1 tablet every 6-8 hours PRN for discomfort. Maximum 1200mg/24 hours.",
          locationCitation: "Found on Page 1, Medication Regimen #2",
          confidence: 0.98,
          highlightCoordinates: { x: 10, y: 52, width: 80, height: 10 }
        },
        {
          id: "m-3",
          label: "Next Doctor Visit",
          value: "October 4, 2026 at 10:30 AM (Suite 3B)",
          sourceExcerpt: "Mandatory surgical wound review scheduled for October 4, 2026 at 10:30 AM in Suite 3B.",
          locationCitation: "Found on Page 1, Follow-up Section",
          confidence: 0.99,
          highlightCoordinates: { x: 10, y: 78, width: 80, height: 10 }
        }
      ],
      whatToDoNext: [
        "Set phone alarms for 8:00 AM and 8:00 PM for your antibiotics",
        "Always take medication with meals and water",
        "Add follow-up visit on Oct 4 at 10:30 AM to calendar",
        "Call (555) 019-2834 if you get any skin rash or stomach pain"
      ],
      simplifiedExplanation: "You have two medications: an antibiotic to take every 12 hours with food for one week, and a pain reliever to take only when you feel soreness. Your next doctor visit is on October 4 at 10:30 AM.",
      confidenceScore: 0.99,
      explainabilityNote: "Parsed directly from prescription abbreviations (BID = twice daily, PRN = as needed) and clinic calendar booking stamp.",
      timestamp: "Today, 9:30 AM",
      sampleType: "medical"
    },
    adaptiveData: {
      sourceTitle: "Medical Discharge Directive",
      standard: "Take 1 tablet Amoxicillin 500mg orally BID with food for 7 days. Take Ibuprofen 400mg PRN for pain (max 1200mg/24hr). Follow-up scheduled for October 4 at 10:30 AM.",
      simple: "Take 1 antibiotic pill in the morning and 1 at night with food for 7 days. See Dr. Vance on October 4 at 10:30 AM.",
      visualSteps: [
        { stepNumber: 1, title: "Morning Pill (8 AM)", description: "1 Antibiotic + Food + Glass of water", icon: "CheckCircle", status: "Action Needed" },
        { stepNumber: 2, title: "Evening Pill (8 PM)", description: "1 Antibiotic + Dinner", icon: "CheckCircle", status: "Pending" },
        { stepNumber: 3, title: "Pain Pill as needed", description: "Max 3 Ibuprofen in 24 hours", icon: "AlertCircle", status: "Pending" },
        { stepNumber: 4, title: "Doctor Appointment", description: "Oct 4 at 10:30 AM in Suite 3B", icon: "Clock", status: "Important" }
      ],
      voiceScript: "Here is your medicine plan. Take your antibiotic twice a day with meals: once in the morning and once in the evening. Keep taking it for the full 7 days. Your follow-up appointment is on October 4th at 10:30 AM.",
      keyMetrics: [
        { label: "Antibiotic", value: "2x Daily / 7 Days" },
        { label: "With Food", value: "Always" },
        { label: "Next Visit", value: "Oct 4, 10:30 AM" }
      ]
    }
  },
  utility: {
    label: "City Water & Utility Notice",
    icon: "Droplet",
    rawDocumentText: `DEPARTMENT OF MUNICIPAL UTILITIES — METRO DISTRICT
ACCOUNT NO: #W-88390-21 | BILLING CYCLE: JULY-AUGUST 2026
URGENT NOTICE OF OVERDUE BALANCE & GRACE PERIOD
Dear Resident,
Our records indicate an unremitted balance of $124.50 on your municipal water utility account. In accordance with City Ordinance 14-B, accounts with outstanding arrears exceeding 45 days are subject to an administrative penalty of $25.00 unless cleared or arranged on an installment waiver. The final date of grace before penalty execution is August 30, 2026. If you have already submitted your self-meter photograph or qualify for the Low-Income Senior/Disability Rebate, please confirm via municipal portal www.citywater.gov/pay or dial 311.`,
    result: {
      id: "doc-util-03",
      classification: "⚡ Municipal Utility Notice",
      title: "Water Bill Overdue & Late Fee Warning",
      oneLineSummary: "Pay $124.50 or request a fee waiver before August 30 to avoid a $25 extra penalty.",
      essentialFacts: [
        {
          id: "u-1",
          label: "Total Amount Due",
          value: "$124.50 (Standard billing balance)",
          sourceExcerpt: "an unremitted balance of $124.50 on your municipal water utility account.",
          locationCitation: "Found on Page 1, Paragraph 1",
          confidence: 0.99,
          highlightCoordinates: { x: 10, y: 30, width: 80, height: 10 }
        },
        {
          id: "u-2",
          label: "Grace Period Deadline",
          value: "August 30, 2026 (Before $25 fee is added)",
          sourceExcerpt: "The final date of grace before penalty execution is August 30, 2026.",
          locationCitation: "Found on Page 1, Paragraph 2 (Ordinance 14-B)",
          confidence: 0.98,
          highlightCoordinates: { x: 10, y: 48, width: 80, height: 10 }
        },
        {
          id: "u-3",
          label: "Waiver Option",
          value: "Low-Income / Disability rebate & payment plans available",
          sourceExcerpt: "qualify for the Low-Income Senior/Disability Rebate, please confirm via municipal portal",
          locationCitation: "Found on Page 1, Line 8",
          confidence: 0.96,
          highlightCoordinates: { x: 10, y: 65, width: 80, height: 10 }
        }
      ],
      whatToDoNext: [
        "Visit citywater.gov/pay or call 311",
        "Pay $124.50 online before August 30",
        "Or request hardship / installment waiver if needed"
      ],
      simplifiedExplanation: "The city sent a reminder about your $124.50 water bill. Pay it before August 30 so you won't be charged an extra $25 fee. If you need financial assistance, you can call 311 for a payment plan.",
      confidenceScore: 0.97,
      explainabilityNote: "Extracted from municipal penalty bylaws and customer account billing line items.",
      timestamp: "Yesterday, 4:15 PM",
      sampleType: "utility"
    },
    adaptiveData: {
      sourceTitle: "City Water Bill Notice",
      standard: "Outstanding arrears of $124.50 subject to $25.00 administrative penalty under Ordinance 14-B unless cleared prior to August 30, 2026. Rebates available for eligible households.",
      simple: "Pay your $124.50 water bill before August 30 to avoid a $25 late fee.",
      visualSteps: [
        { stepNumber: 1, title: "Amount Due", description: "$124.50 water bill balance", icon: "AlertCircle", status: "Action Needed" },
        { stepNumber: 2, title: "Pay Online or 311", description: "Visit citywater.gov/pay", icon: "Send", status: "Pending" },
        { stepNumber: 3, title: "Fee Deadline", description: "August 30, 2026 (Avoid +$25)", icon: "Clock", status: "Important" }
      ],
      voiceScript: "You have a water bill of $124.50. Please make your payment by August 30th to avoid a $25 late fee. You can pay online or dial 311 to set up a payment plan.",
      keyMetrics: [
        { label: "Due", value: "$124.50" },
        { label: "Late Fee", value: "+$25 if missed" },
        { label: "Deadline", value: "Aug 30, 2026" }
      ]
    }
  }
};

export const INITIAL_CHECKLIST: ActionChecklistItem[] = [
  {
    id: "chk-1",
    title: "Download Certified Income Certificate Annexure-B",
    category: "University Subsidy",
    dueDate: "Sep 15, 2026",
    isCompleted: false,
    sourceDocName: "Merit Tuition Subsidy Notice",
    priority: "high",
    notes: "Need parental tax statement or official certificate"
  },
  {
    id: "chk-2",
    title: "Upload Income Certificate to Student Portal",
    category: "University Subsidy",
    dueDate: "Sep 17, 2026",
    isCompleted: false,
    sourceDocName: "Merit Tuition Subsidy Notice",
    priority: "high",
    notes: "Must be uploaded before 5:00 PM EST"
  },
  {
    id: "chk-3",
    title: "Pay City Water Utility Bill ($124.50)",
    category: "Household",
    dueDate: "Aug 30, 2026",
    isCompleted: true,
    sourceDocName: "City Water & Utility Notice",
    priority: "medium"
  },
  {
    id: "chk-4",
    title: "Attend Doctor Follow-up Appointment (Suite 3B)",
    category: "Health & Clinic",
    dueDate: "Oct 04, 2026",
    isCompleted: false,
    sourceDocName: "Medical Care Plan",
    priority: "medium",
    notes: "10:30 AM with Dr. Sarah Vance"
  }
];

export const COMMUNICATION_CONTEXTS = [
  { id: "Classroom", label: "🏫 Classroom & School", icon: "BookOpen" },
  { id: "Clinic", label: "🏥 Doctor & Clinic", icon: "HeartPulse" },
  { id: "Shop", label: "🛒 Store & Grocery", icon: "ShoppingCart" },
  { id: "Everyday", label: "🏡 Home & Everyday", icon: "Home" },
  { id: "Bureaucracy", label: "🏛️ Office & Bureaucracy", icon: "Building" },
  { id: "Transit", label: "🚌 Bus & Transit", icon: "Compass" }
];

export const FRAGMENT_TILES_BY_CONTEXT: Record<string, CommunicationFragment[]> = {
  Classroom: [
    { id: "c-1", text: "Teacher", category: "who" },
    { id: "c-2", text: "Water", category: "what" },
    { id: "c-3", text: "Bathroom", category: "places" },
    { id: "c-4", text: "Please", category: "manner" },
    { id: "c-5", text: "Help me", category: "action" },
    { id: "c-6", text: "Assignment", category: "what" },
    { id: "c-7", text: "Need more time", category: "manner" },
    { id: "c-8", text: "Explain again", category: "action" },
    { id: "c-9", text: "Noise is too loud", category: "what" },
    { id: "c-10", text: "Can I leave?", category: "action" },
    { id: "c-11", text: "Thank you", category: "manner" }
  ],
  Clinic: [
    { id: "m-1", text: "Doctor", category: "who" },
    { id: "m-2", text: "Pain here", category: "what" },
    { id: "m-3", text: "Medicine hurts", category: "what" },
    { id: "m-4", text: "Please speak slowly", category: "manner" },
    { id: "m-5", text: "Write it down", category: "action" },
    { id: "m-6", text: "Side effects", category: "what" },
    { id: "m-7", text: "Allergy", category: "what" },
    { id: "m-8", text: "Need wheelchair", category: "what" },
    { id: "m-9", text: "When is follow up?", category: "action" },
    { id: "m-10", text: "Thank you", category: "manner" }
  ],
  Shop: [
    { id: "s-1", text: "Cashier", category: "who" },
    { id: "s-2", text: "Price check", category: "action" },
    { id: "s-3", text: "Where is this item?", category: "action" },
    { id: "s-4", text: "Need bag", category: "what" },
    { id: "s-5", text: "Card payment", category: "what" },
    { id: "s-6", text: "Gluten free?", category: "what" },
    { id: "s-7", text: "Can you reach that?", category: "action" },
    { id: "s-8", text: "Receipt please", category: "what" },
    { id: "s-9", text: "Thank you", category: "manner" }
  ],
  Everyday: [
    { id: "e-1", text: "Water", category: "what" },
    { id: "e-2", text: "Hungry", category: "what" },
    { id: "e-3", text: "Tired", category: "what" },
    { id: "e-4", text: "Please help", category: "action" },
    { id: "e-5", text: "Give me a minute", category: "manner" },
    { id: "e-6", text: "Too bright", category: "what" },
    { id: "e-7", text: "Yes", category: "manner" },
    { id: "e-8", text: "No", category: "manner" },
    { id: "e-9", text: "I feel overwhelmed", category: "what" },
    { id: "e-10", text: "Call my family", category: "action" }
  ],
  Bureaucracy: [
    { id: "b-1", text: "Officer / Clerk", category: "who" },
    { id: "b-2", text: "Which form?", category: "action" },
    { id: "b-3", text: "What is missing?", category: "what" },
    { id: "b-4", text: "Deadline date?", category: "what" },
    { id: "b-5", text: "Need translator", category: "what" },
    { id: "b-6", text: "Explain simply", category: "action" },
    { id: "b-7", text: "Stamp this copy", category: "action" },
    { id: "b-8", text: "Thank you", category: "manner" }
  ],
  Transit: [
    { id: "t-1", text: "Driver", category: "who" },
    { id: "t-2", text: "Next stop", category: "places" },
    { id: "t-3", text: "Does this go to station?", category: "action" },
    { id: "t-4", text: "Need seat", category: "what" },
    { id: "t-5", text: "Ramp please", category: "what" },
    { id: "t-6", text: "How much is fare?", category: "what" },
    { id: "t-7", text: "Thank you", category: "manner" }
  ]
};
