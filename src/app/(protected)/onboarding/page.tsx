"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ArrowRight, TrendingUp, Shield, Zap, PartyPopper } from "lucide-react"
import { useOnboarding } from "@/hooks/useOnboarding"
import ConnectBroker from "@/components/layout/ConectBrocker"

type OnboardingStep = 'welcome' | 'connect-broker' | 'success' | 'choose-plan'

const STEPS = [
  {
    id: 'welcome',
    title: "Welcome to Gossamer",
    description: "Let's get you started with your investment journey",
    icon: <TrendingUp className="h-8 w-8" />,
  },
  {
    id: 'connect-broker',
    title: "Connect Your Broker",
    description: "Link your trading account to start managing investments",
    icon: <Shield className="h-8 w-8" />,
  },
  {
    id: 'success',
    title: "Connection Successful",
    description: "Your broker has been connected successfully",
    icon: <PartyPopper className="h-8 w-8" />,
  },
  {
    id: 'choose-plan',
    title: "Choose Your Plan",
    description: "Select the plan that best fits your investment goals",
    icon: <Zap className="h-8 w-8" />,
  }
]

type Plan = "free" | "pro" | "premium"

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
            <li key={f} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
              <span>{f}</span>
            </li>
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

export default function OnboardingPage() {
  const { markBrokerConnected, markPlanSelected, completeOnboarding } = useOnboarding()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome')
  const [connectedBroker, setConnectedBroker] = useState<string>('')
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly")

  const currentStepIndex = STEPS.findIndex(step => step.id === currentStep) + 1

  const handleNext = () => {
    if (currentStep === 'welcome') {
      setCurrentStep('connect-broker')
    } else if (currentStep === 'connect-broker') {
      // This will be handled by the ConnectBroker component
    } else if (currentStep === 'success') {
      setCurrentStep('choose-plan')
    }
  }

  const handleBrokerConnect = (brokerName: string) => {
    setConnectedBroker(brokerName)
    markBrokerConnected()
    setCurrentStep('success')
  }

  const handlePlanSelect = (plan: Plan) => {
    try {
      localStorage.setItem("membership_plan", JSON.stringify({ plan, billing }))
      markPlanSelected()
      completeOnboarding()
    } catch (error) {
      console.error('Error saving plan:', error)
    }
  }

  const isYearly = billing === "yearly"

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto mb-6 flex items-center justify-center">
              <div className="rounded-full bg-[#872eec] p-4">
                <TrendingUp className="h-12 w-12 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Gossamer
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Your journey to smarter investing starts here. Let&apos;s set up your account 
                in just a few simple steps to get you trading with confidence.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>Connect your broker securely</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>Choose your investment plan</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>Start managing your portfolio</span>
              </div>
            </div>
            <Button
              onClick={handleNext}
              className="text-white gap-2"
              style={{ backgroundColor: "#872eec" }}
              size="lg"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        )

      case 'connect-broker':
        return (
          <div className="w-full max-w-4xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Connect Your Broker
              </h2>
              <p className="text-gray-600">
                Choose your broker to securely connect and sync your portfolio.
              </p>
            </div>
            <ConnectBroker 
              onBrokerConnect={handleBrokerConnect}
              showBackButton={false}
              showContinueButton={false}
            />
          </div>
        )

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto mb-6 flex items-center justify-center">
              <div className="rounded-full bg-green-100 p-4">
                <PartyPopper className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Connection Successful!
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {connectedBroker} has been connected to your Gossamer account. 
                We&apos;ll keep your portfolio in sync automatically.
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">You&apos;re all set!</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                Your portfolio will be synced automatically. You can connect more brokers later.
              </p>
            </div>
            <Button
              onClick={handleNext}
              className="text-white gap-2"
              style={{ backgroundColor: "#872eec" }}
              size="lg"
            >
              Continue to Plan Selection
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        )

      case 'choose-plan':
        return (
          <div className="w-full max-w-6xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose Your Plan
              </h2>
              <p className="text-gray-600 mb-4">
                Select the plan that best fits your investment goals and trading style.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant={billing === "monthly" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBilling("monthly")}
                  style={{ backgroundColor: billing === "monthly" ? "#872eec" : undefined }}
                >
                  Monthly
                </Button>
                <Button
                  variant={billing === "yearly" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBilling("yearly")}
                  style={{ backgroundColor: billing === "yearly" ? "#872eec" : undefined }}
                >
                  Yearly
                  <span className="ml-1 text-xs bg-green-100 text-green-800 px-1 rounded">
                    Save 20%
                  </span>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PlanCard
                name="Free"
                price="$0"
                period="/mo"
                features={[
                  "Basic portfolio tracking",
                  "Up to 3 model portfolios",
                  "Standard support",
                  "Basic analytics"
                ]}
                icon={<TrendingUp className="h-4 w-4" />}
                onChoose={() => handlePlanSelect("free")}
                cta="Start Free"
              />
              
              <PlanCard
                name="Pro"
                price={isYearly ? "$19" : "$24"}
                period="/mo"
                features={[
                  "Everything in Free",
                  "Unlimited model portfolios",
                  "Advanced analytics",
                  "Priority support",
                  "Custom alerts",
                  "API access"
                ]}
                highlight={true}
                icon={<Shield className="h-4 w-4" />}
                onChoose={() => handlePlanSelect("pro")}
                cta="Start Pro"
              />
              
              <PlanCard
                name="Premium"
                price={isYearly ? "$39" : "$49"}
                period="/mo"
                features={[
                  "Everything in Pro",
                  "AI-powered insights",
                  "Portfolio optimization",
                  "Dedicated account manager",
                  "Custom integrations",
                  "White-label options"
                ]}
                icon={<Zap className="h-4 w-4" />}
                onChoose={() => handlePlanSelect("premium")}
                cta="Start Premium"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

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
        <Card className="w-full max-w-4xl rounded-2xl shadow-lg">
          <CardHeader className="text-center pb-4">
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {STEPS.map((step, index) => {
                const isActive = step.id === currentStep
                const isCompleted = STEPS.findIndex(s => s.id === currentStep) > index
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      isCompleted 
                        ? "bg-green-500 text-white" 
                        : isActive 
                        ? "bg-[#872eec] text-white" 
                        : "bg-gray-300 text-gray-600"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className={`w-12 h-0.5 mx-2 ${
                        isCompleted ? "bg-green-500" : "bg-gray-300"
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
            <p className="text-sm text-gray-500">
              Step {currentStepIndex} of {STEPS.length}
            </p>
          </CardHeader>
          
          <CardContent className="pb-8">
            {renderStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
