import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ReportsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Reports</h1>
      <Card>
        <CardHeader><CardTitle>Generated Reports</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Your generated reports will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
