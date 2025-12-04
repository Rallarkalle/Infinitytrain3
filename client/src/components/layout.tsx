import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { useTraining, type User } from '@/lib/store';
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Menu,
  Infinity,
  Check,
  Upload,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { uploadProfilePicture, isSupabaseConfigured } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser, viewAsUser, setCurrentUser, setViewAsUser, users } = useTraining();
  const [location, setLocation] = useLocation();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleLogout = () => {
    setCurrentUser(null);
    setViewAsUser(null);
    setLocation('/login');
  };

  const handleViewAsUser = (user: User) => {
    if (currentUser?.role !== 'admin') return;
    setViewAsUser(user.id === currentUser.id ? null : user);
  };

  const handleAvatarClick = () => {
    // Only allow the actual logged-in user to upload, not when viewing as another user
    if (!viewAsUser && isSupabaseConfigured()) {
      setIsUploadDialogOpen(true);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPG, PNG, or WebP image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (500 KB)
    if (file.size > 512000) {
      toast({
        title: "File too large",
        description: "Please select an image under 500 KB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !currentUser) return;

    setIsUploading(true);
    try {
      // Upload to Supabase
      const publicUrl = await uploadProfilePicture(currentUser.id, selectedFile);
      
      if (!publicUrl) {
        throw new Error('Failed to get public URL');
      }

      // Update user in database
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: publicUrl })
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUser = await response.json();
      setCurrentUser(updatedUser);

      toast({
        title: "Success!",
        description: "Profile picture updated successfully.",
      });

      // Reset dialog
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload profile picture.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!currentUser) return null;
  
  const displayUser = viewAsUser || currentUser;

  return (
    <div className="min-h-screen bg-white font-sans text-foreground flex flex-col" style={{ 
      backgroundImage: 'url(/images/background.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b shadow-sm" style={{ background: 'linear-gradient(to right, #001f3f, #005A9E)' }}>
        <div className="w-full flex h-16 items-center justify-between px-4 md:px-6">
          {/* Left Side - Company Logo */}
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Company Logo" className="h-10 object-contain" />
          </div>

          {/* Center Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className={cn("transition-colors", location === '/' ? "text-white font-semibold" : "text-white/70 hover:text-[#7acc00]")}>
              Training Modules
            </Link>
            {currentUser.role === 'admin' && (
              <Link href="/admin" className={cn("transition-colors", location === '/admin' ? "text-white font-semibold" : "text-white/70 hover:text-[#7acc00]")}>
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Right Side - User Profile and Action Buttons */}
          <div className="flex items-center gap-2">
            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="relative group">
                <img 
                  src={displayUser.avatar} 
                  alt={displayUser.name} 
                  className={cn(
                    "h-10 w-10 rounded-full ring-2 ring-primary/20",
                    !viewAsUser && isSupabaseConfigured() && "cursor-pointer hover:ring-4 hover:ring-[#7acc00] transition-all"
                  )}
                  onClick={handleAvatarClick}
                />
                {!viewAsUser && isSupabaseConfigured() && (
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    onClick={handleAvatarClick}
                  >
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
              <div className="hidden sm:flex flex-col">
                <p className="font-medium leading-none text-sm text-white">
                  {displayUser.name}
                  {viewAsUser && <span className="text-xs text-white/80 ml-2">(viewing)</span>}
                </p>
                <p className="text-xs text-white/80 capitalize">{displayUser.role}</p>
              </div>
            </div>
            
            <div className="h-8 w-px bg-white/20 mx-1" />
            {currentUser.role === 'admin' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" title="View as User">
                    <Users className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>View as User</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {users.map(user => (
                    <DropdownMenuItem
                      key={user.id}
                      onClick={() => handleViewAsUser(user)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <img src={user.avatar} alt={user.name} className="h-6 w-6 rounded-full" />
                        <span>{user.name}</span>
                      </div>
                      {(viewAsUser?.id === user.id || (!viewAsUser && user.id === currentUser.id)) && (
                        <Check className="h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="h-4 w-4" />
            </Button>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link href="/" className="text-lg font-medium hover:text-secondary">
                      Training Modules
                    </Link>
                    {currentUser.role === 'admin' && (
                      <Link href="/admin" className="text-lg font-medium hover:text-secondary">
                        Admin Panel
                      </Link>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 md:px-6">
        {children}
      </main>

      {/* Profile Picture Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
            <DialogDescription>
              Upload a new profile picture (JPG, PNG, or WebP, max 500 KB)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-primary/20">
                  <Camera className="h-12 w-12 text-gray-400" />
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Select Image
              </Button>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsUploadDialogOpen(false);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="bg-[#006400] hover:bg-[#7acc00]"
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
