"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  EllipsisVertical,
  Plus,
} from "lucide-react"






function HeaderIntro() {
  return (
    <Card className="rounded-xl border bg-white" style={{ borderColor: "#eeeeee" }}>
      <CardHeader className="pb-2">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <CardTitle className="text-xl md:text-2xl">Model Portafolios</CardTitle>
            <p className="text-sm text-[#444] mt-1 max-w-3xl">
              A model portfolio is a group of assets and target allocations that are designed to meet a particular
              investing goal. Once you create a model, you can apply it to a portfolio. Gossamer will help you keep your
              portfolio in line with your model.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="text-white"
              style={{ backgroundColor: "#872eec" }}
              onClick={() => alert("Create model (simulado)")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add new model
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="More">
                  <EllipsisVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Import</DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

function ModelRow({ name }: { name: string }) {
  return (
    <Card className="rounded-xl border bg-white" style={{ borderColor: "#eeeeee" }}>
      <CardContent className="flex items-center justify-between py-4">
        <div className="font-semibold text-base">{name}</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Apply
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/models/edit">View</Link>
          </Button>
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
      </CardContent>
    </Card>
  )
}

export default function ModelsPage() {
  
  return (
    <div className="space-y-4">
              <HeaderIntro />
              <ModelRow name="Model 1" />
              <ModelRow name="Model 2" />
              <ModelRow name="Model 3" />
    </div>
  )
}
