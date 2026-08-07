import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SSOPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Single Sign-On</h1>
      <Card>
        <CardHeader><CardTitle>SSO Configuration</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">SSO settings will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
