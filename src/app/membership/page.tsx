"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star, Crown, ArrowLeft } from 'lucide-react'

type Plan = "free" | "pro" | "premium"
const STORAGE_KEY = "membership_plan"

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <Check className="h-4 w-4 text-green-600 mt-0.5" />
      <span>{children}</span>
    </li>
  )
}

function PlanCard({
  name,
  price,
  period,
  features,
  highlight = false,
  icon,
  onChoose,
  cta = "Choose plan",
}: {
  name: string
  price: string
  period: "/mo" | "/yr"
  features: string[]
  highlight?: boolean
  icon: React.ReactNode
  cta?: string
  onChoose: () => void
}) {
  return (
    <Card
      className={`relative rounded-xl border ${highlight ? "border-[#872eec] shadow-sm" : ""}`}
    >
      {highlight && (
        <span className="absolute -top-3 left-4 rounded-full bg-[#872eec] px-2 py-0.5 text-xs text-white">
          Most popular
        </span>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="grid place-items-center size-8 rounded-md bg-[#f4f4f4] border">
            {icon}
          </div>
          <CardTitle className="text-lg">{name}</CardTitle>
        </div>
        <div className="mt-1">
          <span className="text-3xl font-semibold">{price}</span>
          <span className="text-muted-foreground">{period}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {features.map((f) => (
            <Feature key={f}>{f}</Feature>
          ))}
        </ul>
        <Button
          className="w-full text-white"
          style={{ backgroundColor: "#872eec" }}
          onClick={onChoose}
        >
          {cta}
        </Button>
      </CardContent>
    </Card>
  )
}

export default function MembershipPage() {
  const router = useRouter()
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly")

  function choose(plan: Plan) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ plan, billing }))
    } catch {}
    router.push("/dashboard") // Simula que continúa al dashboard
  }

  const isYearly = billing === "yearly"

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fondo con viñeta */}
      <div className="absolute inset-0 bg-slate-900/70" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 50% 20%, rgba(255,255,255,0.15), rgba(0,0,0,0) 60%)",
          filter: "blur(10px)",
        }}
        aria-hidden="true"
      />
      {/* Contenido */}
      <div className="relative z-10 min-h-screen p-4 flex items-center justify-center">
        <div className="w-full max-w-5xl">
          <div className="mb-4 flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </div>

          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl md:text-3xl">Choose your membership</CardTitle>
              <p className="text-sm md:text-base text-[#444] mt-1">
                Pick the plan that’s right for you. You can change or cancel anytime.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Toggle billing */}
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant={billing === "monthly" ? "default" : "outline"}
                  onClick={() => setBilling("monthly")}
                  className={billing === "monthly" ? "text-white" : ""}
                  style={billing === "monthly" ? { backgroundColor: "#872eec" } : {}}
                >
                  Monthly
                </Button>
                <Button
                  variant={billing === "yearly" ? "default" : "outline"}
                  onClick={() => setBilling("yearly")}
                  className={billing === "yearly" ? "text-white" : ""}
                  style={billing === "yearly" ? { backgroundColor: "#872eec" } : {}}
                >
                  Yearly <span className="ml-2 text-xs opacity-80">(2 months off)</span>
                </Button>
              </div>

              {/* Plans */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <PlanCard
                  name="Free"
                  price="$0"
                  period={isYearly ? "/yr" : "/mo"}
                  icon={<Star className="h-4 w-4" />}
                  features={[
                    "Basic portfolio tracking",
                    "Connect 1 broker",
                    "Community support",
                  ]}
                  cta="Start for free"
                  onChoose={() => choose("free")}
                />
                <PlanCard
                  name="Pro"
                  price={isYearly ? "$90" : "$9"}
                  period={isYearly ? "/yr" : "/mo"}
                  highlight
                  icon={<Crown className="h-4 w-4" />}
                  features={[
                    "Unlimited brokers",
                    "Smart rebalance & alerts",
                    "Priority support",
                  ]}
                  onChoose={() => choose("pro")}
                />
                <PlanCard
                  name="Premium"
                  price={isYearly ? "$190" : "$19"}
                  period={isYearly ? "/yr" : "/mo"}
                  icon={<Crown className="h-4 w-4" />}
                  features={[
                    "Everything in Pro",
                    "Advanced analytics",
                    "White-glove onboarding",
                  ]}
                  onChoose={() => choose("premium")}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
