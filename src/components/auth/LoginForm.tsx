
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
  SelectValue 
} from '@/components/ui/select';
import Logo from '../layout/Logo';

interface LoginFormProps {
  onLogin?: (userType: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [userType, setUserType] = useState('resident');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { userType, username, password });
    if (onLogin) {
      onLogin(userType);
    }
  };
  
  return (
    <Card className="max-w-md w-full">
      <CardHeader className="space-y-4 flex flex-col items-center">
        <Logo size="lg" />
        <CardTitle className="text-2xl font-bold text-center">Welcome to GATE-IQ</CardTitle>
        <CardDescription className="text-center">
          Smart Access. Safe Communities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="userType">Login As</Label>
            <Select 
              value={userType} 
              onValueChange={(value) => setUserType(value)}
            >
              <SelectTrigger id="userType">
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resident">Resident</SelectItem>
                <SelectItem value="security">Security Officer</SelectItem>
                <SelectItem value="admin">Estate Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username / Email</Label>
            <Input 
              id="username" 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username or email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required 
            />
          </div>
          
          <Button type="submit" className="w-full bg-navy hover:bg-navy-light">
            Sign In
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <p className="text-sm text-gray-500 mt-4">
          Forgot your password? <a href="#" className="text-lime hover:underline">Reset it here</a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
