import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CountyDetail() {
  const { id } = useParams();
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">County Detail</h1>
      <Card>
        <CardHeader><CardTitle>County ID: {id}</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Detailed county information will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
