import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useTraining } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Infinity, Mail, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { setCurrentUser } = useTraining();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });

      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
        setLocation('/');
      } else {
        const data = await response.json();
        setError(data.error || 'Login failed. Please check your email address.');
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@oceaninfinity.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="text-sm text-muted-foreground text-center pt-4">
              <p>Contact your administrator for access</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
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
