
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const VisitorRegistrationForm: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [purpose, setPurpose] = useState('');
  const [vehicleReg, setVehicleReg] = useState('');
  const [date, setDate] = useState<Date>();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', {
      fullName,
      idNumber,
      purpose,
      vehicleReg,
      date: date ? format(date, 'yyyy-MM-dd') : undefined
    });
    // Reset form or show confirmation
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Register a Visitor</CardTitle>
        <CardDescription>
          Pre-register a visitor for quicker check-in process at the gate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                placeholder="Enter visitor's full name" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="idNumber">ID Number (Optional)</Label>
              <Input 
                id="idNumber" 
                placeholder="Enter ID number if known"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="purpose">Visit Purpose</Label>
              <Select onValueChange={setPurpose} value={purpose}>
                <SelectTrigger id="purpose">
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="social">Social Visit</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="contractor">Contractor</SelectItem>
                  <SelectItem value="service">Service Provider</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vehicleReg">Vehicle Registration (Optional)</Label>
              <Input 
                id="vehicleReg" 
                placeholder="Enter vehicle registration"
                value={vehicleReg}
                onChange={(e) => setVehicleReg(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Visit Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-2">Additional Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="multiDay" />
                <Label htmlFor="multiDay" className="cursor-pointer">Multi-day access</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="recurring" />
                <Label htmlFor="recurring" className="cursor-pointer">Recurring visit</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="notification" />
                <Label htmlFor="notification" className="cursor-pointer">Notify me on arrival</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="preApproved" />
                <Label htmlFor="preApproved" className="cursor-pointer">Auto-approve entry</Label>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button 
          onClick={handleSubmit}
          className="bg-lime hover:bg-lime-dark text-white"
        >
          Register Visitor
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VisitorRegistrationForm;
