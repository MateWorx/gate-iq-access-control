import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronRight, Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Terms, TermsSection, DEFAULT_TERMS_SECTIONS } from './types';

interface TermsEditorProps {
  existingTerms?: Terms;
  onSave: (terms: Terms) => void;
  onBack: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const TermsEditor: React.FC<TermsEditorProps> = ({ existingTerms, onSave, onBack }) => {
  const [name, setName] = useState(existingTerms?.name || 'Standard Terms & Conditions');
  const [sections, setSections] = useState<TermsSection[]>(existingTerms?.sections || DEFAULT_TERMS_SECTIONS);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpandedSections(new Set(sections.map((s) => s.id)));
  const collapseAll = () => setExpandedSections(new Set());

  const updateSection = (id: string, field: keyof TermsSection, value: string | number) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const addSection = () => {
    const newSection: TermsSection = {
      id: generateId(),
      title: `${sections.length + 1}. New Section`,
      content: '',
      order: sections.length + 1,
    };
    setSections((prev) => [...prev, newSection]);
    setExpandedSections((prev) => new Set([...prev, newSection.id]));
  };

  const removeSection = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i + 1 })));
  };

  const resetToDefaults = () => {
    setSections(DEFAULT_TERMS_SECTIONS);
    setExpandedSections(new Set());
  };

  const buildTerms = (): Terms => ({
    id: existingTerms?.id || generateId(),
    name,
    sections,
    lastUpdated: new Date().toISOString(),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Terms & Conditions</h2>
          <p className="text-sm text-gray-500">Review and customize the terms that will be included in the contract</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={resetToDefaults}>
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Reset to Defaults
          </Button>
        </div>
      </div>

      {/* Template Name */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Terms Template Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} className="h-10 max-w-md" />
      </div>

      {/* Expand/Collapse Controls */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={expandAll} className="text-xs text-gray-500 h-7">
          Expand All
        </Button>
        <span className="text-gray-300">|</span>
        <Button variant="ghost" size="sm" onClick={collapseAll} className="text-xs text-gray-500 h-7">
          Collapse All
        </Button>
        <span className="text-xs text-gray-400 ml-auto">{sections.length} sections</span>
      </div>

      {/* Sections */}
      <div className="space-y-2">
        {sections.map((section) => (
          <div key={section.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            {/* Section Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleExpand(section.id)}
            >
              {expandedSections.has(section.id) ? (
                <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
              )}
              <span className="flex-1 text-sm font-medium text-gray-800">{section.title}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSection(section.id);
                }}
                className="h-7 w-7 p-0 text-gray-300 hover:text-red-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Section Content */}
            {expandedSections.has(section.id) && (
              <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
                <div className="space-y-1.5 pt-3">
                  <Label className="text-xs text-gray-400">Section Title</Label>
                  <Input
                    value={section.title}
                    onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                    className="h-9 text-sm font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-400">Content</Label>
                  <Textarea
                    value={section.content}
                    onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                    rows={5}
                    className="text-sm leading-relaxed"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" onClick={addSection} className="w-full border-dashed">
        <Plus className="h-4 w-4 mr-2" /> Add Section
      </Button>

      {/* Preview */}
      <div className="p-6 rounded-xl border border-gray-200 bg-white">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Document Preview</h3>
        <div className="prose prose-sm max-w-none">
          <h2 className="text-lg font-bold text-navy mb-1">{name}</h2>
          <p className="text-xs text-gray-400 mb-6">Last updated: {new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          {sections.map((section) => (
            <div key={section.id} className="mb-4">
              <h4 className="text-sm font-bold text-gray-800 mb-1">{section.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{section.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <Button variant="outline" onClick={onBack}>Back to Scope</Button>
        <Button onClick={() => onSave(buildTerms())} className="bg-lime hover:bg-lime-dark text-white">
          <Check className="h-4 w-4 mr-2" /> Save & Continue to Contract
        </Button>
      </div>
    </div>
  );
};

export default TermsEditor;
