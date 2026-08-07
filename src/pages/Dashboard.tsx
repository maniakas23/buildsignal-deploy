import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Dashboard() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Total Opportunities</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">--</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active Alerts</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">--</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Markets Tracked</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">--</p></CardContent>
        </Card>
      </div>
    </div>
  );
}
