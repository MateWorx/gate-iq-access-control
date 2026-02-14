import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Building2, User, Mail, Phone, MapPin, Globe, Users, Monitor, Shield, Clock, DollarSign, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ClientType,
  QuestionnaireAnswers,
  CLIENT_TYPE_CONFIG,
  ACCESS_CONTROL_OPTIONS,
  INTEGRATION_OPTIONS,
  COMPLIANCE_OPTIONS,
} from './types';

interface OnboardingWizardProps {
  onComplete: (answers: QuestionnaireAnswers) => void;
  onCancel: () => void;
}

const STEPS = [
  { title: 'Client Type', description: 'What type of client are you onboarding?' },
  { title: 'Company Details', description: 'Tell us about the organization' },
  { title: 'Site Information', description: 'Details about the locations' },
  { title: 'Access Control Needs', description: 'What features do they need?' },
  { title: 'Integrations', description: 'What systems need to connect?' },
  { title: 'Compliance', description: 'Regulatory requirements' },
  { title: 'Timeline & Budget', description: 'Project expectations' },
  { title: 'Review', description: 'Confirm all details' },
];

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    clientType: 'residential',
    companyName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    industry: '',
    numberOfSites: 1,
    numberOfUsers: 50,
    accessControlNeeds: [],
    integrationRequirements: [],
    complianceRequirements: [],
    currentSystem: '',
    timeline: '',
    budget: '',
    additionalNotes: '',
  });

  const updateAnswer = <K extends keyof QuestionnaireAnswers>(key: K, value: QuestionnaireAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: 'accessControlNeeds' | 'integrationRequirements' | 'complianceRequirements', item: string) => {
    setAnswers((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item],
      };
    });
  };

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const renderClientTypeStep = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {(Object.entries(CLIENT_TYPE_CONFIG) as [ClientType, typeof CLIENT_TYPE_CONFIG[ClientType]][]).map(([type, config]) => (
        <button
          key={type}
          onClick={() => updateAnswer('clientType', type)}
          className={`p-5 rounded-xl border-2 text-left transition-all hover:shadow-md ${
            answers.clientType === type
              ? 'border-navy bg-navy/5 shadow-md'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{config.icon}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{config.label}</h3>
                {answers.clientType === type && (
                  <div className="h-5 w-5 rounded-full bg-navy flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{config.description}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );

  const renderCompanyDetailsStep = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Building2 className="h-4 w-4 text-gray-400" /> Company Name
          </Label>
          <Input
            value={answers.companyName}
            onChange={(e) => updateAnswer('companyName', e.target.value)}
            placeholder="Enter company name"
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Globe className="h-4 w-4 text-gray-400" /> Industry
          </Label>
          <Input
            value={answers.industry}
            onChange={(e) => updateAnswer('industry', e.target.value)}
            placeholder="e.g. Property Management"
            className="h-11"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <User className="h-4 w-4 text-gray-400" /> Contact Name
          </Label>
          <Input
            value={answers.contactName}
            onChange={(e) => updateAnswer('contactName', e.target.value)}
            placeholder="Primary contact person"
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Phone className="h-4 w-4 text-gray-400" /> Contact Phone
          </Label>
          <Input
            value={answers.contactPhone}
            onChange={(e) => updateAnswer('contactPhone', e.target.value)}
            placeholder="+27 XX XXX XXXX"
            className="h-11"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Mail className="h-4 w-4 text-gray-400" /> Contact Email
        </Label>
        <Input
          type="email"
          value={answers.contactEmail}
          onChange={(e) => updateAnswer('contactEmail', e.target.value)}
          placeholder="email@company.co.za"
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4 text-gray-400" /> Physical Address
        </Label>
        <Textarea
          value={answers.address}
          onChange={(e) => updateAnswer('address', e.target.value)}
          placeholder="Full physical address"
          rows={2}
        />
      </div>
    </div>
  );

  const renderSiteInfoStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl border border-gray-200 bg-gray-50/50">
          <Label className="flex items-center gap-2 text-sm font-medium mb-3">
            <MapPin className="h-4 w-4 text-navy" /> Number of Sites
          </Label>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => updateAnswer('numberOfSites', Math.max(1, answers.numberOfSites - 1))}>-</Button>
            <span className="text-3xl font-bold text-navy min-w-[3ch] text-center">{answers.numberOfSites}</span>
            <Button variant="outline" size="sm" onClick={() => updateAnswer('numberOfSites', answers.numberOfSites + 1)}>+</Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Physical locations requiring access control</p>
        </div>
        <div className="p-5 rounded-xl border border-gray-200 bg-gray-50/50">
          <Label className="flex items-center gap-2 text-sm font-medium mb-3">
            <Users className="h-4 w-4 text-navy" /> Estimated Users
          </Label>
          <Select value={String(answers.numberOfUsers)} onValueChange={(v) => updateAnswer('numberOfUsers', Number(v))}>
            <SelectTrigger className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">1 – 25 users</SelectItem>
              <SelectItem value="50">26 – 50 users</SelectItem>
              <SelectItem value="100">51 – 100 users</SelectItem>
              <SelectItem value="250">101 – 250 users</SelectItem>
              <SelectItem value="500">251 – 500 users</SelectItem>
              <SelectItem value="1000">501 – 1,000 users</SelectItem>
              <SelectItem value="5000">1,000+ users</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-2">Total people needing system access</p>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Monitor className="h-4 w-4 text-gray-400" /> Current Access Control System
        </Label>
        <Select value={answers.currentSystem} onValueChange={(v) => updateAnswer('currentSystem', v)}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select current system..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No existing system</SelectItem>
            <SelectItem value="manual">Manual / Paper-based</SelectItem>
            <SelectItem value="basic">Basic card/key system</SelectItem>
            <SelectItem value="advanced">Advanced electronic system</SelectItem>
            <SelectItem value="competitor">Competitor product</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderCheckboxGroup = (
    key: 'accessControlNeeds' | 'integrationRequirements' | 'complianceRequirements',
    options: string[],
    icon: React.ReactNode
  ) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {options.map((option) => (
        <label
          key={option}
          className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
            answers[key].includes(option) ? 'border-navy bg-navy/5' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Checkbox
            checked={answers[key].includes(option)}
            onCheckedChange={() => toggleArrayItem(key, option)}
          />
          <span className="text-sm">{option}</span>
        </label>
      ))}
    </div>
  );

  const renderAccessControlStep = () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Select all access control features the client requires:</p>
      {renderCheckboxGroup('accessControlNeeds', ACCESS_CONTROL_OPTIONS, <Shield className="h-4 w-4" />)}
    </div>
  );

  const renderIntegrationsStep = () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Select systems that need to integrate with the access control platform:</p>
      {renderCheckboxGroup('integrationRequirements', INTEGRATION_OPTIONS, <Monitor className="h-4 w-4" />)}
    </div>
  );

  const renderComplianceStep = () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Select all applicable compliance and regulatory requirements:</p>
      {renderCheckboxGroup('complianceRequirements', COMPLIANCE_OPTIONS, <Shield className="h-4 w-4" />)}
    </div>
  );

  const renderTimelineBudgetStep = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Clock className="h-4 w-4 text-gray-400" /> Preferred Timeline
        </Label>
        <Select value={answers.timeline} onValueChange={(v) => updateAnswer('timeline', v)}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select timeline..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="urgent">Urgent (1 – 2 weeks)</SelectItem>
            <SelectItem value="standard">Standard (1 – 2 months)</SelectItem>
            <SelectItem value="phased">Phased rollout (3 – 6 months)</SelectItem>
            <SelectItem value="flexible">Flexible / No rush</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <DollarSign className="h-4 w-4 text-gray-400" /> Budget Range
        </Label>
        <Select value={answers.budget} onValueChange={(v) => updateAnswer('budget', v)}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select budget range..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">R 25,000 – R 75,000</SelectItem>
            <SelectItem value="medium">R 75,000 – R 250,000</SelectItem>
            <SelectItem value="large">R 250,000 – R 750,000</SelectItem>
            <SelectItem value="enterprise">R 750,000+</SelectItem>
            <SelectItem value="unknown">Not yet determined</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <MessageSquare className="h-4 w-4 text-gray-400" /> Additional Notes
        </Label>
        <Textarea
          value={answers.additionalNotes}
          onChange={(e) => updateAnswer('additionalNotes', e.target.value)}
          placeholder="Any other requirements, concerns, or special considerations..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderReviewStep = () => {
    const config = CLIENT_TYPE_CONFIG[answers.clientType];
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-xl bg-gradient-to-br from-navy to-navy-light text-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{config.icon}</span>
            <div>
              <h3 className="text-lg font-bold">{answers.companyName || 'Company Name'}</h3>
              <span className="text-sm opacity-80">{config.label}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReviewCard title="Contact Information">
            <ReviewItem label="Name" value={answers.contactName} />
            <ReviewItem label="Email" value={answers.contactEmail} />
            <ReviewItem label="Phone" value={answers.contactPhone} />
            <ReviewItem label="Address" value={answers.address} />
          </ReviewCard>
          <ReviewCard title="Site Details">
            <ReviewItem label="Sites" value={String(answers.numberOfSites)} />
            <ReviewItem label="Users" value={String(answers.numberOfUsers)} />
            <ReviewItem label="Current System" value={answers.currentSystem || 'Not specified'} />
            <ReviewItem label="Industry" value={answers.industry} />
          </ReviewCard>
        </div>

        <ReviewCard title="Access Control Features">
          <div className="flex flex-wrap gap-2">
            {answers.accessControlNeeds.map((need) => (
              <span key={need} className="px-2.5 py-1 bg-navy/10 text-navy text-xs rounded-full font-medium">{need}</span>
            ))}
            {answers.accessControlNeeds.length === 0 && <span className="text-sm text-gray-400">None selected</span>}
          </div>
        </ReviewCard>

        <ReviewCard title="Integration Requirements">
          <div className="flex flex-wrap gap-2">
            {answers.integrationRequirements.map((req) => (
              <span key={req} className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">{req}</span>
            ))}
            {answers.integrationRequirements.length === 0 && <span className="text-sm text-gray-400">None selected</span>}
          </div>
        </ReviewCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReviewCard title="Compliance">
            <div className="flex flex-wrap gap-2">
              {answers.complianceRequirements.map((req) => (
                <span key={req} className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">{req}</span>
              ))}
              {answers.complianceRequirements.length === 0 && <span className="text-sm text-gray-400">None selected</span>}
            </div>
          </ReviewCard>
          <ReviewCard title="Timeline & Budget">
            <ReviewItem label="Timeline" value={answers.timeline || 'Not specified'} />
            <ReviewItem label="Budget" value={answers.budget || 'Not specified'} />
          </ReviewCard>
        </div>

        {answers.additionalNotes && (
          <ReviewCard title="Additional Notes">
            <p className="text-sm text-gray-600">{answers.additionalNotes}</p>
          </ReviewCard>
        )}
      </div>
    );
  };

  const stepRenderers = [
    renderClientTypeStep,
    renderCompanyDetailsStep,
    renderSiteInfoStep,
    renderAccessControlStep,
    renderIntegrationsStep,
    renderComplianceStep,
    renderTimelineBudgetStep,
    renderReviewStep,
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">{STEPS[currentStep].title}</h2>
          <span className="text-sm text-gray-500">Step {currentStep + 1} of {STEPS.length}</span>
        </div>
        <p className="text-sm text-gray-500 mb-4">{STEPS[currentStep].description}</p>

        {/* Step Progress Bar */}
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i < currentStep ? 'bg-navy' : i === currentStep ? 'bg-lime' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {stepRenderers[currentStep]()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={currentStep === 0 ? onCancel : prevStep}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {currentStep === 0 ? 'Cancel' : 'Back'}
        </Button>
        {currentStep < STEPS.length - 1 ? (
          <Button onClick={nextStep} className="bg-navy hover:bg-navy-light text-white">
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={() => onComplete(answers)} className="bg-lime hover:bg-lime-dark text-white">
            <Check className="h-4 w-4 mr-2" />
            Complete & Create Estimate
          </Button>
        )}
      </div>
    </div>
  );
};

const ReviewCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="p-4 rounded-xl border border-gray-200 bg-white">
    <h4 className="text-sm font-semibold text-gray-700 mb-3">{title}</h4>
    {children}
  </div>
);

const ReviewItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between py-1.5 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-900">{value || '—'}</span>
  </div>
);

export default OnboardingWizard;
