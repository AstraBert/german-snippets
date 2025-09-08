"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, BookOpen } from "lucide-react"
import { Slider } from "@/components/customized/slider/slider"

export default function HomePage() {
  const [query, setQuery] = useState("")
  const [topK, setTopK] = useState(5)
  const [htmlContent, setHTMLContent] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async () => {
    if (query.trim() === "") return;

    setError("");
    setIsProcessing(true);
    setHTMLContent("");

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, topK }),
      });
      const data = await res.json();
      setHTMLContent(data.result);
      setQuery("")
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to retrieve relevant information. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTopKChange = (e: number[]) => {
    setTopK(e[0])
  }

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ques = e.target.value
    if (ques) {
      setQuery(ques)
    }
  }

  return (
    <div className="max-w min-h-screen mx-auto p-6 space-y-6 bg-gradient-to-br from-[#a6ffbe] via-white to-[#75e505]">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">German Snippets</h1>
        <p className="text-muted-foreground">
          Get better at German, one snippet at a time
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Search through 2500+ German everyday words
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 rounded-lg p-8 text-center transition-colors">
            <div className="space-y-4">
              <Search className="w-12 h-12 mx-auto text-muted-foreground" />
              <div className="space-y-2">
                <Input id="search-docs" value={query} onChange={handleQueryChange} />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="res-num" className="text-sm font-medium">
                Number of results: {topK}
              </Label>
            </div>

            <div className="w-full">
              <Slider
                id="res-num"
                defaultValue={[5]}
                max={30}
                min={1}
                step={1}
                onValueChange={handleTopKChange}
                className="w-full"
                rangeClassName="bg-gradient-to-br from-[#a6ffbe] to-[#75e505]"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1</span>
                <span>30</span>
              </div>
            </div>

            <Button onClick={handleSearch} className="w-full bg-gradient-to-br from-[#a6ffbe] to-[#75e505] hover:from-[#75e505] hover:to-[#a6ffbe] text-black">
              Submit
            </Button>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Processing Indicator */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>Searching for relevant information...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Markdown Output Section */}
      {htmlContent && !isProcessing && (
        <>
          <Separator />

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle>Rendered Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full">
                <div
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{
                    __html: htmlContent
                  }}
                />
              </ScrollArea>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
