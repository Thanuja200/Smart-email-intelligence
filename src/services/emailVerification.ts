import { EmailResult } from "@/components/EmailResults";

// Mock email verification service
// In a real implementation, this would connect to APIs like Hunter.io, ZeroBounce, etc.

const freeEmailDomains = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 
  'icloud.com', 'protonmail.com', 'zoho.com', 'yandex.com', 'mail.com'
];

const businessDomains = [
  'microsoft.com', 'apple.com', 'google.com', 'amazon.com', 'salesforce.com',
  'hubspot.com', 'stripe.com', 'slack.com', 'dropbox.com', 'atlassian.com'
];

const riskyDomains = [
  '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com',
  'throwaway.email', 'temp-mail.org'
];

export const verifyEmails = async (emails: string[]): Promise<EmailResult[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return emails.map(email => {
    const domain = email.split('@')[1]?.toLowerCase() || '';
    const localPart = email.split('@')[0];
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        email,
        status: 'invalid' as const,
        classification: 'low-value' as const,
        domain,
        reason: 'Invalid email format'
      };
    }
    
    // Check for risky domains
    if (riskyDomains.some(risky => domain.includes(risky))) {
      return {
        email,
        status: 'risky' as const,
        classification: 'low-value' as const,
        domain,
        reason: 'Temporary/disposable email domain'
      };
    }
    
    // Check for suspicious patterns
    if (localPart.includes('test') || localPart.includes('fake') || localPart.includes('spam')) {
      return {
        email,
        status: 'risky' as const,
        classification: 'low-value' as const,
        domain,
        reason: 'Suspicious email pattern'
      };
    }
    
    // Classify based on domain
    let classification: EmailResult['classification'] = 'standard';
    let reason = 'Standard email domain';
    
    if (businessDomains.some(biz => domain.includes(biz))) {
      classification = 'high-value';
      reason = 'Corporate/business domain';
    } else if (freeEmailDomains.includes(domain)) {
      classification = 'low-value';
      reason = 'Free email provider';
    } else if (domain.includes('.edu') || domain.includes('.gov') || domain.includes('.org')) {
      classification = 'high-value';
      reason = 'Educational/government/organization domain';
    } else if (!freeEmailDomains.includes(domain) && domain.includes('.')) {
      // Likely custom business domain
      classification = 'high-value';
      reason = 'Custom business domain';
    }
    
    // Random chance of some invalid emails for demo purposes
    if (Math.random() < 0.05) { // 5% chance
      return {
        email,
        status: 'invalid' as const,
        classification: 'low-value' as const,
        domain,
        reason: 'Domain does not exist'
      };
    }
    
    return {
      email,
      status: 'valid' as const,
      classification,
      domain,
      reason
    };
  });
};

export const exportResultsToCSV = (results: EmailResult[]): string => {
  const headers = ['Email', 'Status', 'Classification', 'Domain', 'Reason'];
  const csvContent = [
    headers.join(','),
    ...results.map(result => [
      result.email,
      result.status,
      result.classification,
      result.domain,
      result.reason || ''
    ].map(field => `"${field}"`).join(','))
  ].join('\n');
  
  return csvContent;
};

export const downloadCSV = (csvContent: string, filename: string = 'email_verification_results.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};