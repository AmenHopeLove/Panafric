import puppeteer from 'puppeteer';
import fs from 'fs';

async function deploy() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log("Navigating to login page...");
  await page.goto("https://drh4.hostwhitelabel.com:2222/evo/login");
  
  console.log("Waiting for network idle...");
  await page.waitForNetworkIdle();
  await page.screenshot({ path: "step1.png" });
  
  // Try to find the username input
  const inputs = await page.$$('input');
  console.log(`Found ${inputs.length} inputs on the page.`);
  for (let input of inputs) {
    const name = await (await input.getProperty('name')).jsonValue();
    const type = await (await input.getProperty('type')).jsonValue();
    console.log(`Input: name=${name}, type=${type}`);
  }
  
  // Fill username and password
  await page.type("input[name=username]", "panafge");
  await page.type("input[name=password]", "Ctu29ltk0@9!;;3U(5K"); // with exclamation mark!
  
  console.log("Filled credentials, taking screenshot step2...");
  await page.screenshot({ path: "step2.png" });
  
  // Press Enter to submit form
  console.log("Pressing Enter...");
  await page.keyboard.press("Enter");
  
  await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(e => console.log("Navigation timeout or error, maybe already loaded: " + e.message));
  
  console.log("Post-login, taking screenshot step3...");
  await page.screenshot({ path: "step3.png" });
  
  // Save page content for analysis
  const content = await page.content();
  fs.writeFileSync("page.html", content);
  
  console.log("Saved page.html, closing browser...");
  await browser.close();
}

deploy().catch(console.error);
