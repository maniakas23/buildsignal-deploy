// Cancel confirmation dialog — extracted from BillingPage (m1(24C)),
// behavior-identical.
import { Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "./billingConfig";

interface CancelSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPeriodEnd: number | null | undefined;
  cancelPending: boolean;
  onConfirm: () => void;
}

export function CancelSubscriptionDialog(p: CancelSubscriptionDialogProps) {
  return (
    <Dialog open={p.open} onOpenChange={p.onOpenChange}>
      <DialogContent className="bg-[var(--bs-surface)] border-[var(--bs-border)]">
        <DialogHeader>
          <DialogTitle className="text-[var(--bs-text-primary)]">
            Cancel Subscription?
          </DialogTitle>
          <DialogDescription className="text-[var(--bs-text-tertiary)]">
            Your subscription will remain active until the end of the current billing period
            ({formatDate(p.currentPeriodEnd)}). After that, you will be downgraded
            to the free Starter plan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => p.onOpenChange(false)}
            className="border-[var(--bs-border)] text-[var(--bs-text-primary)]"
          >
            Keep Subscription
          </Button>
          <Button
            variant="destructive"
            onClick={p.onConfirm}
            disabled={p.cancelPending}
            className="gap-2"
          >
            {p.cancelPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            Confirm Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
