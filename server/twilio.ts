import twilio from 'twilio';

// Initialize Twilio client with provided credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID || "AC37457098dfeee8d1235afc0616755c21";
const authToken = process.env.TWILIO_AUTH_TOKEN || "6e96c910149964a5db0d0ef4742f6fcd";
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || "+18312009690";

let twilioClient: twilio.Twilio | null = null;

// Initialize Twilio client only if all credentials are available
if (accountSid && authToken && twilioPhoneNumber) {
  twilioClient = twilio(accountSid, authToken);
}

export interface SMSMessage {
  to: string;
  body: string;
}

export async function sendSMS(message: SMSMessage): Promise<boolean> {
  if (!twilioClient || !twilioPhoneNumber) {
    console.error('Twilio not configured - missing credentials');
    return false;
  }

  try {
    const result = await twilioClient.messages.create({
      body: message.body,
      from: twilioPhoneNumber,
      to: message.to
    });

    console.log(`SMS sent successfully to ${message.to}. SID: ${result.sid}`);
    return true;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return false;
  }
}

export async function sendMagicLinkSMS(clientName: string, clientPhone: string, magicLink: string): Promise<boolean> {
  const message: SMSMessage = {
    to: clientPhone,
    body: `Hi ${clientName}! Here's your secure login link for Captured by Christian client portal: ${magicLink}\n\nThis link expires in 24 hours. If you have any questions, please reply to this message.`
  };

  return await sendSMS(message);
}

export function isTwilioConfigured(): boolean {
  return !!(accountSid && authToken && twilioPhoneNumber);
}