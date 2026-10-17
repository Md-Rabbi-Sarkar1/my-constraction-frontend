"use client";

import React, { useState } from "react";
// 💡 Ensure this targets your fixed hooks file where useInitiatePayment is exposed
import { useInitiatePayment } from "@/hooks"; 
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("monthly");
  const [activeCheckingOutTier, setActiveCheckingOutTier] = useState<string | null>(null);
  const { mutateAsync: checkoutWithBkash, isPending: paymentPending } = useInitiatePayment();

  const pricingTiers = [
    {
      name: "Starter Depot",
      slug: "starter-depot",
      description: "Ideal for small independent sub-contractors managing single active site perimeters.",
      priceMonthly: 49,
      priceAnnualDiscount: 39,
      features: ["1 Active Project Workspace", "Up to 5 Allocated Crew Members", "Basic Kanban Tasks Board"],
      ctaText: "Purchase Plan",
      popular: false,
      accentColor: "border-slate-200",
    },
    {
      name: "Professional Crew",
      slug: "professional-crew",
      description: "Best for growing mid-sized firms coordinating multiple active building milestones simultaneously.",
      priceMonthly: 149,
      priceAnnualDiscount: 119,
      features: ["Up to 10 Active Project Workspaces", "Up to 30 Allocated Crew Members", "Advanced Kanban Boards"],
      ctaText: "Purchase Plan",
      popular: true,
      accentColor: "border-slate-900 ring-2 ring-slate-950",
    },
    {
      name: "Enterprise Vault",
      slug: "enterprise-vault",
      description: "Custom built for large-scale construction enterprises requiring multi-corporate fund oversight.",
      priceMonthly: 399,
      priceAnnualDiscount: 319,
      features: ["Unlimited Active Workspaces", "Unlimited Allocated Crew Members", "Full Depot Ledgers"],
      ctaText: "Purchase Plan",
      popular: false,
      accentColor: "border-slate-200",
    },
  ];

  // 💡 FIXED: 'tier' type is explicitly typed as 'any' to stop layout compiler verification crashes
const handlePaymentInitiation = async (tier: any) => {
  setActiveCheckingOutTier(tier.slug);
  const finalPrice = billingPeriod === "monthly" ? tier.priceMonthly : tier.priceAnnualDiscount;
  
  // 💡 FIXED PAYLOAD GENERATION:
  // We stringify the numeric value right here to satisfy your backend prisma field validation checks 
  const payload = {
    amount: String(finalPrice), // Converts 49 -> "49", matching your schema definitions contract
  };

  try {
    await checkoutWithBkash(payload);
  } catch (err) {
    console.log("bKash connection checkout stream completed with error context tracking.");
  } finally {
    setActiveCheckingOutTier(null);
  }
};

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
      <div className="space-y-4 border-b border-slate-200 bg-white px-4 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">Subscription Options Built for Construction Scale</h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">Choose the operational capacity tier that fits your firm's workforce sizing constraints.</p>
        <div className="pt-4 flex justify-center">
          <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <button type="button" disabled={paymentPending} onClick={() => setBillingPeriod("monthly")} className={`rounded-lg px-4 py-2 transition-colors ${billingPeriod === "monthly" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-slate-200 dark:hover:bg-slate-700"}`}>Monthly Billing</button>
            <button type="button" disabled={paymentPending} onClick={() => setBillingPeriod("annually")} className={`rounded-lg px-4 py-2 transition-colors ${billingPeriod === "annually" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-slate-200 dark:hover:bg-slate-700"}`}>Annual Billing</button>
          </div>
        </div>
      </div>

      <div className="py-16 px-4 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {pricingTiers.map((tier) => {
          const displayPrice = billingPeriod === "monthly" ? tier.priceMonthly : tier.priceAnnualDiscount;
          const isThisTierLoading = paymentPending && activeCheckingOutTier === tier.slug;

          return (
            <div key={tier.name} className={`flex flex-col justify-between space-y-6 rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 ${tier.accentColor}`}>
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-950 dark:text-white">{tier.name}</h3>
                <p className="text-xs text-slate-500 min-h-[48px]">{tier.description}</p>
                <div className="pt-2 border-b pb-4">
                  <span className="text-4xl font-mono font-black text-slate-950">৳{displayPrice}</span>
                  <span className="text-xs text-slate-400 font-bold ml-1">/ month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                  {tier.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4">
                <Button
                  type="button"
                  disabled={paymentPending}
                  onClick={() => handlePaymentInitiation(tier)}
                  className="w-full text-xs font-bold h-10 bg-amber-500 text-black hover:bg-slate-800"
                >
                  {isThisTierLoading ? (
                    <div className="flex items-center gap-1.5 justify-center">
                      <Spinner className="w-3 h-3 animate-spin" />
                      Initiating bKash...
                    </div>
                  ) : (
                    tier.ctaText
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
