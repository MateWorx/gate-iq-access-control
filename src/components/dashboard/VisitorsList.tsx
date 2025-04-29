
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data for visitor list
const mockVisitors = [
  { 
    id: '1', 
    name: 'Jane Smith', 
    purpose: 'Social Visit', 
    checkIn: '2023-10-15 14:30', 
    status: 'active',
    checkOut: null
  },
  { 
    id: '2', 
    name: 'John Doe', 
    purpose: 'Delivery', 
    checkIn: '2023-10-15 10:15', 
    status: 'active',
    checkOut: null
  },
  { 
    id: '3', 
    name: 'Michael Brown', 
    purpose: 'Contractor', 
    checkIn: '2023-10-14 09:00', 
    status: 'inactive',
    checkOut: '2023-10-14 17:30'
  },
  { 
    id: '4', 
    name: 'Sarah Wilson', 
    purpose: 'Meeting', 
    checkIn: null, 
    status: 'pending',
    checkOut: null
  },
  { 
    id: '5', 
    name: 'Robert Davis', 
    purpose: 'Social Visit', 
    checkIn: '2023-10-13 13:45', 
    status: 'inactive',
    checkOut: '2023-10-13 18:20'
  },
];

interface VisitorsListProps {
  showActions?: boolean;
}

const VisitorsList: React.FC<VisitorsListProps> = ({ showActions = true }) => {
  const renderStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge variant="outline" className="status-active">Active</Badge>;
      case 'pending':
        return <Badge variant="outline" className="status-pending">Pending</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="status-inactive">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Visitor Name</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Status</TableHead>
            {showActions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockVisitors.map((visitor) => (
            <TableRow key={visitor.id}>
              <TableCell className="font-medium">{visitor.name}</TableCell>
              <TableCell>{visitor.purpose}</TableCell>
              <TableCell>{visitor.checkIn || '—'}</TableCell>
              <TableCell>{visitor.checkOut || '—'}</TableCell>
              <TableCell>{renderStatusBadge(visitor.status)}</TableCell>
              {showActions && (
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm">View</Button>
                  {visitor.status === 'pending' && (
                    <Button 
                      size="sm" 
                      className="bg-lime hover:bg-lime-dark text-white"
                    >
                      Send Code
                    </Button>
                  )}
                  {visitor.status === 'active' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      Revoke
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VisitorsList;
