
import axios from 'axios';
import { Request, Response } from 'express';

// TODO: Replace with your QuickBooks App credentials from .env
const QUICKBOOKS_CLIENT_ID = process.env.QUICKBOOKS_CLIENT_ID;
const QUICKBOOKS_CLIENT_SECRET = process.env.QUICKBOOKS_CLIENT_SECRET;
const QUICKBOOKS_REDIRECT_URI = process.env.QUICKBOOKS_REDIRECT_URI;
const QUICKBOOKS_API_BASE_URL = 'https://sandbox-quickbooks.api.intuit.com'; // Use sandbox for development

// Store tokens in a secure way (e.g., database)
let accessToken = '';
let refreshToken = '';

export const quickbooksAuth = (req: Request, res: Response) => {
  const authUrl = `https://appcenter.intuit.com/connect/oauth2?client_id=${QUICKBOOKS_CLIENT_ID}&response_type=code&scope=com.intuit.quickbooks.accounting&redirect_uri=${QUICKBOOKS_REDIRECT_URI}&state=security_token`;
  res.redirect(authUrl);
};

export const quickbooksCallback = async (req: Request, res: Response) => {
  const { code, state } = req.query;

  if (state !== 'security_token') {
    return res.status(400).send('Invalid state');
  }

  try {
    const response = await axios.post('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: QUICKBOOKS_REDIRECT_URI,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${QUICKBOOKS_CLIENT_ID}:${QUICKBOOKS_CLIENT_SECRET}`).toString('base64')}`,
      },
    });

    accessToken = response.data.access_token;
    refreshToken = response.data.refresh_token;

    // TODO: Store tokens securely in the database associated with the user/account
    console.log('QuickBooks tokens obtained:', { accessToken, refreshToken });

    res.send('QuickBooks connected successfully!');
  } catch (error) {
    console.error('Error getting QuickBooks tokens:', error);
    res.status(500).send('Error connecting to QuickBooks');
  }
};

export const syncToQuickbooks = async (paymentData: any) => {
  if (!accessToken) {
    console.error('No QuickBooks access token available.');
    return;
  }

  try {
    // Example: Create a customer in QuickBooks
    const createCustomerResponse = await axios.post(`${QUICKBOOKS_API_BASE_URL}/v3/company/YOUR_REALM_ID/customer`, {
      DisplayName: paymentData.customerName,
      PrimaryEmailAddr: {
        Address: paymentData.customerEmail,
      },
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    console.log('QuickBooks customer created:', createCustomerResponse.data);

    // TODO: Implement invoice and payment creation in QuickBooks
    // You'll need to get the realmId after the OAuth flow.
    // It's returned in the callback response.

  } catch (error) {
    console.error('Error syncing to QuickBooks:', error);
  }
};
