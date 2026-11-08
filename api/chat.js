// Vercel serverless endpoint. Set GEMINI_API_KEY in Vercel environment variables.
const SYSTEM=`You are the helpful, professional assistant on Rose Estrada's design portfolio. Rose is a Philippines-based creative designer who blends creativity, technology, and strategy. Her work includes Zagu promotional campaigns and merchandise, Kalo Gold and Concepcion Iloilo apparel designs, branding, social media, advertising, packaging, motion graphics and UI/UX. Her creative tools are Adobe Photoshop, Adobe Illustrator, Adobe Dimension, Canva, Figma, Framer, and WordPress. Answer questions about her portfolio and design services concisely and warmly. Do not invent prices, availability, years of experience, clients, personal details, or contact addresses. For project inquiries direct visitors to the Contact section of the website. You are an AI assistant, not Rose herself.`;
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 if(!process.env.GEMINI_API_KEY)return res.status(503).json({error:'Chat is not configured yet'});
 const messages=req.body?.messages;
 if(!Array.isArray(messages)||messages.length<1||messages.length>12||messages.some(m=>!['user','model'].includes(m.role)||typeof m.text!=='string'||m.text.length>600))return res.status(400).json({error:'Invalid messages'});
 try{
  const contents=messages.map(m=>({role:m.role,parts:[{text:m.text}]}));
  const upstream=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',{
   method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':process.env.GEMINI_API_KEY},
   body:JSON.stringify({systemInstruction:{parts:[{text:SYSTEM}]},contents,generationConfig:{maxOutputTokens:350,temperature:0.5}})
  });
  if(!upstream.ok)return res.status(502).json({error:'Assistant temporarily unavailable'});
  const data=await upstream.json();
  const reply=(data.candidates?.[0]?.content?.parts||[]).map(p=>p.text||'').join('').trim();
  return res.status(200).json({reply:reply||'Sorry, I could not generate a response. Please try again.'});
 }catch{return res.status(502).json({error:'Assistant temporarily unavailable'})}
}
