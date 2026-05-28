"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { encrypt, generatePassword, generateId } from "@/lib/crypto";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const [envContent, setEnvContent] = useState("");
  const [vaultName, setVaultName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [expiresIn, setExpiresIn] = useState("");

  function getExpiresAt(): string | undefined {
    if (!expiresIn) return undefined;
    const ms = parseInt(expiresIn);
    if (!ms) return undefined;
    return new Date(Date.now() + ms).toISOString();
  }

  async function handleCheckout() {
    const url = process.env.NEXT_PUBLIC_PAYHIP_CHECKOUT_PRO;
    if (!url) {
      toast.error("Checkout not configured yet");
      return;
    }
    window.open(url, "_blank");
  }

  async function handleCreateVault() {
    if (!envContent.trim()) {
      toast.error("Paste or upload your .env file first");
      return;
    }
    setIsProcessing(true);
    try {
      const password = generatePassword();
      const { encrypted, iv, salt } = await encrypt(envContent, password);
      const vaultId = generateId();

      const res = await fetch("/api/vaults", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: vaultId,
          encryptedData: encrypted,
          iv,
          salt,
          name: vaultName || undefined,
          expiresAt: getExpiresAt(),
        }),
      });

      if (!res.ok) throw new Error("Failed to save vault");

      const url = `${window.location.origin}/vault/${vaultId}#${password}`;
      await navigator.clipboard.writeText(url);
      toast.success("Vault created! Link copied to clipboard.");
      router.push(`/vault/${vaultId}#${password}`);
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEnvContent(ev.target?.result as string);
    reader.readAsText(file);
  }

  const isContent = envContent.trim().length > 0;

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <section className="text-center mb-12 space-y-4">
          <Badge variant="outline" className="text-sm">Encrypted .env Manager</Badge>
          <h2 className="text-4xl font-bold tracking-tight">
            Share secrets without<br />sharing secrets
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Paste your .env, we encrypt it in your browser before it ever hits our server.
            Share the link — only people with the key (in the URL fragment) can decrypt.
          </p>
        </section>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>New Vault</CardTitle>
            <CardDescription>Your data is encrypted in-browser before being stored.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Vault name (optional)</Label>
              <Input
                id="name"
                placeholder="e.g. Production API Keys"
                value={vaultName}
                onChange={(e) => setVaultName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry">Expires</Label>
              <select
                id="expiry"
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={expiresIn}
                onChange={(e) => setExpiresIn(e.target.value)}
              >
                <option value="">Never</option>
                <option value="86400000">24 hours</option>
                <option value="604800000">7 days</option>
                <option value="2592000000">30 days (Pro)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="env">.env content</Label>
              <div className="relative">
                <textarea
                  id="env"
                  className="min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder={`Paste your .env content here...\n\nDATABASE_URL=postgres://...\nAPI_KEY=sk-...\nSECRET=...`}
                  value={envContent}
                  onChange={(e) => setEnvContent(e.target.value)}
                />
                {!isContent && (
                  <label className="absolute bottom-3 right-3 cursor-pointer">
                    <span className="text-xs text-muted-foreground hover:text-foreground underline">
                      Or upload .env file
                    </span>
                    <input type="file" accept=".env,.txt" className="hidden" onChange={handleFileUpload} />
                  </label>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                onClick={handleCreateVault}
                disabled={isProcessing || !envContent.trim()}
                className="flex-1"
                size="lg"
              >
                {isProcessing ? "Encrypting..." : "Encrypt & Create Vault"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-16" />

        <section className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🔐 Zero-Knowledge</CardTitle>
              <CardDescription>Encrypted in your browser before upload. We never see your secrets.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🔗 Shareable Links</CardTitle>
              <CardDescription>One URL with the decryption key in the fragment — never touches our server.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">⏱️ Auto-Expiry</CardTitle>
              <CardDescription>Set expiration time so secrets self-destruct after 24h, 7d, or 30d.</CardDescription>
            </CardHeader>
          </Card>
        </section>

        <Separator className="my-16" />

        <section className="text-center max-w-2xl mx-auto space-y-6" id="pricing">
          <h2 className="text-3xl font-bold">Simple Pricing</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="relative">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>$0</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>✓ 3 vaults</p>
                <p>✓ 1 person</p>
                <p>✓ Max 7-day expiry</p>
              </CardContent>
            </Card>
            <Card className="relative border-primary">
              <Badge className="absolute -top-2.5 right-3">Popular</Badge>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>$9 / month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>✓ Unlimited vaults</p>
                <p>✓ Team sharing (2 seats)</p>
                <p>✓ Up to 30-day expiry</p>
                <p>✓ Audit log</p>
              <Button
                  className="w-full mt-4"
                  onClick={handleCheckout}
                >
                  Buy Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
