
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Package, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <Account />
    </ProtectedRoute>
  );
}

function Account() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const currentTab = location.pathname.includes('orders') ? 'orders' : 'profile';
  
  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <Avatar className="w-20 h-20 mb-4">
                <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
              </Avatar>
              
              <h2 className="font-medium text-lg">{user?.email}</h2>
              
              <Button 
                variant="ghost" 
                className="text-muted-foreground mt-2" 
                onClick={() => signOut()}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
          
          <Tabs 
            value={currentTab} 
            className="flex flex-col"
            orientation="vertical"
          >
            <TabsList className="flex flex-col items-stretch h-auto bg-transparent space-y-1">
              <TabsTrigger 
                value="profile" 
                className="justify-start" 
                asChild
              >
                <Link to="/account">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="justify-start" 
                asChild
              >
                <Link to="/account/orders">
                  <Package className="w-4 h-4 mr-2" />
                  Order History
                </Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Content */}
        <div className="min-h-[300px]">
          <Outlet />
        </div>
      </div>
    </Layout>
  );
}
