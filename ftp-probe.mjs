import * as ftp from "basic-ftp";

async function probe() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        await client.access({
            host: "drh4.hostwhitelabel.com",
            user: "panafge",
            password: "Ctu29ltk0@9!;;3U(5K",
            secure: false
        });
        console.log("Connected successfully!");
        
        let fileList = await client.list();
        console.log("Root files:", fileList.map(f => f.name));

        if (fileList.some(f => f.name === 'domains')) {
            await client.cd("domains");
            let domainsList = await client.list();
            console.log("Domains:", domainsList.map(f => f.name));
            
            if (domainsList.length > 0) {
                const targetDomain = domainsList.filter(f => f.name !== 'suspended' && f.name !== 'sharedip')[0].name;
                console.log("Targeting domain:", targetDomain);
                await client.cd(targetDomain);
                let domainFiles = await client.list();
                console.log(`Files in ${targetDomain}:`, domainFiles.map(f => f.name));
            }
        }
    } catch (err) {
        console.error("FTP Error:", err);
    }
    client.close();
}

probe();
