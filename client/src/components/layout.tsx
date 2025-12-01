import React from 'react';
import { Link, useLocation } from 'wouter';
import { useTraining, type User } from '@/lib/store';
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Menu,
  Infinity,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser, viewAsUser, setCurrentUser, setViewAsUser, users } = useTraining();
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    setCurrentUser(null);
    setViewAsUser(null);
    setLocation('/login');
  };

  const handleViewAsUser = (user: User) => {
    if (currentUser?.role !== 'admin') return;
    setViewAsUser(user.id === currentUser.id ? null : user);
  };

  if (!currentUser) return null;
  
  const displayUser = viewAsUser || currentUser;

  return (
    <div className="min-h-screen bg-white font-sans text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b shadow-sm" style={{ background: 'linear-gradient(to right, #004E8C, #0078D4)' }}>
        <div className="w-full flex h-16 items-center justify-between px-4 md:px-6">
          {/* Profile Picture Top-Left */}
          <div className="flex items-center gap-3">
            <img src={displayUser.avatar} alt={displayUser.name} className="h-10 w-10 rounded-full ring-2 ring-primary/20" />
            <div className="flex flex-col">
              <p className="font-medium leading-none text-sm text-white">
                {displayUser.name}
                {viewAsUser && <span className="text-xs text-white/80 ml-2">(viewing)</span>}
              </p>
              <p className="text-xs text-white/80 capitalize">{displayUser.role}</p>
            </div>
          </div>

          {/* Center Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className={cn("transition-colors hover:text-white/80", location === '/' ? "text-white font-semibold" : "text-white/70")}>
              Training Modules
            </Link>
            {currentUser.role === 'admin' && (
              <Link href="/admin" className={cn("transition-colors hover:text-white/80", location === '/admin' ? "text-white font-semibold" : "text-white/70")}>
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-2">
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
    </div>
  );
}
