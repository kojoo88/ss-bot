export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/webhook" && request.method === "POST") {
      try {
        const update = await request.json();
        await handleUpdate(update, env);
        return new Response("OK", { status: 200 });
      } catch (e) {
        return new Response("Error", { status: 500 });
      }
    }
    return new Response("✅ Bot အလုပ်လုပ်နေပါတယ်", { status: 200 });
  }
}

function b64Encode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function buildSS(s) {
  const auth = b64Encode(s.method + ":" + s.password);
  return "ss://" + auth + "@" + s.server + ":" + s.server_port + "#" + encodeURIComponent(s.remarks);
}

async function sendMessage(chatId, text, env) {
  const token = env.BOT_TOKEN;
  await fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: "HTML" })
  });
}

async function getServers() {
  const res = await fetch("https://shadowmere.xyz/api/sub/");
  if (!res.ok) throw new Error("API Error");
  return res.json();
}

async function handleUpdate(update, env) {
  if (!update.message || !update.message.text) return;
  const id = update.message.chat.id;
  const text = update.message.text.trim();
  
  try {
    if (text === "/start" || text === "/help") {
      await sendMessage(id, "👋 မင်္ဂလာပါ!\n/get — အားလုံး\n/hk — ဟောင်ကောင်\n/sg — စင်ကာပူ\n/us — အမေရိကန်", env);
    }
    else if (text === "/get") {
      const list = await getServers();
      for (let i = 0; i < Math.min(8, list.length); i++) {
        await sendMessage(id, list[i].remarks + "\n<code>" + buildSS(list[i]) + "</code>", env);
      }
    }
    else if (text === "/hk") {
      const list = await getServers();
      const hk = list.filter(x => x.remarks.indexOf("🇭🇰") >= 0);
      if (!hk.length) return await sendMessage(id, "❌ မတွေ့ပါ", env);
      for (const x of hk) await sendMessage(id, x.remarks + "\n<code>" + buildSS(x) + "</code>", env);
    }
    else if (text === "/sg") {
      const list = await getServers();
      const sg = list.filter(x => x.remarks.indexOf("🇸🇬") >= 0);
      if (!sg.length) return await sendMessage(id, "❌ မတွေ့ပါ", env);
      for (const x of sg) await sendMessage(id, x.remarks + "\n<code>" + buildSS(x) + "</code>", env);
    }
    else if (text === "/us") {
      const list = await getServers();
      const us = list.filter(x => x.remarks.indexOf("🇺🇸") >= 0);
      if (!us.length) return await sendMessage(id, "❌ မတွေ့ပါ", env);
      for (let i = 0; i < Math.min(5, us.length); i++) {
        await sendMessage(id, us[i].remarks + "\n<code>" + buildSS(us[i]) + "</code>", env);
      }
    }
  } catch (e) {
    console.error(e);
  }
                                   }
                          
