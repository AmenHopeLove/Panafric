import puppeteer from 'puppeteer';
import fs from 'fs';

async function tryLogin(password, label) {
  console.log(`--- Testing ${label} ---`);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto("https://drh4.hostwhitelabel.com:2222/evo/login", { waitUntil: 'networkidle2' });
    
    await page.type("input[name=username]", "panafge");
    await page.type("input[name=password]", password);
    
    // Explicitly click the sign-in button
    const submitButton = await page.$('button[type="submit"]');
    if (submitButton) {
      await submitButton.click();
    } else {
      await page.keyboard.press("Enter");
    }
    
    // Wait for navigation or error message
    await new Promise(r => setTimeout(r, 5000));
    
    const url = page.url();
    const content = await page.content();
    const hasError = content.includes("Hmm, login details do not seem to be correct");
    
    console.log(`URL: ${url}`);
    console.log(`Error detected: ${hasError}`);
    
    await page.screenshot({ path: `login_${label}.png` });
    
    return { url, hasError, success: !hasError && url.includes("/evo/") };
  } catch (err) {
    console.error(`Error in ${label}:`, err.message);
    return { success: false };
  } finally {
    await browser.close();
  }
}

async function run() {
  const v1 = await tryLogin("Amen Kingdom1941", "no_spaces");
  if (v1.success) {
    console.log("SUCCESS with no_spaces!");
    return;
  }
  
  const v2 = await tryLogin(" Amen Kingdom1941 ", "with_spaces");
  if (v2.success) {
    console.log("SUCCESS with with_spaces!");
    return;
  }
  
  console.log("Both failed.");
}

run();
