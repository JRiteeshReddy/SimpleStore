
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function AccountProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Form state
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  
  // Handle profile update
  const handleUpdateProfile = () => {
    // In a real app, we would update the user profile in the database
    // For now, just show a success toast
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated",
    });
  };
  
  // Handle password change
  const handleChangePassword = () => {
    // In a real app, we would send a password reset email
    // For now, just show a success toast
    toast({
      title: "Password reset email sent",
      description: "Check your email for instructions to reset your password",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Default Address</Label>
            <Input
              id="address"
              placeholder="Your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpdateProfile}>
            Update Profile
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Change your password by clicking the button below. We'll send a password reset link to your email address.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={handleChangePassword}>
            Change Password
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
