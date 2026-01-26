#!/usr/bin/env node

require('dotenv').config();
const formData = require('form-data');
const Mailgun = require('mailgun.js');

async function testMailgun() {
  console.log('🧪 Testing Mailgun Configuration...\n');
  
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  
  if (!apiKey || !domain) {
    console.log('❌ Mailgun credentials not found in .env file');
    console.log('Please run: npm run setup-email');
    return;
  }
  
  console.log(`📧 Testing with domain: ${domain}`);
  console.log(`🔑 API Key: ${apiKey.substring(0, 8)}...`);
  
  try {
    const mailgun = new Mailgun(formData);
    const client = mailgun.client({
      username: 'api',
      key: apiKey
    });
    
    console.log('🔗 Mailgun client created successfully');
    
    // Send test email
    const messageData = {
      from: `Portfolio Test <noreply@${domain}>`,
      to: 'paulmallner@gmail.com',
      subject: '🧪 Portfolio Contact Form - Mailgun Test',
      text: 'This is a test email from your portfolio contact form using Mailgun. If you receive this, everything is working correctly!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🧪 Mailgun Test Email</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Portfolio Contact Form</p>
          </div>
          
          <div style="padding: 30px;">
            <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 25px; border-left: 5px solid #28a745;">
              <h2 style="margin: 0 0 15px 0; color: #28a745; font-size: 20px;">✅ Test Successful!</h2>
              <p style="margin: 0; color: #333; line-height: 1.6;">
                This is a test email from your portfolio contact form using Mailgun.
                <strong>If you receive this, everything is working correctly!</strong>
              </p>
            </div>
            
            <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
              <h3 style="margin: 0 0 10px 0; color: #007bff;">📊 Test Details:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #333;">
                <li>Domain: ${domain}</li>
                <li>Timestamp: ${new Date().toISOString()}</li>
                <li>Service: Mailgun API</li>
                <li>Status: Successfully sent</li>
              </ul>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              🚀 Sent via Mailgun API | Portfolio Contact Form Test
            </p>
          </div>
        </div>
      `
    };

    const result = await client.messages.create(domain, messageData);
    
    console.log('✅ Test email sent successfully via Mailgun!');
    console.log(`📬 Message ID: ${result.id}`);
    console.log('📧 Check paulmallner@gmail.com for the test message');
    
    if (domain.includes('sandbox')) {
      console.log('\n💡 Note: You\'re using a sandbox domain.');
      console.log('   Make sure paulmallner@gmail.com is added as an authorized recipient.');
    }
    
  } catch (error) {
    console.error('❌ Mailgun test failed:', error.message);
    
    if (error.message.includes('Forbidden')) {
      console.log('\n💡 Troubleshooting:');
      console.log('1. Check your API key is correct (should start with "key-")');
      console.log('2. Verify your domain name is correct');
      console.log('3. If using sandbox, add paulmallner@gmail.com as authorized recipient');
      console.log('4. Make sure your Mailgun account is verified');
    } else if (error.message.includes('Unauthorized')) {
      console.log('\n💡 Troubleshooting:');
      console.log('1. Double-check your API key');
      console.log('2. Make sure you\'re using the Private API key, not Public');
    }
  }
}

testMailgun();