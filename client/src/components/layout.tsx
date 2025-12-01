import React from 'react';
import { Link, useLocation } from 'wouter';
import { useTraining } from '@/lib/store';
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Menu,
  Infinity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser, setCurrentUser, users } = useTraining();
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    setCurrentUser(null);
    setLocation('/login');
  };

  const handleSwitchUser = () => {
    if (!currentUser) return;
    // Only admins can switch users
    if (currentUser.role !== 'admin') return;
    const currentIndex = users.findIndex(u => u.id === currentUser.id);
    const nextIndex = (currentIndex + 1) % users.length;
    setCurrentUser(users[nextIndex]);
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          {/* Profile Picture Top-Left */}
          <div className="flex items-center gap-3">
            <img src={currentUser.avatar} alt={currentUser.name} className="h-10 w-10 rounded-full ring-2 ring-secondary/20" />
            <div className="flex flex-col">
              <p className="font-medium leading-none text-sm">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className={cn("transition-colors hover:text-secondary", location === '/' ? "text-secondary" : "text-muted-foreground")}>
              Training Modules
            </Link>
            {currentUser.role === 'admin' && (
              <Link href="/admin" className={cn("transition-colors hover:text-secondary", location === '/admin' ? "text-secondary" : "text-muted-foreground")}>
                Admin Panel
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {currentUser.role === 'admin' && (
              <Button variant="ghost" size="icon" onClick={handleSwitchUser} title="Switch User (Admin Only)">
                <Users className="h-4 w-4" />
              </Button>
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
      <main className="flex-1 container py-8 px-4 md:px-6">
        {children}
      </main>
    </div>
  );
}
