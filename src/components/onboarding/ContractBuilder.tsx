import React, { useState } from 'react';
import { FileText, Check, ArrowLeft, Send, Download, Printer, Calendar, DollarSign, Building2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Contract, Estimate, ScopeOfWork, Terms, QuestionnaireAnswers, CLIENT_TYPE_CONFIG } from './types';

interface ContractBuilderProps {
  clientAnswers?: QuestionnaireAnswers;
  estimate?: Estimate;
  scope?: ScopeOfWork;
  terms?: Terms;
  existingContract?: Contract;
  onSave: (contract: Contract) => void;
  onBack: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const generateContractNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const seq = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
  return `GIQ-${year}-${seq}`;
};

const ContractBuilder: React.FC<ContractBuilderProps> = ({
  clientAnswers,
  estimate,
  scope,
  terms,
  existingContract,
  onSave,
  onBack,
}) => {
  const [startDate, setStartDate] = useState(existingContract?.startDate || scope?.startDate || '');
  const [endDate, setEndDate] = useState(existingContract?.endDate || scope?.endDate || '');
  const [showPreview, setShowPreview] = useState(false);

  const contractNumber = existingContract?.contractNumber || generateContractNumber();
  const clientConfig = clientAnswers ? CLIENT_TYPE_CONFIG[clientAnswers.clientType] : null;

  const buildContract = (): Contract => ({
    id: existingContract?.id || generateId(),
    clientId: '',
    clientName: clientAnswers?.companyName || '',
    status: 'draft',
    estimateId: estimate?.id || '',
    scopeId: scope?.id || '',
    termsId: terms?.id || '',
    startDate,
    endDate,
    totalValue: estimate?.total || 0,
    createdAt: existingContract?.createdAt || new Date().toISOString(),
    contractNumber,
  });

  const handlePrint = () => window.print();

  if (showPreview) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Button variant="outline" onClick={() => setShowPreview(false)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Editor
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" /> Print
            </Button>
            <Button onClick={() => onSave(buildContract())} className="bg-lime hover:bg-lime-dark text-white">
              <Send className="h-4 w-4 mr-2" /> Finalize Contract
            </Button>
          </div>
        </div>

        {/* Contract Document */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden print:shadow-none print:border-none">
          {/* Header */}
          <div className="bg-gradient-to-r from-navy via-navy-light to-navy p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-lime rounded-full -translate-y-1/2 translate-x-1/2" />
            </div>
            <div className="relative z-10 text-center">
              <h1 className="text-3xl font-bold tracking-tight mb-1">SERVICE AGREEMENT</h1>
              <p className="text-white/60 text-sm uppercase tracking-widest">Access Control Solutions</p>
              <div className="mt-4 inline-block px-4 py-1.5 bg-white/10 rounded-full text-sm font-medium">
                Contract No: {contractNumber}
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">Service Provider</div>
                <h3 className="font-bold text-gray-900">GATE-IQ Access Control (Pty) Ltd</h3>
                <p className="text-sm text-gray-500 mt-1">Reg. No. 2024/123456/07</p>
                <p className="text-sm text-gray-500">Johannesburg, Gauteng, South Africa</p>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">Client</div>
                <h3 className="font-bold text-gray-900">{clientAnswers?.companyName || 'Client Company'}</h3>
                {clientConfig && (
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${clientConfig.color}`}>
                    {clientConfig.label}
                  </span>
                )}
                {clientAnswers && (
                  <>
                    <p className="text-sm text-gray-500 mt-1">{clientAnswers.contactName}</p>
                    <p className="text-sm text-gray-500">{clientAnswers.address}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Contract Details */}
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-white border border-gray-100">
                <Calendar className="h-5 w-5 text-navy mx-auto mb-1.5" />
                <div className="text-xs text-gray-400">Start Date</div>
                <div className="text-sm font-semibold mt-0.5">{startDate ? new Date(startDate).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }) : 'TBD'}</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white border border-gray-100">
                <Calendar className="h-5 w-5 text-navy mx-auto mb-1.5" />
                <div className="text-xs text-gray-400">End Date</div>
                <div className="text-sm font-semibold mt-0.5">{endDate ? new Date(endDate).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }) : 'TBD'}</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white border border-gray-100">
                <DollarSign className="h-5 w-5 text-navy mx-auto mb-1.5" />
                <div className="text-xs text-gray-400">Contract Value</div>
                <div className="text-sm font-semibold mt-0.5">R {(estimate?.total || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white border border-gray-100">
                <Building2 className="h-5 w-5 text-navy mx-auto mb-1.5" />
                <div className="text-xs text-gray-400">Sites</div>
                <div className="text-sm font-semibold mt-0.5">{clientAnswers?.numberOfSites || 1}</div>
              </div>
            </div>
          </div>

          {/* Estimate Summary */}
          {estimate && (
            <div className="px-8 py-6 border-b border-gray-100">
              <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-navy" /> Financial Summary
              </h3>
              <div className="space-y-2 max-w-md">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>R {estimate.subtotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                </div>
                {estimate.discount > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Discount</span>
                    <span>- R {estimate.discount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">VAT ({estimate.taxRate}%)</span>
                  <span>R {estimate.tax.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total Contract Value</span>
                  <span className="text-navy">R {estimate.total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          )}

          {/* Scope Summary */}
          {scope && (
            <div className="px-8 py-6 border-b border-gray-100">
              <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-navy" /> Scope of Work
              </h3>
              <p className="text-sm text-gray-600 mb-4">{scope.projectDescription}</p>
              <div className="space-y-3">
                {scope.items.filter((i) => i.included).map((item, index) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-navy/10 text-navy text-xs font-bold shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {item.deliverables.map((d, di) => (
                          <span key={di} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            <Check className="h-2.5 w-2.5 text-lime" /> {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {scope.exclusions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-500 mb-2">Exclusions</h4>
                  <ul className="text-xs text-gray-500 space-y-1">
                    {scope.exclusions.map((exc, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-red-400 mt-0.5">x</span> {exc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Terms & Conditions */}
          {terms && (
            <div className="px-8 py-6 border-b border-gray-100">
              <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-navy" /> Terms & Conditions
              </h3>
              <div className="space-y-4">
                {terms.sections.map((section) => (
                  <div key={section.id}>
                    <h4 className="text-sm font-bold text-gray-800 mb-1">{section.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{section.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signature Block */}
          <div className="px-8 py-8 border-b border-gray-100">
            <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-6 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-navy" /> Signatures
            </h3>
            <div className="grid grid-cols-2 gap-12">
              <div>
                <div className="text-xs uppercase tracking-widest text-gray-400 mb-4">For and on behalf of the Service Provider</div>
                <div className="border-b-2 border-gray-300 mb-2 h-16" />
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                  <div>
                    <div className="font-medium text-gray-700">Name</div>
                    <div className="border-b border-gray-200 mt-4" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Date</div>
                    <div className="border-b border-gray-200 mt-4" />
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-gray-400 mb-4">For and on behalf of the Client</div>
                <div className="border-b-2 border-gray-300 mb-2 h-16" />
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                  <div>
                    <div className="font-medium text-gray-700">Name</div>
                    <div className="border-b border-gray-200 mt-4" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Date</div>
                    <div className="border-b border-gray-200 mt-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-navy text-white/80 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white">GATE-IQ Access Control (Pty) Ltd</span>
                <span className="mx-2">|</span>
                <span>Reg. No. 2024/123456/07</span>
              </div>
              <div className="text-right">
                <span>info@gate-iq.co.za</span>
                <span className="mx-2">|</span>
                <span>+27 11 123 4567</span>
              </div>
            </div>
            <div className="mt-2 text-white/50 text-center">
              This document constitutes a legally binding agreement between the parties named herein.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Editor View
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Generate Contract</h2>
        <p className="text-sm text-gray-500">Review the contract details and finalize the agreement</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={<FileText className="h-5 w-5 text-blue-600" />}
          title="Estimate"
          value={estimate ? `R ${estimate.total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}` : 'Not created'}
          subtitle={estimate?.estimateNumber || ''}
          status={estimate ? 'complete' : 'missing'}
        />
        <SummaryCard
          icon={<Shield className="h-5 w-5 text-purple-600" />}
          title="Scope of Work"
          value={scope ? `${scope.items.filter((i) => i.included).length} phases` : 'Not created'}
          subtitle={scope?.projectName || ''}
          status={scope ? 'complete' : 'missing'}
        />
        <SummaryCard
          icon={<FileText className="h-5 w-5 text-amber-600" />}
          title="Terms & Conditions"
          value={terms ? `${terms.sections.length} sections` : 'Not created'}
          subtitle={terms?.name || ''}
          status={terms ? 'complete' : 'missing'}
        />
        <SummaryCard
          icon={<Building2 className="h-5 w-5 text-green-600" />}
          title="Client Profile"
          value={clientAnswers?.companyName || 'Not created'}
          subtitle={clientConfig?.label || ''}
          status={clientAnswers ? 'complete' : 'missing'}
        />
      </div>

      {/* Contract Details */}
      <div className="p-5 rounded-xl border border-gray-200 bg-white space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Contract Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Contract Number</Label>
            <Input value={contractNumber} readOnly className="h-10 bg-gray-50" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Contract Value</Label>
            <Input
              value={`R ${(estimate?.total || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`}
              readOnly
              className="h-10 bg-gray-50 font-semibold text-navy"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Start Date</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-10" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">End Date</Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-10" />
          </div>
        </div>
      </div>

      {/* Included Documents Checklist */}
      <div className="p-5 rounded-xl border border-gray-200 bg-white space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Contract Package Contents</h3>
        <div className="space-y-2">
          <ChecklistItem label="Client Profile & Questionnaire" checked={!!clientAnswers} />
          <ChecklistItem label={`Detailed Estimate (${estimate?.lineItems.length || 0} line items)`} checked={!!estimate} />
          <ChecklistItem label={`Scope of Work (${scope?.items.filter((i) => i.included).length || 0} phases)`} checked={!!scope} />
          <ChecklistItem label={`Terms & Conditions (${terms?.sections.length || 0} sections)`} checked={!!terms} />
          <ChecklistItem label="Signature Block" checked={true} />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <Button variant="outline" onClick={onBack}>Back to Terms</Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <FileText className="h-4 w-4 mr-2" /> Preview Contract
          </Button>
          <Button onClick={() => onSave(buildContract())} className="bg-lime hover:bg-lime-dark text-white">
            <Check className="h-4 w-4 mr-2" /> Finalize & Save
          </Button>
        </div>
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  status: 'complete' | 'missing';
}> = ({ icon, title, value, subtitle, status }) => (
  <div className={`p-4 rounded-xl border ${status === 'complete' ? 'border-gray-200 bg-white' : 'border-dashed border-gray-300 bg-gray-50'}`}>
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-xs font-semibold text-gray-500 uppercase">{title}</span>
      {status === 'complete' && (
        <Check className="h-3.5 w-3.5 text-lime ml-auto" />
      )}
    </div>
    <div className="text-sm font-bold text-gray-900 truncate">{value}</div>
    {subtitle && <div className="text-xs text-gray-400 truncate mt-0.5">{subtitle}</div>}
  </div>
);

const ChecklistItem: React.FC<{ label: string; checked: boolean }> = ({ label, checked }) => (
  <div className="flex items-center gap-3 py-1.5">
    <div className={`h-5 w-5 rounded-full flex items-center justify-center ${checked ? 'bg-lime/20' : 'bg-gray-100'}`}>
      {checked ? <Check className="h-3 w-3 text-lime-dark" /> : <div className="h-2 w-2 rounded-full bg-gray-300" />}
    </div>
    <span className={`text-sm ${checked ? 'text-gray-700' : 'text-gray-400'}`}>{label}</span>
  </div>
);

export default ContractBuilder;
