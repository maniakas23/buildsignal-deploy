import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lightbulb, Mail, CheckCircle2 } from "lucide-react";

const categories = [
  "Market intelligence",
  "Reports & exports",
  "Alerts & notifications",
  "Data coverage",
  "Integrations & API",
  "Other",
];

export function FeatureRequestPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [details, setDetails] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Feature request: ${title}`);
    const body = encodeURIComponent(
      `Category: ${category}\n\n${details}\n\n— Submitted from the BuildSignal feature request page`
    );
    window.location.href = `mailto:support@buildsignal.net?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 rounded-lg border border-input px-3 py-2 text-sm hover:bg-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Request a feature</h1>
        <p className="text-muted-foreground mt-2">
          Tell us what would make BuildSignal more useful for your work. Every
          request is read by the product team and considered for the public{" "}
          <button
            onClick={() => navigate("/roadmap")}
            className="text-primary hover:underline"
          >
            roadmap
          </button>
          .
        </p>
      </div>

      {sent ? (
        <div className="p-6 border rounded-lg bg-card text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 mb-3 text-green-500" />
          <p className="font-medium">Your email draft is ready</p>
          <p className="text-sm text-muted-foreground mt-2">
            We opened your mail client with the request pre-filled. If nothing
            happened, email us directly at{" "}
            <a href="mailto:support@buildsignal.net" className="text-primary hover:underline">
              support@buildsignal.net
            </a>
            .
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="p-6 border rounded-lg bg-card space-y-4">
          <div>
            <label htmlFor="fr-title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              id="fr-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Export reports to PowerPoint"
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="fr-category" className="block text-sm font-medium mb-1">
              Category
            </label>
            <select
              id="fr-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="fr-details" className="block text-sm font-medium mb-1">
              Details
            </label>
            <textarea
              id="fr-details"
              required
              rows={5}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="What problem would this solve for you? How would you use it?"
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          >
            <Mail className="h-4 w-4" />
            Send request
          </button>
        </form>
      )}

      <div className="mt-6 flex items-start gap-3 text-sm text-muted-foreground">
        <Lightbulb className="h-4 w-4 mt-0.5 shrink-0" />
        <p>
          We don&rsquo;t show vote counts or a public queue here yet — requests
          are reviewed directly by the team, and planned work is published on
          the roadmap page.
        </p>
      </div>
    </div>
  );
}
