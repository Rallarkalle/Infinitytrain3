import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useTraining } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Infinity, Mail, Lock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { setCurrentUser, users } = useTraining();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [showUploadAvatar, setShowUploadAvatar] = useState(false);

  const funnyAvatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Dustin',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Miranda',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      setLocation('/');
    } else {
      alert('User not found. Try: admin@oceaninfinity.com, sarah@oceaninfinity.com, or john@oceaninfinity.com');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAvatar && !showUploadAvatar) {
      alert('Please select or upload an avatar');
      return;
    }
    if (!signupName || !signupEmail || !signupPhone) {
      alert('Please fill in all fields');
      return;
    }
    // In a real app, this would call the backend to create the account
    // For now, show a success message
    alert('Signup request submitted! Admin approval required.\n\nNote: This requires backend implementation for actual account creation and admin approval workflow.');
    setSignupName('');
    setSignupEmail('');
    setSignupPassword('');
    setSignupPhone('');
    setSelectedAvatar('');
    setShowUploadAvatar(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Infinity className="h-8 w-8 text-secondary animate-pulse-slow" />
            <h1 className="text-3xl font-bold text-primary">Ocean Training</h1>
          </div>
          <CardDescription>Collaborative Employee Training Platform</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* LOGIN TAB */}
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
                  Sign In
                </Button>

                <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
                  <p className="font-semibold mb-2">Demo Accounts:</p>
                  <p>📧 admin@oceaninfinity.com</p>
                  <p>👤 sarah@oceaninfinity.com</p>
                  <p>👤 john@oceaninfinity.com</p>
                </div>
              </form>
            </TabsContent>

            {/* SIGNUP TAB */}
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    placeholder="John Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email Address</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Phone Number</Label>
                  <Input
                    id="signup-phone"
                    placeholder="+1 (555) 000-0000"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                </div>

                {/* Avatar Selection */}
                <div className="space-y-3">
                  <Label>Choose Your Avatar</Label>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {funnyAvatars.map((avatar, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedAvatar(avatar);
                          setShowUploadAvatar(false);
                        }}
                        className={`w-full aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedAvatar === avatar ? 'border-primary ring-2 ring-primary' : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <img src={avatar} alt={`Avatar ${idx + 1}`} className="w-full h-full" />
                      </button>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowUploadAvatar(!showUploadAvatar)}
                  >
                    {showUploadAvatar ? 'Cancel' : 'Upload Your Own Photo'}
                  </Button>

                  {showUploadAvatar && (
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setSelectedAvatar(event.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  )}
                </div>

                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
                  Create Account
                </Button>

                <p className="text-xs text-gray-600 text-center">
                  After signup, your account requires admin approval before access.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
