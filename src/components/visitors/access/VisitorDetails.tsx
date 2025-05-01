
import React from 'react';
import { Tag, Clock, Calendar } from 'lucide-react';
import { VisitorData } from '../types';

interface VisitorDetailsProps {
  visitor: VisitorData;
}

const VisitorDetails: React.FC<VisitorDetailsProps> = ({ visitor }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg text-gray-800 mb-4">{visitor.full_name}</h3>
      <div className="flex items-start">
        <Tag className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
        <div>
          <p className="text-sm text-gray-500 mb-1">Purpose</p>
          <p className="text-base">{visitor.visit_purpose || 'Not specified'}</p>
        </div>
      </div>
      
      <div className="flex items-start">
        <Clock className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
        <div>
          <p className="text-sm text-gray-500 mb-1">Status</p>
          <p className={`text-base font-medium ${
            visitor.status === 'Active' ? 'text-green-600' : 
            visitor.status === 'Pending' ? 'text-amber-600' : 
            'text-gray-600'
          }`}>
            {visitor.status}
          </p>
        </div>
      </div>
      
      <div className="flex items-start">
        <Calendar className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
        <div>
          <p className="text-sm text-gray-500 mb-1">Expected Arrival</p>
          <p className="text-base">
            {visitor.expected_arrival 
              ? new Date(visitor.expected_arrival).toLocaleString() 
              : 'Not specified'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisitorDetails;
