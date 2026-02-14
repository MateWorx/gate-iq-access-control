import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScopeOfWork, ScopeItem, QuestionnaireAnswers } from './types';

interface ScopeBuilderProps {
  clientAnswers?: QuestionnaireAnswers;
  existingScopeOfWork?: ScopeOfWork;
  onSave: (scope: ScopeOfWork) => void;
  onBack: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const buildDefaultScope = (answers?: QuestionnaireAnswers): ScopeItem[] => {
  const items: ScopeItem[] = [
    {
      id: generateId(),
      title: 'Project Planning & Site Assessment',
      description: 'Comprehensive assessment of all sites, infrastructure audit, and detailed project planning documentation.',
      deliverables: [
        'Site assessment report per location',
        'Infrastructure audit document',
        'Detailed project plan with milestones',
        'Risk assessment and mitigation strategy',
      ],
      timeline: '1 – 2 weeks',
      included: true,
    },
    {
      id: generateId(),
      title: 'Hardware Procurement & Delivery',
      description: 'Sourcing, procurement, and delivery of all access control hardware as per the approved estimate.',
      deliverables: [
        'Hardware procurement schedule',
        'Delivery confirmation and inventory check',
        'Hardware warranty documentation',
      ],
      timeline: '2 – 3 weeks',
      included: true,
    },
  ];

  if (answers) {
    if (answers.accessControlNeeds.length > 0) {
      items.push({
        id: generateId(),
        title: 'Access Control System Installation',
        description: `Installation of ${answers.accessControlNeeds.join(', ')} across ${answers.numberOfSites} site(s).`,
        deliverables: [
          'Physical installation of all hardware',
          'Cabling and network infrastructure setup',
          'Power supply and backup configuration',
          'Installation sign-off per site',
        ],
        timeline: `${answers.numberOfSites * 2} – ${answers.numberOfSites * 3} days`,
        included: true,
      });
    }

    items.push({
      id: generateId(),
      title: 'Software Configuration & Setup',
      description: 'Configuration of the GATE-IQ platform, user provisioning, access rules, and system policies.',
      deliverables: [
        'Platform instance setup and configuration',
        `User account provisioning (${answers.numberOfUsers} users)`,
        'Access level hierarchy configuration',
        'Alert and notification rules setup',
        'Dashboard and reporting configuration',
      ],
      timeline: '1 – 2 weeks',
      included: true,
    });

    if (answers.integrationRequirements.length > 0) {
      items.push({
        id: generateId(),
        title: 'System Integrations',
        description: `Integration with ${answers.integrationRequirements.length} third-party system(s): ${answers.integrationRequirements.join(', ')}.`,
        deliverables: answers.integrationRequirements.map((req) => `${req} integration setup and testing`),
        timeline: `${answers.integrationRequirements.length} – ${answers.integrationRequirements.length * 2} weeks`,
        included: true,
      });
    }
  }

  items.push(
    {
      id: generateId(),
      title: 'Testing & Quality Assurance',
      description: 'End-to-end system testing, user acceptance testing, and performance validation.',
      deliverables: [
        'System integration test results',
        'User acceptance testing (UAT) sessions',
        'Performance and stress test report',
        'Security audit and penetration test results',
        'Bug fix and optimization report',
      ],
      timeline: '1 – 2 weeks',
      included: true,
    },
    {
      id: generateId(),
      title: 'User Training & Handover',
      description: 'Comprehensive training for administrators, operators, and end users with full documentation.',
      deliverables: [
        'Administrator training (full day)',
        'Operator training (half day per site)',
        'End-user quick-start guides',
        'System administration manual',
        'Video training materials',
      ],
      timeline: '1 week',
      included: true,
    },
    {
      id: generateId(),
      title: 'Go-Live & Post-Launch Support',
      description: 'System launch support, monitoring, and 30-day hyper-care period with priority support.',
      deliverables: [
        'Go-live checklist and execution',
        '30-day hyper-care support',
        'Performance monitoring dashboard',
        'Transition to standard support plan',
      ],
      timeline: '1 day + 30-day support',
      included: true,
    }
  );

  return items;
};

const ScopeBuilder: React.FC<ScopeBuilderProps> = ({ clientAnswers, existingScopeOfWork, onSave, onBack }) => {
  const [projectName, setProjectName] = useState(
    existingScopeOfWork?.projectName || `${clientAnswers?.companyName || ''} Access Control Implementation`
  );
  const [projectDescription, setProjectDescription] = useState(
    existingScopeOfWork?.projectDescription ||
    'Full design, supply, installation, configuration, and commissioning of the GATE-IQ access control system.'
  );
  const [startDate, setStartDate] = useState(existingScopeOfWork?.startDate || '');
  const [endDate, setEndDate] = useState(existingScopeOfWork?.endDate || '');
  const [items, setItems] = useState<ScopeItem[]>(existingScopeOfWork?.items || buildDefaultScope(clientAnswers));
  const [exclusions, setExclusions] = useState<string[]>(
    existingScopeOfWork?.exclusions || [
      'Civil or structural building modifications',
      'Third-party software licensing fees not included in the estimate',
      'Internet connectivity and ISP costs',
      'Electrical supply upgrades or generator installation',
      'Security guard services',
    ]
  );
  const [assumptions, setAssumptions] = useState<string[]>(
    existingScopeOfWork?.assumptions || [
      'Client will provide stable power and network connectivity at all sites',
      'Access to all installation sites will be available during business hours',
      'Client will designate a project liaison for decision-making',
      'Existing infrastructure (walls, doors, gates) is in good condition',
      'Network infrastructure supports TCP/IP connectivity to all access points',
    ]
  );
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(items.map((i) => i.id)));

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const updateItem = (id: string, field: keyof ScopeItem, value: unknown) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const addDeliverable = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, deliverables: [...item.deliverables, ''] } : item
      )
    );
  };

  const updateDeliverable = (itemId: string, index: number, value: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, deliverables: item.deliverables.map((d, i) => (i === index ? value : d)) }
          : item
      )
    );
  };

  const removeDeliverable = (itemId: string, index: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, deliverables: item.deliverables.filter((_, i) => i !== index) }
          : item
      )
    );
  };

  const addScopeItem = () => {
    const newItem: ScopeItem = {
      id: generateId(),
      title: '',
      description: '',
      deliverables: [''],
      timeline: '',
      included: true,
    };
    setItems((prev) => [...prev, newItem]);
    setExpandedItems((prev) => new Set([...prev, newItem.id]));
  };

  const removeScopeItem = (id: string) => setItems((prev) => prev.filter((item) => item.id !== id));

  const addListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => setter((prev) => [...prev, '']);
  const updateListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) =>
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  const removeListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) =>
    setter((prev) => prev.filter((_, i) => i !== index));

  const buildScope = (): ScopeOfWork => ({
    id: existingScopeOfWork?.id || generateId(),
    clientId: '',
    projectName,
    projectDescription,
    startDate,
    endDate,
    items,
    exclusions: exclusions.filter(Boolean),
    assumptions: assumptions.filter(Boolean),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Scope of Work</h2>
        <p className="text-sm text-gray-500">Define the project deliverables, timeline, and boundaries</p>
      </div>

      {/* Project Details */}
      <div className="p-5 rounded-xl border border-gray-200 bg-white space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Project Name</Label>
          <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} className="h-11 text-base font-medium" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Project Description</Label>
          <Textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} rows={2} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Estimated Start Date</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-10" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Estimated End Date</Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-10" />
          </div>
        </div>
      </div>

      {/* Scope Items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Project Phases & Deliverables</h3>
          <span className="text-xs text-gray-400">{items.filter((i) => i.included).length} of {items.length} included</span>
        </div>

        {items.map((item, index) => (
          <div key={item.id} className={`rounded-xl border transition-all ${item.included ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
            {/* Item Header */}
            <div className="flex items-center gap-3 px-4 py-3">
              <button onClick={() => toggleExpand(item.id)} className="text-gray-400 hover:text-gray-600">
                {expandedItems.has(item.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-navy/10 text-navy text-xs font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <Input
                  value={item.title}
                  onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                  className="border-0 p-0 h-auto text-sm font-semibold focus-visible:ring-0 bg-transparent"
                  placeholder="Phase title..."
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 whitespace-nowrap">{item.timeline}</span>
                <Switch checked={item.included} onCheckedChange={(v) => updateItem(item.id, 'included', v)} />
                <Button variant="ghost" size="sm" onClick={() => removeScopeItem(item.id)} className="h-7 w-7 p-0 text-gray-300 hover:text-red-500">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedItems.has(item.id) && (
              <div className="px-4 pb-4 pt-1 space-y-3 border-t border-gray-100 ml-10">
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-400">Description</Label>
                  <Textarea
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    rows={2}
                    className="text-sm"
                    placeholder="Describe this phase..."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-400">Timeline</Label>
                  <Input
                    value={item.timeline}
                    onChange={(e) => updateItem(item.id, 'timeline', e.target.value)}
                    className="h-8 text-sm"
                    placeholder="e.g. 1 – 2 weeks"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-400">Deliverables</Label>
                  <div className="space-y-1.5">
                    {item.deliverables.map((del, di) => (
                      <div key={di} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-lime shrink-0" />
                        <Input
                          value={del}
                          onChange={(e) => updateDeliverable(item.id, di, e.target.value)}
                          className="h-8 text-sm flex-1"
                          placeholder="Deliverable description..."
                        />
                        <button onClick={() => removeDeliverable(item.id, di)} className="text-gray-300 hover:text-red-500">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" onClick={() => addDeliverable(item.id)} className="text-xs text-gray-400 h-7">
                      <Plus className="h-3 w-3 mr-1" /> Add Deliverable
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <Button variant="outline" size="sm" onClick={addScopeItem} className="w-full border-dashed">
          <Plus className="h-4 w-4 mr-2" /> Add Phase
        </Button>
      </div>

      {/* Exclusions */}
      <div className="p-5 rounded-xl border border-gray-200 bg-white space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Exclusions</h3>
        <p className="text-xs text-gray-400">Items explicitly not included in this scope</p>
        <div className="space-y-2">
          {exclusions.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <X className="h-3.5 w-3.5 text-red-400 shrink-0" />
              <Input
                value={item}
                onChange={(e) => updateListItem(setExclusions, i, e.target.value)}
                className="h-8 text-sm flex-1"
                placeholder="Exclusion..."
              />
              <button onClick={() => removeListItem(setExclusions, i)} className="text-gray-300 hover:text-red-500">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={() => addListItem(setExclusions)} className="text-xs text-gray-400 h-7">
            <Plus className="h-3 w-3 mr-1" /> Add Exclusion
          </Button>
        </div>
      </div>

      {/* Assumptions */}
      <div className="p-5 rounded-xl border border-gray-200 bg-white space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Assumptions</h3>
        <p className="text-xs text-gray-400">Conditions assumed to be true for this project</p>
        <div className="space-y-2">
          {assumptions.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
              <Input
                value={item}
                onChange={(e) => updateListItem(setAssumptions, i, e.target.value)}
                className="h-8 text-sm flex-1"
                placeholder="Assumption..."
              />
              <button onClick={() => removeListItem(setAssumptions, i)} className="text-gray-300 hover:text-red-500">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={() => addListItem(setAssumptions)} className="text-xs text-gray-400 h-7">
            <Plus className="h-3 w-3 mr-1" /> Add Assumption
          </Button>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <Button variant="outline" onClick={onBack}>Back to Estimate</Button>
        <Button onClick={() => onSave(buildScope())} className="bg-lime hover:bg-lime-dark text-white">
          <Check className="h-4 w-4 mr-2" /> Save & Continue to Terms
        </Button>
      </div>
    </div>
  );
};

export default ScopeBuilder;
