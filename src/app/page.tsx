"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { generateBestsellingScore } from "@/ai/flows/generate-bestselling-score";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [bestsellingScore, setBestsellingScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const generateScore = useCallback(async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please upload a file first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setBestsellingScore(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const documentDataUri = event.target?.result as string;
        const result = await generateBestsellingScore({ documentDataUri });
        setBestsellingScore(result.bestsellingScore);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error("Error generating score:", error);
      toast({
        title: "Error",
        description:
          error?.message || "Failed to generate bestselling score. Try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [file, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
      <h1 className="text-4xl font-bold text-white">
        <span style={{ color: "#D400FF" }}>Score</span>
        <span style={{ color: "#00FFFF" }}>Sight</span>
      </h1>
      <div className="flex w-full max-w-4xl space-x-4">
        <Card className="w-1/2 bg-card">
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="text-sm"
            />
            <Button
              onClick={generateScore}
              disabled={isLoading}
              style={{ backgroundColor: "#D400FF", color: "white" }}
            >
              {isLoading ? "Generating..." : "Generate"}
            </Button>
          </CardContent>
        </Card>

        <Card className="w-1/2 bg-card">
          <CardHeader>
            <CardTitle>Bestselling Score</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-full">
            {isLoading ? (
              <p className="text-lg text-muted-foreground">Loading...</p>
            ) : bestsellingScore !== null ? (
              <p className="text-5xl font-bold" style={{ color: "#00FFFF" }}>
                {bestsellingScore}%
              </p>
            ) : (
              <p className="text-lg text-muted-foreground">
                Upload a document to see its score.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
