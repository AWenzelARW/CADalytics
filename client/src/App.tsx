import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router, Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { HomePage } from '@/pages/HomePage';
import { ChatPage } from '@/pages/ChatPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/chat" component={ChatPage} />
            <Route>
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
                  <p className="text-muted-foreground">
                    The page you're looking for doesn't exist.
                  </p>
                </div>
              </div>
            </Route>
          </Switch>
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;