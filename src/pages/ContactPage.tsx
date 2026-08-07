import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Globe,
  Building2,
  Linkedin,
  Twitter,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ContactPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    inquiryType: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSubmitted(true);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="text-muted-foreground">
          We'd love to hear from you. Reach out for support, sales, or general
          inquiries.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Contact Info */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Email</div>
                  <a
                    href="mailto:support@buildsignal.net"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    support@buildsignal.net
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Phone</div>
                  <a
                    href="tel:+14155551234"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    +1 (415) 555-1234
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Address</div>
                  <div className="text-sm text-muted-foreground">
                    123 Market Street
                    <br />
                    Suite 456
                    <br />
                    San Francisco, CA 94105
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Business Hours</div>
                  <div className="text-sm text-muted-foreground">
                    Monday–Friday
                    <br />
                    9:00 AM – 6:00 PM ET
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Follow Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href="https://linkedin.com/company/buildsignal"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
              <a
                href="https://twitter.com/buildsignal"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-4 w-4" />
                Twitter / X
              </a>
              <a
                href="https://buildsignal.net/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Globe className="h-4 w-4" />
                Blog
              </a>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-sm"
                onClick={() => navigate("/help")}
              >
                <MessageCircle className="h-4 w-4" />
                Help Center
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-sm"
                onClick={() => navigate("/pricing")}
              >
                <ArrowRight className="h-4 w-4" />
                View Pricing
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-sm"
                onClick={() => navigate("/demo")}
              >
                <Building2 className="h-4 w-4" />
                Request a Demo
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                  <h3 className="text-xl font-semibold">Message sent!</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Thank you for reaching out. We'll get back to you within 24
                    hours during business days.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: "",
                        email: "",
                        company: "",
                        inquiryType: "",
                        message: "",
                      });
                    }}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Name</Label>
                      <Input
                        id="contact-name"
                        placeholder="Your full name"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Email</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="you@company.com"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="contact-company">Company (Optional)</Label>
                      <Input
                        id="contact-company"
                        placeholder="Acme Inc."
                        value={form.company}
                        onChange={(e) =>
                          handleChange("company", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-type">Inquiry Type</Label>
                      <Select
                        value={form.inquiryType}
                        onValueChange={(value) =>
                          handleChange("inquiryType", value)
                        }
                      >
                        <SelectTrigger id="contact-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                          <SelectItem value="partnership">
                            Partnership
                          </SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea
                      id="contact-message"
                      placeholder="How can we help you?"
                      rows={5}
                      value={form.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="gap-2">
                    <Mail className="h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* Map Placeholder */}
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold">Visit Our Office</h2>
        <p className="text-muted-foreground">
          We're located in the heart of San Francisco's financial district.
        </p>
        <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Interactive map coming soon
            </p>
            <p className="text-xs text-muted-foreground">
              123 Market Street, San Francisco, CA 94105
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
