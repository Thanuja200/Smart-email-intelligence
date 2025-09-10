import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, AlertCircle, Download, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export interface EmailResult {
  email: string;
  status: 'valid' | 'invalid' | 'risky';
  classification: 'high-value' | 'standard' | 'low-value';
  domain: string;
  reason?: string;
}

interface EmailResultsProps {
  results: EmailResult[];
  onDownload: () => void;
}

export const EmailResults = ({ results, onDownload }: EmailResultsProps) => {
  const validEmails = results.filter(r => r.status === 'valid').length;
  const invalidEmails = results.filter(r => r.status === 'invalid').length;
  const riskyEmails = results.filter(r => r.status === 'risky').length;
  const highValueEmails = results.filter(r => r.classification === 'high-value').length;

  const validPercentage = (validEmails / results.length) * 100;
  const highValuePercentage = (highValueEmails / results.length) * 100;

  const getStatusIcon = (status: EmailResult['status']) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'invalid':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'risky':
        return <AlertCircle className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusBadge = (status: EmailResult['status']) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-success text-success-foreground">Valid</Badge>;
      case 'invalid':
        return <Badge variant="destructive">Invalid</Badge>;
      case 'risky':
        return <Badge className="bg-warning text-warning-foreground">Risky</Badge>;
    }
  };

  const getClassificationBadge = (classification: EmailResult['classification']) => {
    switch (classification) {
      case 'high-value':
        return <Badge variant="default">High Value</Badge>;
      case 'standard':
        return <Badge variant="secondary">Standard</Badge>;
      case 'low-value':
        return <Badge variant="outline">Low Value</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              Valid Emails
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{validEmails}</div>
            <Progress value={validPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{validPercentage.toFixed(1)}% of total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-destructive" />
              Invalid/Risky
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{invalidEmails + riskyEmails}</div>
            <p className="text-xs text-muted-foreground">
              {invalidEmails} invalid, {riskyEmails} risky
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              High Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{highValueEmails}</div>
            <Progress value={highValuePercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{highValuePercentage.toFixed(1)}% of total</p>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Verification Results</CardTitle>
              <CardDescription>
                Detailed breakdown of email verification and classification
              </CardDescription>
            </div>
            <Button onClick={onDownload} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Classification</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{result.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.status)}
                        {getStatusBadge(result.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getClassificationBadge(result.classification)}
                    </TableCell>
                    <TableCell>{result.domain}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {result.reason || '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};