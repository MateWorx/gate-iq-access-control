import React, { useState } from 'react';
import { Plus, Search, Filter, ChevronRight, Users, FileText, DollarSign, TrendingUp, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ClientProfile,
  OnboardingStatus,
  STATUS_CONFIG,
  CLIENT_TYPE_CONFIG,
  QuestionnaireAnswers,
  Estimate,
  ScopeOfWork,
  Terms,
  Contract,
} from './types';
import OnboardingWizard from './OnboardingWizard';
import EstimateBuilder from './EstimateBuilder';
import EstimatePreview from './EstimatePreview';
import ScopeBuilder from './ScopeBuilder';
import TermsEditor from './TermsEditor';
import ContractBuilder from './ContractBuilder';

type View =
  | 'dashboard'
  | 'wizard'
  | 'estimate'
  | 'estimate-preview'
  | 'scope'
  | 'terms'
  | 'contract';

// Sample data for dashboard
const SAMPLE_CLIENTS: ClientProfile[] = [
  {
    id: '1',
    companyName: 'Sandton City Mall',
    contactName: 'James Nkosi',
    contactEmail: 'james@sandtoncity.co.za',
    contactPhone: '+27 11 234 5678',
    clientType: 'oca',
    status: 'contract',
    createdAt: '2026-01-15',
    address: '83 Rivonia Rd, Sandton, Johannesburg',
    industry: 'Retail & Property',
    numberOfSites: 3,
    numberOfUsers: 500,
    answers: {} as QuestionnaireAnswers,
  },
  {
    id: '2',
    companyName: 'First National Bank',
    contactName: 'Sarah van der Merwe',
    contactEmail: 'sarah@fnb.co.za',
    contactPhone: '+27 11 345 6789',
    clientType: 'banking',
    status: 'estimate',
    createdAt: '2026-01-28',
    address: '4 First Place, Bank City, Johannesburg',
    industry: 'Banking & Finance',
    numberOfSites: 12,
    numberOfUsers: 5000,
    answers: {} as QuestionnaireAnswers,
  },
  {
    id: '3',
    companyName: 'Waterfall Estate',
    contactName: 'Thabo Molefe',
    contactEmail: 'thabo@waterfall.co.za',
    contactPhone: '+27 11 456 7890',
    clientType: 'residential',
    status: 'active',
    createdAt: '2025-12-10',
    address: 'Waterfall City, Midrand',
    industry: 'Residential Estate',
    numberOfSites: 1,
    numberOfUsers: 2500,
    answers: {} as QuestionnaireAnswers,
  },
  {
    id: '4',
    companyName: 'Deloitte SA Campus',
    contactName: 'Lisa Pillay',
    contactEmail: 'lisa@deloitte.co.za',
    contactPhone: '+27 11 567 8901',
    clientType: 'corporate',
    status: 'scope',
    createdAt: '2026-02-01',
    address: '5 Magwa Crescent, Waterfall City',
    industry: 'Professional Services',
    numberOfSites: 2,
    numberOfUsers: 1000,
    answers: {} as QuestionnaireAnswers,
  },
  {
    id: '5',
    companyName: 'Dept of Home Affairs',
    contactName: 'Mandla Dlamini',
    contactEmail: 'mandla@dha.gov.za',
    contactPhone: '+27 12 678 9012',
    clientType: 'government',
    status: 'questionnaire',
    createdAt: '2026-02-10',
    address: '230 Johannes Ramokhoase St, Pretoria',
    industry: 'Government',
    numberOfSites: 25,
    numberOfUsers: 5000,
    answers: {} as QuestionnaireAnswers,
  },
];

const OnboardingDashboard: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<OnboardingStatus | 'all'>('all');

  // Onboarding flow state
  const [currentAnswers, setCurrentAnswers] = useState<QuestionnaireAnswers | undefined>();
  const [currentEstimate, setCurrentEstimate] = useState<Estimate | undefined>();
  const [currentScope, setCurrentScope] = useState<ScopeOfWork | undefined>();
  const [currentTerms, setCurrentTerms] = useState<Terms | undefined>();
  const [currentContract, setCurrentContract] = useState<Contract | undefined>();

  const filteredClients = SAMPLE_CLIENTS.filter((client) => {
    const matchesSearch =
      client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contactName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: SAMPLE_CLIENTS.length,
    active: SAMPLE_CLIENTS.filter((c) => c.status === 'active').length,
    pipeline: SAMPLE_CLIENTS.filter((c) => c.status !== 'active').length,
    totalValue: 2450000,
  };

  // Flow Handlers
  const handleWizardComplete = (answers: QuestionnaireAnswers) => {
    setCurrentAnswers(answers);
    setView('estimate');
  };

  const handleEstimateSave = (estimate: Estimate) => {
    setCurrentEstimate(estimate);
    setView('scope');
  };

  const handleEstimatePreview = (estimate: Estimate) => {
    setCurrentEstimate(estimate);
    setView('estimate-preview');
  };

  const handleScopeSave = (scope: ScopeOfWork) => {
    setCurrentScope(scope);
    setView('terms');
  };

  const handleTermsSave = (terms: Terms) => {
    setCurrentTerms(terms);
    setView('contract');
  };

  const handleContractSave = (_contract: Contract) => {
    setCurrentContract(_contract);
    // Reset and go back to dashboard
    setView('dashboard');
    setCurrentAnswers(undefined);
    setCurrentEstimate(undefined);
    setCurrentScope(undefined);
    setCurrentTerms(undefined);
    setCurrentContract(undefined);
  };

  const resetFlow = () => {
    setView('dashboard');
    setCurrentAnswers(undefined);
    setCurrentEstimate(undefined);
    setCurrentScope(undefined);
    setCurrentTerms(undefined);
    setCurrentContract(undefined);
  };

  // Render different views
  if (view === 'wizard') {
    return (
      <div>
        <FlowBreadcrumb current="questionnaire" onNavigate={setView} />
        <OnboardingWizard onComplete={handleWizardComplete} onCancel={resetFlow} />
      </div>
    );
  }

  if (view === 'estimate') {
    return (
      <div>
        <FlowBreadcrumb current="estimate" onNavigate={setView} />
        <EstimateBuilder
          clientAnswers={currentAnswers}
          existingEstimate={currentEstimate}
          onSave={handleEstimateSave}
          onPreview={handleEstimatePreview}
          onBack={() => setView('wizard')}
        />
      </div>
    );
  }

  if (view === 'estimate-preview' && currentEstimate) {
    return (
      <div>
        <FlowBreadcrumb current="estimate" onNavigate={setView} />
        <EstimatePreview estimate={currentEstimate} onBack={() => setView('estimate')} />
      </div>
    );
  }

  if (view === 'scope') {
    return (
      <div>
        <FlowBreadcrumb current="scope" onNavigate={setView} />
        <ScopeBuilder
          clientAnswers={currentAnswers}
          existingScopeOfWork={currentScope}
          onSave={handleScopeSave}
          onBack={() => setView('estimate')}
        />
      </div>
    );
  }

  if (view === 'terms') {
    return (
      <div>
        <FlowBreadcrumb current="terms" onNavigate={setView} />
        <TermsEditor
          existingTerms={currentTerms}
          onSave={handleTermsSave}
          onBack={() => setView('scope')}
        />
      </div>
    );
  }

  if (view === 'contract') {
    return (
      <div>
        <FlowBreadcrumb current="contract" onNavigate={setView} />
        <ContractBuilder
          clientAnswers={currentAnswers}
          estimate={currentEstimate}
          scope={currentScope}
          terms={currentTerms}
          existingContract={currentContract}
          onSave={handleContractSave}
          onBack={() => setView('terms')}
        />
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Onboarding</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your client pipeline from questionnaire to contract</p>
        </div>
        <Button onClick={() => setView('wizard')} className="bg-navy hover:bg-navy-light text-white">
          <Plus className="h-4 w-4 mr-2" /> New Client
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Users className="h-5 w-5 text-navy" />} label="Total Clients" value={String(stats.total)} trend="+2 this month" />
        <StatCard icon={<TrendingUp className="h-5 w-5 text-lime" />} label="Active Clients" value={String(stats.active)} trend="1 new" />
        <StatCard icon={<FileText className="h-5 w-5 text-purple-600" />} label="In Pipeline" value={String(stats.pipeline)} trend="4 stages" />
        <StatCard icon={<DollarSign className="h-5 w-5 text-amber-600" />} label="Pipeline Value" value={`R ${(stats.totalValue / 1000000).toFixed(1)}M`} trend="+15% MoM" />
      </div>

      {/* Pipeline View */}
      <div className="overflow-x-auto -mx-6 px-6">
        <div className="flex gap-4 min-w-[1200px] pb-4">
          {(Object.entries(STATUS_CONFIG) as [OnboardingStatus, typeof STATUS_CONFIG[OnboardingStatus]][]).map(([status, config]) => {
            const clients = SAMPLE_CLIENTS.filter((c) => c.status === status);
            return (
              <div key={status} className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.color}`}>{config.label}</div>
                  <span className="text-xs text-gray-400">{clients.length}</span>
                </div>
                <div className="space-y-2">
                  {clients.map((client) => {
                    const typeConfig = CLIENT_TYPE_CONFIG[client.clientType];
                    return (
                      <div
                        key={client.id}
                        className="p-3 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-lg">{typeConfig.icon}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${typeConfig.color}`}>
                            {typeConfig.label}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 truncate">{client.companyName}</h4>
                        <p className="text-xs text-gray-400 truncate">{client.contactName}</p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                          <span className="text-xs text-gray-400">{client.numberOfSites} site{client.numberOfSites > 1 ? 's' : ''}</span>
                          <span className="text-xs text-gray-400">{new Date(client.createdAt).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' })}</span>
                        </div>
                      </div>
                    );
                  })}
                  {clients.length === 0 && (
                    <div className="p-4 rounded-lg border border-dashed border-gray-200 text-center">
                      <p className="text-xs text-gray-400">No clients</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Client List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">All Clients</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clients..."
                className="pl-9 h-9 w-64 text-sm"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as OnboardingStatus | 'all')}
              className="h-9 px-3 text-sm border border-gray-200 rounded-md bg-white text-gray-700"
            >
              <option value="all">All Statuses</option>
              {(Object.entries(STATUS_CONFIG) as [OnboardingStatus, typeof STATUS_CONFIG[OnboardingStatus]][]).map(([status, config]) => (
                <option key={status} value={status}>{config.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sites</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClients.map((client) => {
                const typeConfig = CLIENT_TYPE_CONFIG[client.clientType];
                const statusConfig = STATUS_CONFIG[client.status];
                return (
                  <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{typeConfig.icon}</span>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{client.companyName}</div>
                          <div className="text-xs text-gray-400">{client.industry}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeConfig.color}`}>{typeConfig.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700">{client.contactName}</div>
                      <div className="text-xs text-gray-400">{client.contactEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{client.numberOfSites}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusConfig.color}`}>{statusConfig.label}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(client.createdAt).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Stat Card
const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; trend: string }> = ({
  icon,
  label,
  value,
  trend,
}) => (
  <div className="p-4 rounded-xl border border-gray-200 bg-white">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-xs font-medium text-gray-500">{label}</span>
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <div className="text-xs text-gray-400 mt-1">{trend}</div>
  </div>
);

// Flow Breadcrumb
const FLOW_STEPS: { key: View; label: string }[] = [
  { key: 'wizard', label: 'Questionnaire' },
  { key: 'estimate', label: 'Estimate' },
  { key: 'scope', label: 'Scope' },
  { key: 'terms', label: 'Terms' },
  { key: 'contract', label: 'Contract' },
];

const FlowBreadcrumb: React.FC<{ current: string; onNavigate: (view: View) => void }> = ({ current, onNavigate }) => {
  const currentIndex = FLOW_STEPS.findIndex((s) => s.key === current || (current === 'estimate-preview' && s.key === 'estimate'));

  return (
    <div className="flex items-center gap-1 mb-6 pb-4 border-b border-gray-100">
      <button onClick={() => onNavigate('dashboard')} className="text-xs text-gray-400 hover:text-navy transition-colors">
        Onboarding
      </button>
      {FLOW_STEPS.map((step, index) => {
        const isActive = step.key === current || (current === 'estimate-preview' && step.key === 'estimate');
        const isPast = index < currentIndex;

        return (
          <React.Fragment key={step.key}>
            <ChevronRight className="h-3 w-3 text-gray-300" />
            <button
              onClick={() => isPast ? onNavigate(step.key) : undefined}
              className={`text-xs transition-colors ${
                isActive ? 'text-navy font-semibold' : isPast ? 'text-gray-500 hover:text-navy cursor-pointer' : 'text-gray-300 cursor-default'
              }`}
            >
              {step.label}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default OnboardingDashboard;
