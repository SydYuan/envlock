"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  async function handleCheckout(priceId: string) {
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/?success=true`,
          cancelUrl: `${window.location.origin}/#pricing`,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else toast.error("Checkout failed");
    } catch {
      toast.error("Checkout failed");
    } finally {
      setIsCheckingOut(false);
    }
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
        body: JSON.stringify({ id: vaultId, encryptedData: encrypted, iv, salt, name: vaultName || undefined }),
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
      <header className="border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">EnvLock</h1>
          <span className="text-sm text-muted-foreground">🔒 Zero-knowledge</span>
        </div>
      </header>

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
              <CardDescription>Set expiration time so secrets self-destruct. Coming soon.</CardDescription>
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
                <p>✓ 7-day retention</p>
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
                <p>✓ Audit log</p>
                <p>✓ 30-day retention</p>
                <Button
                  className="w-full mt-4"
                  onClick={() => handleCheckout(process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO ?? "")}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? "Opening..." : "Subscribe"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        EnvLock — Encrypted .env Manager
      </footer>
    </div>
  );
}
