// Billing History card — extracted from BillingPage (m1(24C)), behavior-identical.
import { Calendar, Loader2, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatDate, formatCurrency } from "./billingConfig";

interface BillingHistoryCardProps {
  billingHistory: any[] | undefined;
  historyLoading: boolean;
}

export function BillingHistoryCard({ billingHistory, historyLoading }: BillingHistoryCardProps) {
  return (
    <Card className="border-[var(--bs-surface-hover)] shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-[var(--bs-text-primary)] flex items-center gap-2">
          <Receipt className="h-5 w-5 text-[var(--bs-action)]" />
          Billing History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {historyLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--bs-action)]" />
          </div>
        ) : billingHistory && billingHistory.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-[var(--bs-border)]">
                <TableHead className="text-[var(--bs-text-tertiary)]">Date</TableHead>
                <TableHead className="text-[var(--bs-text-tertiary)]">Description</TableHead>
                <TableHead className="text-[var(--bs-text-tertiary)] text-right">Amount</TableHead>
                <TableHead className="text-[var(--bs-text-tertiary)] text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((invoice: any) => (
                <TableRow key={invoice.id} className="border-[var(--bs-border)]">
                  <TableCell className="text-sm text-[var(--bs-text-primary)]">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-[var(--bs-text-tertiary)]" />
                      {formatDate(invoice.created)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-[var(--bs-text-primary)]">
                    {invoice.description || "Subscription"}
                  </TableCell>
                  <TableCell className="text-sm font-mono text-right text-[var(--bs-text-primary)]">
                    {formatCurrency(invoice.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={invoice.paid ? "default" : "secondary"}
                      className={cn(
                        "text-[10px]",
                        invoice.paid
                          ? "bg-[var(--bs-intelligence)] text-white"
                          : "bg-[var(--bs-text-tertiary)] text-white"
                      )}
                    >
                      {invoice.paid ? "Paid" : "Unpaid"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-[var(--bs-text-tertiary)] text-center py-8">
            No billing history available
          </p>
        )}
      </CardContent>
    </Card>
  );
}
