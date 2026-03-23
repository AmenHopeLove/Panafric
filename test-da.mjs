import fs from 'fs';

async function testDA() {
  const username = "panafge";
  const password = "Ctu29ltk0@9!;;3U(5K.";
  const auth = Buffer.from(`${username}:${password}`).toString('base64');
  
  try {
    const res = await fetch("https://drh4.hostwhitelabel.com:2222/CMD_API_SHOW_DOMAINS", {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });
    
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (err) {
    console.error("API Error:", err);
  }
}

testDA();
