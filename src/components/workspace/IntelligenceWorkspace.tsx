export function IntelligenceWorkspace({ recommendationId, onBack }: { recommendationId?: number | string | null; onBack?: () => void }) {
  return (
    <div>
      {onBack && (
        <button type="button" onClick={onBack} className="text-sm text-accent-indigo hover:underline mb-2">
          Back
        </button>
      )}
      <div>Workspace{recommendationId != null ? ` — #${recommendationId}` : ''}</div>
    </div>
  );
}
