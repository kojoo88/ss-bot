export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      
      if (request.method === 'POST') {
        const update = await request.json();
        
        if (update.message && update.message.text === '/start') {
          const chatId = update.message.chat.id;
          const text = '👋 မင်္ဂလာပါ! ကြိုဆိုပါတယ် 😊';
          
          await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: text })
          });
        }
      }
      
      return new Response('OK');
    } catch (err) {
      return new Response(err.message, { status: 500 });
    }
  }
};
