import fs from 'fs';

async function testLoginAdvanced() {
  const url = "https://drh4.hostwhitelabel.com:2222";
  
  try {
    // 1. Get initial cookies
    console.log("GET /evo/login...");
    const res1 = await fetch(`${url}/evo/login`);
    const cookies = res1.headers.get("set-cookie") || "";
    console.log("Initial Cookies:", cookies);
    
    // Extract session if any
    let sessionCookie = cookies.split(";").find(c => c.trim().startsWith("session="));
    if (!sessionCookie) sessionCookie = "";
    
    // 2. Post Login
    console.log("POST /CMD_LOGIN...");
    const params = new URLSearchParams();
    params.append("username", "panafge");
    params.append("password", "garbage_password"); // bad pass
    
    const res2 = await fetch(`${url}/CMD_LOGIN`, {
      method: "POST",
      body: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": sessionCookie,
        "Referer": `${url}/evo/login`
      },
      redirect: "manual"
    });
    
    console.log("Status:", res2.status);
    console.log("Location:", res2.headers.get("location"));
    console.log("Set-Cookie:", res2.headers.get("set-cookie"));
    
  } catch (err) {
    console.error("Login Error:", err);
  }
}

testLoginAdvanced();
