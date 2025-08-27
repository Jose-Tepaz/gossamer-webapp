"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowLeft, EllipsisVertical } from 'lucide-react'

// Componentes de la pantalla de edición
function AllocationRow({
  percent,
  asset,
  placeholder = "Search for security",
  onChangePercent,
  onChangeAsset,
}: {
  percent: string
  asset: string
  placeholder?: string
  onChangePercent: (v: string) => void
  onChangeAsset: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-3 border-b last:border-b-0">
      <div className="flex items-center gap-1 w-20 py-3">
        <Input
          value={percent}
          onChange={(e) => onChangePercent(e.target.value)}
          className="w-14 px-2 py-1 h-8"
          placeholder="00"
        />
        <span className="text-sm text-muted-foreground">%</span>
      </div>
      <div className="h-8 w-px bg-border" />
      <Input
        value={asset}
        onChange={(e) => onChangeAsset(e.target.value)}
        className="flex-1 h-10 border-0 focus-visible:ring-0"
        placeholder={placeholder}
      />
    </div>
  )
}

export default function EditModelPage() {
  const router = useRouter()
  const [rows, setRows] = useState([
    { percent: "25", asset: "Bitcoin" },
    { percent: "25", asset: "XRP" },
    { percent: "00", asset: "" },
  ])

  function updateRow(i: number, patch: Partial<{ percent: string; asset: string }>) {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)))
  }

  return (
    <div>
      {/* Intro card */}
      <Card className="rounded-xl border bg-white mb-4" style={{ borderColor: "#eeeeee" }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl md:text-2xl">Model Portafolios</CardTitle>
          <p className="text-sm text-[#444] max-w-3xl">
            A model portfolio is a group of assets and target allocations designed to meet a
            particular investing goal. Once you create a model, you can apply it to a portfolio.
          </p>
          <div className="mt-3">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/models"><ArrowLeft className="h-4 w-4" /> Back to My Models</Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left editor */}
        <Card className="rounded-xl border bg-white lg:col-span-2" style={{ borderColor: "#eeeeee" }}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg md:text-xl">Model 1</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="More">
                    <EllipsisVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Rename</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="rounded-md border">
              <AllocationRow
                percent={rows[0].percent}
                asset={rows[0].asset}
                onChangePercent={(v) => updateRow(0, { percent: v })}
                onChangeAsset={(v) => updateRow(0, { asset: v })}
              />
              <AllocationRow
                percent={rows[1].percent}
                asset={rows[1].asset}
                onChangePercent={(v) => updateRow(1, { percent: v })}
                onChangeAsset={(v) => updateRow(1, { asset: v })}
              />
              <AllocationRow
                percent={rows[2].percent}
                asset={rows[2].asset}
                placeholder="Search for security"
                onChangePercent={(v) => updateRow(2, { percent: v })}
                onChangeAsset={(v) => updateRow(2, { asset: v })}
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                className="text-white"
                style={{ backgroundColor: "#872eec" }}
                onClick={() => router.push("/models")}
              >
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right: Model Type */}
        <Card className="rounded-xl border bg-white" style={{ borderColor: "#eeeeee" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg md:text-xl">Model Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-block size-3 rounded-full" style={{ backgroundColor: "#872eec" }} />
              <div>
                <div className="font-semibold">Security</div>
                <p className="text-sm text-[#444]">
                  Define a model that consists of individual securities.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 opacity-70">
              <span className="mt-1 inline-block size-3 rounded-full bg-gray-300" />
              <div>
                <div className="font-semibold">Asset Class</div>
                <p className="text-sm text-[#444]">
                  Create tax-efficient portfolios is an Elite feature. Upgrade Now!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
