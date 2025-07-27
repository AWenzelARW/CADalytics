import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Zap, Settings, Users } from 'lucide-react';

export function HomePage() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: MessageCircle,
      title: "AI-Powered Chat",
      description: "Intelligent conversation interface that understands your Civil 3D needs"
    },
    {
      icon: Zap,
      title: "LISP Automation",
      description: "Generate custom LISP routines for automating repetitive tasks"
    },
    {
      icon: Settings,
      title: "Drawing Templates",
      description: "Create standardized templates with layers, styles, and configurations"
    },
    {
      icon: Users,
      title: "Corridor Subassemblies",
      description: "Access pre-built components for roadway and infrastructure design"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4">
          AI-Powered Civil 3D Tools
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          CADalytics Creator Factory
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Generate custom Civil 3D tools, templates, and solutions with intelligent AI assistance
        </p>
        <Button 
          size="lg" 
          onClick={() => setLocation('/chat')}
          className="text-lg px-8 py-3"
        >
          Start Creating Tools
          <MessageCircle className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {features.map((feature, index) => (
          <Card key={index} className="text-center">
            <CardHeader>
              <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Benefits Section */}
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Why Choose CADalytics Creator Factory?
        </h2>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <h3 className="font-medium mb-2">Intelligent Detection</h3>
            <p className="text-muted-foreground">
              AI automatically understands your requirements and suggests the right tools
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Cost Estimation</h3>
            <p className="text-muted-foreground">
              Real-time pricing calculations help you plan your project budget
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Professional Quality</h3>
            <p className="text-muted-foreground">
              Industry-standard tools and templates built by Civil 3D experts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}