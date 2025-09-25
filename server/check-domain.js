#!/usr/bin/env node

require('dotenv').config();
const dns = require('dns').promises;

async function checkDomain() {
  const domain = process.env.MAILGUN_DOMAIN;
  
  if (!domain) {
    console.log('❌ No MAILGUN_DOMAIN found in .env file');
    return;
  }
  
  console.log(`🔍 Checking domain: ${domain}\n`);
  
  if (domain.includes('sandbox')) {
    console.log('📦 You\'re using a sandbox domain');
    console.log('✅ This works for testing but emails come from sandbox address');
    console.log('💡 To use your own domain, see DOMAIN_SETUP.md\n');
    return;
  }
  
  console.log('🌐 Checking DNS records for your custom domain...\n');
  
  try {
    // Check SPF record
    console.log('📧 Checking SPF record...');
    const txtRecords = await dns.resolveTxt(domain);
    const spfRecord = txtRecords.find(record => 
      record.join('').includes('v=spf1') && record.join('').includes('mailgun.org')
    );
    
    if (spfRecord) {
      console.log('✅ SPF record found:', spfRecord.join(''));
    } else {
      console.log('❌ SPF record not found or incorrect');
    }
    
    // Check MX records
    console.log('\n📮 Checking MX records...');
    const mxRecords = await dns.resolveMx(domain);
    const mailgunMx = mxRecords.find(record => 
      record.exchange.includes('mailgun.org')
    );
    
    if (mailgunMx) {
      console.log('✅ Mailgun MX record found:', mailgunMx.exchange);
    } else {
      console.log('❌ Mailgun MX records not found');
      console.log('Found MX records:', mxRecords.map(r => r.exchange));
    }
    
    // Check CNAME
    console.log('\n🔗 Checking CNAME record...');
    try {
      const cnameRecord = await dns.resolveCname(`email.${domain}`);
      if (cnameRecord.includes('mailgun.org')) {
        console.log('✅ Email CNAME record found:', cnameRecord);
      } else {
        console.log('❌ Email CNAME record incorrect:', cnameRecord);
      }
    } catch (error) {
      console.log('❌ Email CNAME record not found');
    }
    
    console.log('\n🎯 Domain Status Summary:');
    if (spfRecord && mailgunMx) {
      console.log('✅ Domain appears to be configured correctly!');
      console.log('🚀 You should be able to send emails from your domain');
    } else {
      console.log('⚠️  Domain configuration incomplete');
      console.log('📖 See DOMAIN_SETUP.md for detailed instructions');
    }
    
  } catch (error) {
    console.log('❌ Error checking domain:', error.message);
    console.log('💡 This might mean DNS records aren\'t set up yet');
    console.log('📖 See DOMAIN_SETUP.md for setup instructions');
  }
}

checkDomain();