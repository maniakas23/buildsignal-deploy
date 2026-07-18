/**
 * DEBUG VERSION - Simplified to isolate blank content issue
 */
export default function OpportunityDashboard() {
  return (
    <div style={{ padding: '40px', background: '#0a1929', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        Opportunity Dashboard - DEBUG
      </h1>
      <p style={{ color: '#AEB8C4', marginBottom: '20px' }}>
        If you can see this, the page routing and lazy loading work correctly.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div style={{ background: '#121C27', padding: '20px', borderRadius: '12px', border: '1px solid #243444' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>Card 1</h3>
          <p style={{ color: '#7A8A9A', fontSize: '14px' }}>This is a test card.</p>
        </div>
        <div style={{ background: '#121C27', padding: '20px', borderRadius: '12px', border: '1px solid #243444' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>Card 2</h3>
          <p style={{ color: '#7A8A9A', fontSize: '14px' }}>This is a test card.</p>
        </div>
        <div style={{ background: '#121C27', padding: '20px', borderRadius: '12px', border: '1px solid #243444' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>Card 3</h3>
          <p style={{ color: '#7A8A9A', fontSize: '14px' }}>This is a test card.</p>
        </div>
      </div>
    </div>
  );
}
