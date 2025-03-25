
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from state, or default to home
  const from = location.state?.from?.pathname || '/';

  const handleAuth = async (type: 'signin' | 'signup') => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = type === 'signin' 
        ? await signIn(email, password) 
        : await signUp(email, password);
      
      if (error) {
        setError(error.message);
      } else {
        // Redirect to the page they were trying to access, or home
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Auth error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout className="flex items-center justify-center py-16">
      <div className="w-full max-w-md px-4 sm:px-0 animate-fade-in">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <Card className="shadow-lg border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && (
                  <div className="text-destructive text-sm">{error}</div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleAuth('signin')} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card className="shadow-lg border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">Create an account</CardTitle>
                <CardDescription>
                  Enter your details to create a new account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && (
                  <div className="text-destructive text-sm">{error}</div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleAuth('signup')} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating account...' : 'Sign Up'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
