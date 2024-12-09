"use client";

import { useNetwork } from "@/lib/context/network-context";
import { cn } from "@/lib/utils";
import { Loader2, Github, Twitter } from "lucide-react";
import Link from "next/link";

function NetworkSelector() {
  const { network, setNetwork, isNetworkChanging } = useNetwork();
  
  return (
    <div className={cn("flex gap-2 border rounded-lg p-1 font-mono")}>
      {["mainnet", "testnet"].map((net) => (
        <button
          key={net}
          onClick={() => setNetwork(net as "mainnet" | "testnet")}
          disabled={isNetworkChanging}
          className={cn(
            "px-4 py-1 rounded-md capitalize transition-colors flex items-center gap-2 text-sm tracking-tight",
            network === net && net === "mainnet" && "bg-green-500/10 text-green-500 font-bold",
            network === net && net === "testnet" && "bg-blue-500/10 text-blue-500 font-bold",
            network !== net && "hover:bg-muted",
            isNetworkChanging && "opacity-50 cursor-not-allowed"
          )}
        >
          {net}
          {network === net && !isNetworkChanging && (
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
          )}
          {network === net && isNetworkChanging && (
            <Loader2 className="h-3 w-3 animate-spin" />
          )}
        </button>
      ))}
    </div>
  );
}

function SocialLinks() {
  return (
    <div className="flex gap-4">
      <Link
        href="https://github.com/sisyphusSmiling/drop-sight"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="GitHub Repository"
      >
        <Github className="h-4 w-4" />
      </Link>
      <Link
        href="https://x.com/gio_incognito"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Twitter Profile"
      >
        <Twitter className="h-4 w-4" />
      </Link>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t">
      <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
        <NetworkSelector />
        <SocialLinks />
      </div>
    </footer>
  );
} 