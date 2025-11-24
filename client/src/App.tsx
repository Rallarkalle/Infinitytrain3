import { Switch, Route } from "wouter";
import { TrainingProvider } from "@/lib/store";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Home from "@/pages/home";
import TopicView from "@/pages/topic";
import AdminDashboard from "@/pages/admin";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={Home} />
      <Route path="/topic/:id" component={TopicView} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TrainingProvider>
      <Toaster />
      <Router />
    </TrainingProvider>
  );
}

export default App;
