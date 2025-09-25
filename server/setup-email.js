#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Portfolio Contact Form - Mailgun Setup');
console.log('==========================================\n');

console.log('This script will help you configure Mailgun for automatic email sending.\n');

console.log('📧 Mailgun Setup Instructions:');
console.log('1. Sign up for free at https://www.mailgun.com/');
console.log('2. Verify your account (may require phone verification)');
console.log('3. Go to Dashboard > Sending > Domains');
console.log('4. Copy your sandbox domain (e.g., sandbox123abc.mailgun.org)');
console.log('5. Go to Dashboard > Settings > API Keys');
console.log('6. Copy your Private API key (starts with key-...)\n');

console.log('💡 For testing, you can use the sandbox domain.');
console.log('   For production, add and verify your own domain.\n');

rl.question('Enter your Mailgun Domain (e.g., sandbox123abc.mailgun.org): ', (domain) => {
  rl.question('Enter your Mailgun API Key (starts with key-...): ', (apiKey) => {
    
    const envContent = `# Mailgun Configuration for Contact Form
MAILGUN_DOMAIN=${domain}
MAILGUN_API_KEY=${apiKey}

# Generated on ${new Date().toISOString()}
# 
# Note: If using sandbox domain, you need to add paulmallner@gmail.com 
# as an authorized recipient in your Mailgun dashboard.
`;

    const envPath = path.join(__dirname, '.env');
    
    try {
      fs.writeFileSync(envPath, envContent);
      console.log('\n✅ Mailgun configuration saved to .env file');
      
      if (domain.includes('sandbox')) {
        console.log('\n⚠️  IMPORTANT: You\'re using a sandbox domain.');
        console.log('   Add paulmallner@gmail.com as an authorized recipient:');
        console.log('   Dashboard > Sending > Domain Settings > Authorized Recipients');
      }
      
      console.log('\n🔄 Please restart your server to apply the changes');
      console.log('🧪 Run "npm run test-email" to verify the setup');
      console.log('\nYour contact form will now send emails via Mailgun! 🎉');
    } catch (error) {
      console.error('\n❌ Error saving configuration:', error.message);
    }
    
    rl.close();
  });
});