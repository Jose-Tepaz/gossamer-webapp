"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function Step({
  index = 1,
  title,
  description,
}: {
  index?: number
  title: string
  description: string
}) {
  return (
    <div className="rounded-md border bg-[#f7f7f7] px-4 py-3 text-sm">
      <div className="font-medium">{`${index}. ${title}`}</div>
      <div className="text-[#444] mt-1">{description}</div>
    </div>
  )
}

export default function WelcomePage() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background vignette */}
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
      {/* Content */}
      <div className="relative z-10 min-h-screen p-4 grid place-items-center">
        <Card className="w-full max-w-xl rounded-2xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl md:text-3xl">Welcome to Gossamer</CardTitle>
            <p className="text-sm md:text-base text-[#444] mt-1">{"Let's get you set up!"}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Step
              index={1}
              title="Connect Brokerage"
              description={"It's easy! Take 30 seconds to connect your account."}
            />
            <Step
              index={2}
              title="Choose Membership"
              description={"Starting at $0 for life, choose the package that's right for you!"}
            />
            <Step
              index={3}
              title="Set Target"
              description={"Assign a percentage allocation to each asset in your portfolio."}
            />

            <p className="text-sm text-[#333] leading-relaxed">
              {"Once you're set up, Gossamer will help you follow your investment targets. Start growing your wealth now!"}
            </p>

            <Button
              className="w-full text-white"
              style={{ backgroundColor: "#872eec" }}
              onClick={() => router.push("/connect-broker")}
            >
              Next
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
