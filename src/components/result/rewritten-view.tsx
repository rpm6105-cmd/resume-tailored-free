"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

type Props = {
  original: string
  rewritten: string
  onRewrittenChange: (v: string) => void
}

export default function RewrittenView({ original, rewritten, onRewrittenChange }: Props) {
  return (
    <Tabs defaultValue="rewritten">
      <TabsList>
        <TabsTrigger value="rewritten">Rewritten</TabsTrigger>
        <TabsTrigger value="original">Original</TabsTrigger>
      </TabsList>
      <TabsContent value="rewritten" className="space-y-2">
        <Textarea rows={14} value={rewritten} onChange={(e) => onRewrittenChange(e.target.value)} />
        <p className="text-xs text-muted-foreground">Editable</p>
      </TabsContent>
      <TabsContent value="original">
        <Textarea rows={14} value={original} readOnly className="bg-muted" />
      </TabsContent>
    </Tabs>
  )
}
