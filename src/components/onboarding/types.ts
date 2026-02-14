export type ClientType = 'banking' | 'oca' | 'residential' | 'corporate' | 'government';

export type OnboardingStatus = 'questionnaire' | 'estimate' | 'scope' | 'terms' | 'contract' | 'active';

export type EstimateStatus = 'draft' | 'sent' | 'accepted' | 'declined';

export type ContractStatus = 'draft' | 'pending_signature' | 'signed' | 'expired';

export interface ClientProfile {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  clientType: ClientType;
  status: OnboardingStatus;
  createdAt: string;
  address: string;
  industry: string;
  numberOfSites: number;
  numberOfUsers: number;
  answers: QuestionnaireAnswers;
}

export interface QuestionnaireAnswers {
  clientType: ClientType;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  industry: string;
  numberOfSites: number;
  numberOfUsers: number;
  accessControlNeeds: string[];
  integrationRequirements: string[];
  complianceRequirements: string[];
  currentSystem: string;
  timeline: string;
  budget: string;
  additionalNotes: string;
}

export interface EstimateLineItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Estimate {
  id: string;
  clientId: string;
  clientName: string;
  status: EstimateStatus;
  lineItems: EstimateLineItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  total: number;
  validUntil: string;
  createdAt: string;
  notes: string;
  estimateNumber: string;
}

export interface ScopeItem {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
  timeline: string;
  included: boolean;
}

export interface ScopeOfWork {
  id: string;
  clientId: string;
  projectName: string;
  projectDescription: string;
  startDate: string;
  endDate: string;
  items: ScopeItem[];
  exclusions: string[];
  assumptions: string[];
}

export interface TermsSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Terms {
  id: string;
  name: string;
  sections: TermsSection[];
  lastUpdated: string;
}

export interface Contract {
  id: string;
  clientId: string;
  clientName: string;
  status: ContractStatus;
  estimateId: string;
  scopeId: string;
  termsId: string;
  startDate: string;
  endDate: string;
  totalValue: number;
  signedDate?: string;
  createdAt: string;
  contractNumber: string;
}

export const CLIENT_TYPE_CONFIG: Record<ClientType, { label: string; color: string; icon: string; description: string }> = {
  banking: {
    label: 'Banking & Financial',
    color: 'bg-blue-100 text-blue-800',
    icon: '🏦',
    description: 'Banks, financial institutions, and fintech companies',
  },
  oca: {
    label: 'OCA (Office & Commercial)',
    color: 'bg-purple-100 text-purple-800',
    icon: '🏢',
    description: 'Office parks, commercial buildings, and retail spaces',
  },
  residential: {
    label: 'Residential Estate',
    color: 'bg-green-100 text-green-800',
    icon: '🏘️',
    description: 'Residential estates, gated communities, and complexes',
  },
  corporate: {
    label: 'Corporate Campus',
    color: 'bg-amber-100 text-amber-800',
    icon: '🏗️',
    description: 'Corporate campuses, tech parks, and industrial facilities',
  },
  government: {
    label: 'Government & Public',
    color: 'bg-red-100 text-red-800',
    icon: '🏛️',
    description: 'Government buildings, public facilities, and institutions',
  },
};

export const STATUS_CONFIG: Record<OnboardingStatus, { label: string; color: string; step: number }> = {
  questionnaire: { label: 'Questionnaire', color: 'bg-gray-100 text-gray-700', step: 1 },
  estimate: { label: 'Estimate', color: 'bg-blue-100 text-blue-700', step: 2 },
  scope: { label: 'Scope of Work', color: 'bg-purple-100 text-purple-700', step: 3 },
  terms: { label: 'Terms & Conditions', color: 'bg-amber-100 text-amber-700', step: 4 },
  contract: { label: 'Contract', color: 'bg-orange-100 text-orange-700', step: 5 },
  active: { label: 'Active Client', color: 'bg-green-100 text-green-700', step: 6 },
};

export const ACCESS_CONTROL_OPTIONS = [
  'Biometric Access (Fingerprint/Face)',
  'RFID Card Access',
  'QR Code / Barcode Scanning',
  'Vehicle ANPR (Number Plate Recognition)',
  'Visitor Pre-Registration',
  'Intercom / Video Integration',
  'Boom Gate Control',
  'Turnstile Integration',
  'Mobile App Access',
  'Multi-Factor Authentication',
];

export const INTEGRATION_OPTIONS = [
  'CCTV / Surveillance Systems',
  'Fire & Safety Alarms',
  'Building Management System (BMS)',
  'HR / Payroll Systems',
  'Active Directory / LDAP',
  'Third-Party Security API',
  'Property Management Software',
  'Parking Management System',
  'Elevator Control System',
  'Time & Attendance System',
];

export const COMPLIANCE_OPTIONS = [
  'POPIA (SA Privacy)',
  'GDPR',
  'ISO 27001',
  'PSIRA Compliance',
  'OHS Act Requirements',
  'Banking Regulations (SARB)',
  'Insurance Requirements',
  'Municipal By-Laws',
];

export const DEFAULT_TERMS_SECTIONS: TermsSection[] = [
  {
    id: '1',
    title: '1. Definitions & Interpretation',
    content: '"Service Provider" refers to GATE-IQ Access Control (Pty) Ltd. "Client" refers to the party engaging the Service Provider for access control solutions. "System" refers to the hardware, software, and services provided under this agreement. "Effective Date" means the date on which this agreement is signed by both parties.',
    order: 1,
  },
  {
    id: '2',
    title: '2. Scope of Services',
    content: 'The Service Provider shall supply, install, configure, and maintain the access control system as detailed in the accompanying Scope of Work document. Any work outside the defined scope shall be subject to additional quotation and written approval by the Client.',
    order: 2,
  },
  {
    id: '3',
    title: '3. Payment Terms',
    content: 'A 50% deposit is required upon acceptance of this estimate to commence work. The remaining 50% is payable upon completion and sign-off of the installation. Monthly maintenance fees are billed in advance on the 1st of each month. All invoices are payable within 30 days of issue. Late payments will incur interest at 2% per month on the outstanding balance.',
    order: 3,
  },
  {
    id: '4',
    title: '4. Warranty & Support',
    content: 'All hardware is covered by a 12-month manufacturer warranty from the date of installation. Software licenses include 12 months of updates and patches. The Service Provider offers a 24/7 emergency support line for critical system failures. Standard support hours are Monday to Friday, 08:00 – 17:00 (SAST).',
    order: 4,
  },
  {
    id: '5',
    title: '5. Service Level Agreement (SLA)',
    content: 'Critical system failures: 4-hour response time. Major issues: 8-hour response time. Minor issues: 24-hour response time. Scheduled maintenance will be performed during off-peak hours with 48 hours advance notice. System uptime target: 99.5% excluding scheduled maintenance windows.',
    order: 5,
  },
  {
    id: '6',
    title: '6. Data Protection & Privacy',
    content: 'The Service Provider complies with the Protection of Personal Information Act (POPIA). All personal data collected through the access control system is processed lawfully and stored securely. Data is encrypted at rest and in transit. The Client remains the data controller; the Service Provider acts as data processor. Data retention policies will be agreed upon during implementation.',
    order: 6,
  },
  {
    id: '7',
    title: '7. Liability & Indemnification',
    content: 'The Service Provider\'s total liability shall not exceed the total contract value. The Service Provider is not liable for indirect, consequential, or special damages. The Client indemnifies the Service Provider against claims arising from misuse of the system. Force majeure events exempt both parties from performance obligations.',
    order: 7,
  },
  {
    id: '8',
    title: '8. Termination',
    content: 'Either party may terminate with 90 days written notice. Immediate termination is permitted for material breach that remains unremedied 30 days after written notice. Upon termination, all Client data will be exported and securely deleted within 60 days. Hardware ownership transfers to the Client upon full payment.',
    order: 8,
  },
  {
    id: '9',
    title: '9. Intellectual Property',
    content: 'The GATE-IQ software and proprietary algorithms remain the intellectual property of the Service Provider. The Client receives a non-exclusive, non-transferable license to use the system for the duration of the agreement. Custom configurations developed for the Client are owned by the Client.',
    order: 9,
  },
  {
    id: '10',
    title: '10. Governing Law & Dispute Resolution',
    content: 'This agreement is governed by the laws of the Republic of South Africa. Disputes shall first be addressed through mediation. If mediation fails, disputes shall be resolved through arbitration in accordance with the rules of the Arbitration Foundation of Southern Africa (AFSA). The venue for arbitration shall be Johannesburg, Gauteng.',
    order: 10,
  },
];
