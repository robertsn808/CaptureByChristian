import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BookOpen, CheckCircle2, ArrowRight } from "lucide-react";

export function AccountingIntegrations() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Accounting Integrations</h2>
          <p className="text-muted-foreground">Sync payments, invoices, customers, and products to your accounting software.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>QuickBooks Sync by Acodei</span>
              <Badge>Stripe App</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              {[
                'One-time QuickBooks Online authentication',
                'Wizard-driven sync configuration',
                'Sync sales, fees, payouts, refunds, invoices, customers, products, taxes',
                'Real-time or daily aggregate synchronization',
                'Augment with platform metadata (we include invoiceNumber, bookingId, serviceCategory, clientId)'
              ].map((t, i) => (
                <li key={i} className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />{t}</li>
              ))}
            </ul>
            <div className="flex gap-3">
              <a
                href="https://marketplace.stripe.com/apps/quickbooks-sync-by-acodei"
                target="_blank"
                rel="noreferrer"
              >
                <Button className="bg-bronze hover:bg-bronze/90">
                  Open in Stripe Marketplace
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </a>
              <a
                href="https://docs.stripe.com/stripe-apps/embedded-apps?app-embedded-use-case=accounting"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="outline">
                  Embedded Apps Guide
                  <BookOpen className="h-4 w-4 ml-2" />
                </Button>
              </a>
            </div>
            <div className="text-xs text-muted-foreground">
              Note: This integration runs through Stripe Apps. Launch it from your Stripe Dashboard or embed with Stripe Embedded Apps. We already attach metadata to Stripe Checkout for richer sync.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Xero</span>
              <Badge>Stripe App</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              {[
                'One-button feed setup',
                'Sync sales, fees, payouts, refunds',
                'Supports off-Stripe payments via out-of-band invoices',
                'Augment data with Stripe metadata'
              ].map((t, i) => (
                <li key={i} className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />{t}</li>
              ))}
            </ul>
            <div className="flex gap-3">
              <a
                href="https://marketplace.stripe.com/apps/xero"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="outline">
                  Open Xero App
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </a>
              <a
                href="https://docs.stripe.com/stripe-apps/embedded-apps?app-embedded-use-case=accounting"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="ghost">
                  Learn More
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Metadata Mapping</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>We include the following Stripe Checkout metadata to improve sync fidelity:</p>
          <ul className="list-disc ml-5">
            <li><code>invoiceNumber</code>, <code>bookingId</code></li>
            <li><code>serviceCategory</code> (e.g., wedding, portrait, aerial)</li>
            <li><code>clientId</code>, <code>clientEmail</code></li>
          </ul>
          <p>QuickBooks Sync by Acodei and Xero can consume this metadata for categorization and reporting.</p>
        </CardContent>
      </Card>
    </div>
  );
}

