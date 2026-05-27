import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Dotenv Alternative — Encrypted .env File Sharing | EnvLock",
  description: "Looking for a dotenv alternative? EnvLock is a zero-knowledge encrypted .env manager for teams. Browser-side encryption, shareable links, and team workspaces.",
};

export default function DotenvAlternativePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-2">
        <Badge variant="outline">Alternative</Badge>
        <h1 className="text-4xl font-bold">Dotenv Alternative: EnvLock</h1>
        <p className="text-muted-foreground">
          If you are using dotenv for local development but need a way to share .env files with your team securely, EnvLock is the missing piece.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Why a Dotenv Alternative?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3 text-muted-foreground">
          <p>
            Dotenv is great for loading <code>.env</code> files locally. But it doesn&apos;t solve the problem of
            sharing those files with your team. Developers end up emailing .env files, pasting them in Slack,
            or storing them in shared drives — none of which are secure.
          </p>
          <p>
            EnvLock fills that gap: encrypt your .env in the browser, share a link, and the recipient decrypts
            it in their browser. Zero-knowledge, zero setup.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comparison</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-4">Feature</th>
                <th className="py-2 pr-4">Dotenv</th>
                <th className="py-2 pr-4">EnvLock</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4">Local .env loading</td>
                <td className="py-2 pr-4">✓</td>
                <td className="py-2 pr-4">—</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Encrypted sharing</td>
                <td className="py-2 pr-4">—</td>
                <td className="py-2 pr-4">✓</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Zero-knowledge</td>
                <td className="py-2 pr-4">—</td>
                <td className="py-2 pr-4">✓</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Team workspaces</td>
                <td className="py-2 pr-4">—</td>
                <td className="py-2 pr-4">✓ (Pro)</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
