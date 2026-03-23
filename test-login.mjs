import fs from 'fs';

async function testLogin() {
  const url = "https://drh4.hostwhitelabel.com:2222/CMD_LOGIN";
  
  // Test password with !
  const params = new URLSearchParams();
  params.append("username", "panafge");
  params.append("password", "Ctu29ltk0@9!;;3U(5K");
  
  try {
    const res = await fetch(url, {
      method: "POST",
      body: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      redirect: "manual"
    });
    
    console.log("--- TEST WITH ! ---");
    console.log("Status:", res.status);
    console.log("Set-Cookie:", res.headers.get("set-cookie"));
    
    // Test password without ! just in case
    const params2 = new URLSearchParams();
    params2.append("username", "panafge");
    params2.append("password", "Ctu29ltk0@9;;3U(5K"); // old pass
    
    const res2 = await fetch(url, {
      method: "POST",
      body: params2,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      redirect: "manual"
    });
    
    console.log("--- TEST WITHOUT ! ---");
    console.log("Status:", res2.status);
    console.log("Set-Cookie:", res2.headers.get("set-cookie"));
    
  } catch (err) {
    console.error("Login Error:", err);
  }
}

testLogin();
