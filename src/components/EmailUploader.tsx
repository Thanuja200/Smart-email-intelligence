import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailUploaderProps {
  onEmailsSubmit: (emails: string[]) => void;
}

export const EmailUploader = ({ onEmailsSubmit }: EmailUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [manualEmails, setManualEmails] = useState("");

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.name.endsWith('.csv') || file.type === 'text/csv');
    
    if (csvFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvText = event.target?.result as string;
        const emails = parseCsvEmails(csvText);
        onEmailsSubmit(emails);
      };
      reader.readAsText(csvFile);
    }
  }, [onEmailsSubmit]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvText = event.target?.result as string;
        const emails = parseCsvEmails(csvText);
        onEmailsSubmit(emails);
      };
      reader.readAsText(file);
    }
  };

  const handleManualSubmit = () => {
    const emails = manualEmails
      .split('\n')
      .map(email => email.trim())
      .filter(email => email && email.includes('@'));
    
    if (emails.length > 0) {
      onEmailsSubmit(emails);
      setManualEmails("");
    }
  };

  const parseCsvEmails = (csvText: string): string[] => {
    const lines = csvText.split('\n');
    const emails: string[] = [];
    
    lines.forEach(line => {
      const columns = line.split(',');
      columns.forEach(column => {
        const trimmed = column.trim().replace(/['"]/g, '');
        if (trimmed.includes('@')) {
          emails.push(trimmed);
        }
      });
    });
    
    return [...new Set(emails)]; // Remove duplicates
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Upload Email List
        </CardTitle>
        <CardDescription>
          Upload a CSV file or enter emails manually to start verification and classification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">CSV Upload</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"
              )}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Drop your CSV file here</h3>
              <p className="text-muted-foreground mb-4">
                Or click to select a file from your computer
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="csv-upload"
              />
              <Button asChild>
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  Select CSV File
                </label>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4">
            <div>
              <label htmlFor="manual-emails" className="block text-sm font-medium mb-2">
                Enter Email Addresses (one per line)
              </label>
              <Textarea
                id="manual-emails"
                placeholder="john@example.com&#10;jane@company.com&#10;user@business.org"
                value={manualEmails}
                onChange={(e) => setManualEmails(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            <Button onClick={handleManualSubmit} className="w-full" disabled={!manualEmails.trim()}>
              Verify Emails
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};