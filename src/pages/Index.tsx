import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmailUploader } from "@/components/EmailUploader";
import { EmailResults, EmailResult } from "@/components/EmailResults";
import { verifyEmails, exportResultsToCSV, downloadCSV } from "@/services/emailVerification";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Shield, 
  CheckCircle, 
  BarChart3, 
  ArrowRight,
  Users,
  Clock,
  Zap
} from "lucide-react";
import heroImage from "@/assets/hero-email-verification.jpg";

const Index = () => {
  const [results, setResults] = useState<EmailResult[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const handleEmailsSubmit = async (emails: string[]) => {
    setIsVerifying(true);
    
    try {
      toast({
        title: "Verification Started",
        description: `Processing ${emails.length} email addresses...`,
      });

      const verificationResults = await verifyEmails(emails);
      setResults(verificationResults);
      
      toast({
        title: "Verification Complete",
        description: `Successfully processed ${emails.length} emails`,
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "An error occurred during email verification",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownload = () => {
    const csvContent = exportResultsToCSV(results);
    downloadCSV(csvContent);
    
    toast({
      title: "Export Complete",
      description: "Results downloaded as CSV file",
    });
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <h3 className="text-lg font-semibold">Verifying Emails...</h3>
              <p className="text-muted-foreground text-center">
                Please wait while we verify and classify your email addresses
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">EmailVerify Pro</h1>
            </div>
            <Badge variant="secondary" className="text-xs">
              BETA
            </Badge>
          </div>
        </div>
      </header>

      {!results.length ? (
        <>
          {/* Hero Section */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div>
                    <Badge className="mb-4">🚀 Smart Email Intelligence</Badge>
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                      Verify & Classify 
                      <span className="text-primary"> Email Lists</span> 
                      Instantly
                    </h1>
                    <p className="text-xl text-muted-foreground mt-6">
                      Stop wasting time on invalid emails and low-value leads. Our AI-powered tool 
                      verifies email addresses and classifies them by business value in seconds.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>99.9% Accuracy Rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      <span>Lightning Fast</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <span>GDPR Compliant</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <img 
                    src={heroImage}
                    alt="Email verification dashboard"
                    className="rounded-lg shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Everything you need for email intelligence
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Our comprehensive platform helps you build cleaner email lists and improve deliverability rates
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <Card>
                  <CardHeader>
                    <Shield className="h-12 w-12 text-primary mb-4" />
                    <CardTitle>Email Verification</CardTitle>
                    <CardDescription>
                      Advanced verification algorithms to detect invalid, risky, and deliverable email addresses
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader>
                    <BarChart3 className="h-12 w-12 text-primary mb-4" />
                    <CardTitle>Lead Classification</CardTitle>
                    <CardDescription>
                      Automatically classify emails as high-value business leads vs low-value free accounts
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Users className="h-12 w-12 text-primary mb-4" />
                    <CardTitle>Bulk Processing</CardTitle>
                    <CardDescription>
                      Upload CSV files or enter emails manually. Process thousands of addresses in seconds
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Ready to clean your email list?</h2>
                  <p className="text-xl text-muted-foreground">
                    Start verifying and classifying your emails now. No signup required.
                  </p>
                </div>
                
                <EmailUploader onEmailsSubmit={handleEmailsSubmit} />
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Verification Results</h2>
              <p className="text-muted-foreground mt-2">
                Analysis complete for {results.length} email addresses
              </p>
            </div>
            <Button 
              onClick={() => setResults([])} 
              variant="outline"
            >
              New Verification
            </Button>
          </div>
          
          <EmailResults results={results} onDownload={handleDownload} />
        </div>
      )}
    </div>
  );
};

export default Index;
