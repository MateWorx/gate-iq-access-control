import React, { useState } from 'react';
import { Plus, Trash2, Save, Eye, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Estimate, EstimateLineItem, QuestionnaireAnswers } from './types';

interface EstimateBuilderProps {
  clientAnswers?: QuestionnaireAnswers;
  existingEstimate?: Estimate;
  onSave: (estimate: Estimate) => void;
  onPreview: (estimate: Estimate) => void;
  onBack: () => void;
}

const CATEGORY_OPTIONS = [
  'Hardware',
  'Software Licenses',
  'Installation',
  'Configuration',
  'Training',
  'Maintenance',
  'Support',
  'Cabling & Infrastructure',
  'Integration',
  'Project Management',
  'Consulting',
];

const generateId = () => Math.random().toString(36).substr(2, 9);

const generateEstimateNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
  return `EST-${year}${month}-${seq}`;
};

const buildDefaultLineItems = (answers?: QuestionnaireAnswers): EstimateLineItem[] => {
  if (!answers) return [createEmptyItem()];

  const items: EstimateLineItem[] = [];

  if (answers.accessControlNeeds.includes('Biometric Access (Fingerprint/Face)')) {
    items.push({ id: generateId(), category: 'Hardware', description: 'Biometric Reader Unit (Fingerprint + Facial Recognition)', quantity: answers.numberOfSites * 2, unitPrice: 8500, total: answers.numberOfSites * 2 * 8500 });
  }
  if (answers.accessControlNeeds.includes('RFID Card Access')) {
    items.push({ id: generateId(), category: 'Hardware', description: 'RFID Card Reader with Controller', quantity: answers.numberOfSites * 3, unitPrice: 3200, total: answers.numberOfSites * 3 * 3200 });
    items.push({ id: generateId(), category: 'Hardware', description: 'RFID Access Cards (pack of 100)', quantity: Math.ceil(answers.numberOfUsers / 100), unitPrice: 2500, total: Math.ceil(answers.numberOfUsers / 100) * 2500 });
  }
  if (answers.accessControlNeeds.includes('QR Code / Barcode Scanning')) {
    items.push({ id: generateId(), category: 'Hardware', description: 'QR/Barcode Scanner Terminal', quantity: answers.numberOfSites * 2, unitPrice: 4500, total: answers.numberOfSites * 2 * 4500 });
  }
  if (answers.accessControlNeeds.includes('Vehicle ANPR (Number Plate Recognition)')) {
    items.push({ id: generateId(), category: 'Hardware', description: 'ANPR Camera System (per entrance)', quantity: answers.numberOfSites, unitPrice: 35000, total: answers.numberOfSites * 35000 });
  }
  if (answers.accessControlNeeds.includes('Boom Gate Control')) {
    items.push({ id: generateId(), category: 'Hardware', description: 'Automated Boom Gate with Motor', quantity: answers.numberOfSites, unitPrice: 22000, total: answers.numberOfSites * 22000 });
  }
  if (answers.accessControlNeeds.includes('Turnstile Integration')) {
    items.push({ id: generateId(), category: 'Hardware', description: 'Full-Height Security Turnstile', quantity: answers.numberOfSites, unitPrice: 45000, total: answers.numberOfSites * 45000 });
  }

  // Software
  items.push({ id: generateId(), category: 'Software Licenses', description: 'GATE-IQ Platform License (per site/year)', quantity: answers.numberOfSites, unitPrice: 12000, total: answers.numberOfSites * 12000 });
  if (answers.accessControlNeeds.includes('Mobile App Access')) {
    items.push({ id: generateId(), category: 'Software Licenses', description: 'Mobile App Module License', quantity: 1, unitPrice: 15000, total: 15000 });
  }
  if (answers.accessControlNeeds.includes('Visitor Pre-Registration')) {
    items.push({ id: generateId(), category: 'Software Licenses', description: 'Visitor Management Module', quantity: 1, unitPrice: 8500, total: 8500 });
  }

  // Services
  items.push({ id: generateId(), category: 'Installation', description: 'Professional On-Site Installation (per site)', quantity: answers.numberOfSites, unitPrice: 7500, total: answers.numberOfSites * 7500 });
  items.push({ id: generateId(), category: 'Configuration', description: 'System Configuration & Testing', quantity: answers.numberOfSites, unitPrice: 5000, total: answers.numberOfSites * 5000 });
  items.push({ id: generateId(), category: 'Training', description: 'User Training Session (half day)', quantity: answers.numberOfSites, unitPrice: 3500, total: answers.numberOfSites * 3500 });
  items.push({ id: generateId(), category: 'Project Management', description: 'Project Management & Coordination', quantity: 1, unitPrice: 12000, total: 12000 });

  // Integrations
  if (answers.integrationRequirements.length > 0) {
    items.push({ id: generateId(), category: 'Integration', description: `System Integration (${answers.integrationRequirements.length} systems)`, quantity: answers.integrationRequirements.length, unitPrice: 8000, total: answers.integrationRequirements.length * 8000 });
  }

  // Cabling
  items.push({ id: generateId(), category: 'Cabling & Infrastructure', description: 'Network Cabling & Infrastructure (per site)', quantity: answers.numberOfSites, unitPrice: 6500, total: answers.numberOfSites * 6500 });

  // Maintenance
  items.push({ id: generateId(), category: 'Maintenance', description: 'Annual Maintenance Contract (per site)', quantity: answers.numberOfSites, unitPrice: 4800, total: answers.numberOfSites * 4800 });

  return items.length > 0 ? items : [createEmptyItem()];
};

const createEmptyItem = (): EstimateLineItem => ({
  id: generateId(),
  category: 'Hardware',
  description: '',
  quantity: 1,
  unitPrice: 0,
  total: 0,
});

const EstimateBuilder: React.FC<EstimateBuilderProps> = ({ clientAnswers, existingEstimate, onSave, onPreview, onBack }) => {
  const [lineItems, setLineItems] = useState<EstimateLineItem[]>(
    existingEstimate?.lineItems || buildDefaultLineItems(clientAnswers)
  );
  const [taxRate, setTaxRate] = useState(existingEstimate?.taxRate ?? 15);
  const [discount, setDiscount] = useState(existingEstimate?.discount ?? 0);
  const [notes, setNotes] = useState(existingEstimate?.notes ?? '');
  const [validDays, setValidDays] = useState(30);

  const updateLineItem = (id: string, field: keyof EstimateLineItem, value: string | number) => {
    setLineItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = Number(updated.quantity) * Number(updated.unitPrice);
        }
        return updated;
      })
    );
  };

  const addLineItem = () => setLineItems((prev) => [...prev, createEmptyItem()]);

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;

  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + validDays);

  const buildEstimate = (): Estimate => ({
    id: existingEstimate?.id || generateId(),
    clientId: '',
    clientName: clientAnswers?.companyName || '',
    status: 'draft',
    lineItems,
    subtotal,
    tax: taxAmount,
    taxRate,
    discount: discountAmount,
    total,
    validUntil: validUntil.toISOString().split('T')[0],
    createdAt: existingEstimate?.createdAt || new Date().toISOString().split('T')[0],
    notes,
    estimateNumber: existingEstimate?.estimateNumber || generateEstimateNumber(),
  });

  // Group items by category for display
  const groupedItems = lineItems.reduce<Record<string, EstimateLineItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Estimate Builder</h2>
          <p className="text-sm text-gray-500">
            {clientAnswers ? `For ${clientAnswers.companyName}` : 'Create a new estimate'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => onPreview(buildEstimate())}>
            <Eye className="h-4 w-4 mr-2" /> Preview
          </Button>
          <Button onClick={() => onSave(buildEstimate())} className="bg-navy hover:bg-navy-light text-white">
            <Save className="h-4 w-4 mr-2" /> Save Draft
          </Button>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-2">Category</div>
            <div className="col-span-4">Description</div>
            <div className="col-span-1 text-center">Qty</div>
            <div className="col-span-2 text-right">Unit Price</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-1"></div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {lineItems.map((item) => (
            <div key={item.id} className="px-4 py-3 hover:bg-gray-50/50 transition-colors">
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-2">
                  <Select value={item.category} onValueChange={(v) => updateLineItem(item.id, 'category', v)}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-4">
                  <Input
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                    placeholder="Item description"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value))}
                    className="h-9 text-sm text-center"
                    min={1}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(item.id, 'unitPrice', Number(e.target.value))}
                    className="h-9 text-sm text-right"
                    min={0}
                  />
                </div>
                <div className="col-span-2 text-right font-medium text-sm">
                  R {item.total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </div>
                <div className="col-span-1 flex justify-center">
                  <Button variant="ghost" size="sm" onClick={() => removeLineItem(item.id)} className="h-8 w-8 p-0 text-gray-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50/50">
          <Button variant="outline" size="sm" onClick={addLineItem} className="w-full border-dashed">
            <Plus className="h-4 w-4 mr-2" /> Add Line Item
          </Button>
        </div>
      </div>

      {/* Totals Section */}
      <div className="flex justify-end">
        <div className="w-full max-w-sm space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium">R {subtotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex items-center justify-between text-sm gap-4">
            <span className="text-gray-500">Discount (%)</span>
            <Input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="h-8 w-20 text-sm text-right" min={0} max={100} />
          </div>
          {discount > 0 && (
            <div className="flex items-center justify-between text-sm text-red-600">
              <span>Discount Amount</span>
              <span>- R {discountAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm gap-4">
            <span className="text-gray-500">VAT (%)</span>
            <Input type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className="h-8 w-20 text-sm text-right" min={0} max={100} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">VAT Amount</span>
            <span>R {taxAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
            <span className="text-base font-bold text-gray-900">Total</span>
            <span className="text-xl font-bold text-navy">R {total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Additional Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Valid For (days)</Label>
          <Select value={String(validDays)} onValueChange={(v) => setValidDays(Number(v))}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="14">14 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="60">60 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Estimate Notes</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes for the client..."
            rows={3}
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => onPreview(buildEstimate())}>
            <Eye className="h-4 w-4 mr-2" /> Preview Estimate
          </Button>
          <Button onClick={() => onSave(buildEstimate())} className="bg-lime hover:bg-lime-dark text-white">
            <Send className="h-4 w-4 mr-2" /> Save & Continue to Scope
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EstimateBuilder;
