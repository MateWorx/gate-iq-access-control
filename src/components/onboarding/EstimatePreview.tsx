import React from 'react';
import { ArrowLeft, Download, Send, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Estimate } from './types';

interface EstimatePreviewProps {
  estimate: Estimate;
  onBack: () => void;
  onSend?: () => void;
}

const EstimatePreview: React.FC<EstimatePreviewProps> = ({ estimate, onBack, onSend }) => {
  // Group line items by category
  const grouped = estimate.lineItems.reduce<Record<string, typeof estimate.lineItems>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const handlePrint = () => window.print();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Actions Bar (hidden on print) */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Editor
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" /> Print
          </Button>
          {onSend && (
            <Button onClick={onSend} className="bg-lime hover:bg-lime-dark text-white">
              <Send className="h-4 w-4 mr-2" /> Send to Client
            </Button>
          )}
        </div>
      </div>

      {/* Estimate Document */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden print:shadow-none print:border-none">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-navy via-navy-light to-navy p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-lime rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-lime rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">GATE-IQ</h1>
                <p className="text-white/70 text-sm mt-1">Access Control Solutions</p>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-widest text-white/60 mb-1">Estimate</div>
                <div className="text-xl font-bold">{estimate.estimateNumber}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Client & Estimate Info */}
        <div className="px-8 py-6 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">Prepared For</div>
              <h3 className="text-lg font-bold text-gray-900">{estimate.clientName || 'Client Name'}</h3>
            </div>
            <div className="text-right">
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-gray-400">Date</span>
                <span className="font-medium">{new Date(estimate.createdAt).toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                <span className="text-gray-400">Valid Until</span>
                <span className="font-medium">{new Date(estimate.validUntil).toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                <span className="text-gray-400">Status</span>
                <span>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    estimate.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                    estimate.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                    estimate.status === 'accepted' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Line Items by Category */}
        <div className="px-8 py-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-6 last:mb-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-navy" />
                <h4 className="text-sm font-bold text-navy uppercase tracking-wider">{category}</h4>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <th className="text-left pb-2 font-medium">Description</th>
                    <th className="text-center pb-2 font-medium w-20">Qty</th>
                    <th className="text-right pb-2 font-medium w-32">Unit Price</th>
                    <th className="text-right pb-2 font-medium w-32">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-3 text-sm text-gray-700">{item.description}</td>
                      <td className="py-3 text-sm text-center text-gray-600">{item.quantity}</td>
                      <td className="py-3 text-sm text-right text-gray-600">R {item.unitPrice.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 text-sm text-right font-medium text-gray-900">R {item.total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100">
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">R {estimate.subtotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
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
              <div className="border-t border-gray-300 pt-3 mt-3 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-navy">R {estimate.total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {estimate.notes && (
          <div className="px-8 py-6 border-t border-gray-100">
            <h4 className="text-sm font-bold text-gray-700 mb-2">Notes</h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{estimate.notes}</p>
          </div>
        )}

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
            This estimate is valid for 30 days from the date of issue. Prices are quoted in South African Rand (ZAR) and are exclusive of VAT unless otherwise stated.
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimatePreview;
