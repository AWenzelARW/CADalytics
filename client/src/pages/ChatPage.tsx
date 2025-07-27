import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Home } from 'lucide-react';
import { useLocation } from 'wouter';
import { Message } from '../../../shared/schema';

export function ChatPage() {
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentIntent, setCurrentIntent] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Create session on mount
  useEffect(() => {
    createSessionMutation.mutate({
      uid: `user_${Date.now()}`,
      intent: null,
      selections: [],
      estimatedCost: 0,
      messages: []
    });
  }, []);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      });
      if (!response.ok) throw new Error('Failed to create session');
      return response.json();
    },
    onSuccess: (session) => {
      setSessionId(session.id);
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, sessionId }: { message: string; sessionId: string }) => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          sessionId,
          userId: 'web_user'
        }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },
    onSuccess: (result) => {
      // Add bot response
      const botMessage: Message = {
        id: `msg_${Date.now()}_bot`,
        content: result.message,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        suggestions: result.suggestions,
      };
      setMessages(prev => [...prev, botMessage]);
      setCurrentIntent(result.intent);
    },
  });

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || !sessionId || sendMessageMutation.isPending) return;

    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      content: message,
      role: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Send to API
    sendMessageMutation.mutate({ message, sessionId });
    setMessage('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">CADalytics Creator Chat</h1>
          <p className="text-muted-foreground">
            Describe what you need and I'll help you create the perfect Civil 3D solution
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setLocation('/')}
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
      </div>

      {/* Current Intent */}
      {currentIntent && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              Current Focus:
              <Badge variant="secondary" className="capitalize">
                {currentIntent}
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {/* Chat Messages */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <p className="mb-4">👋 Welcome! I'm here to help you create Civil 3D tools.</p>
                <p className="text-sm">Try saying something like:</p>
                <div className="mt-2 space-y-1 text-xs">
                  <p>"I need a LISP routine for line automation"</p>
                  <p>"Create a drawing template for site plans"</p>
                  <p>"I need corridor subassemblies for urban streets"</p>
                </div>
              </div>
            )}
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-xs opacity-70">Quick suggestions:</p>
                      {msg.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="secondary"
                          size="sm"
                          className="text-xs mr-1 mb-1"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {sendMessageMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex gap-3">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe what Civil 3D tool you need..."
          disabled={!sessionId || sendMessageMutation.isPending}
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={!message.trim() || !sessionId || sendMessageMutation.isPending}
        >
          {sendMessageMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}