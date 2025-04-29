
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { LogIn, LogOut } from 'lucide-react';

interface ScanDirectionSelectorProps {
  direction: 'ingress' | 'egress';
  onDirectionChange: (value: 'ingress' | 'egress') => void;
}

const ScanDirectionSelector: React.FC<ScanDirectionSelectorProps> = ({ 
  direction, 
  onDirectionChange 
}) => {
  return (
    <div className="mt-6 mb-4">
      <RadioGroup 
        defaultValue={direction}
        className="flex items-center space-x-6" 
        onValueChange={(val) => onDirectionChange(val as 'ingress' | 'egress')}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="ingress" id="ingress" className="border-green-500 text-green-500" />
          <Label htmlFor="ingress" className="flex items-center">
            <LogIn className="h-4 w-4 mr-2 text-green-500" />
            <span className="text-green-700">Ingress (In)</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="egress" id="egress" className="border-red-500 text-red-500" />
          <Label htmlFor="egress" className="flex items-center">
            <LogOut className="h-4 w-4 mr-2 text-red-500" />
            <span className="text-red-700">Egress (Out)</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ScanDirectionSelector;
