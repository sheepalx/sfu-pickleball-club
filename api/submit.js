export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  const {name,email,experience,interests,availability,organize,website}=req.body||{};
  if(website)return res.status(200).json({ok:true}); // honeypot
  if(typeof name!=='string'||!name.trim()||name.length>120||typeof email!=='string'||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254)return res.status(400).json({error:'Please enter a valid name and email.'});
  const levels=['Never played / Beginner','Casual / Intermediate','Advanced / Competitive'];
  const activity=['Casual drop-ins','Beginner lessons','Tournaments / Competitive play','Social events'];
  const times=['Weekday afternoons','Weekday evenings','Weekends','Flexible'];
  const organizers=["Yes, I'm interested!",'Maybe, tell me more','Not right now',''];
  if(!levels.includes(experience)||!Array.isArray(interests)||!interests.length||interests.some(x=>!activity.includes(x))||!Array.isArray(availability)||availability.some(x=>!times.includes(x))||!organizers.includes(organize))return res.status(400).json({error:'Please check your answers and try again.'});
  if(!process.env.SHEETS_WEBHOOK_URL||!process.env.SHEETS_WEBHOOK_SECRET)return res.status(503).json({error:'Signup collection is not configured yet. Please try again later.'});
  try{
    const response=await fetch(process.env.SHEETS_WEBHOOK_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({secret:process.env.SHEETS_WEBHOOK_SECRET,name:name.trim(),email:email.trim(),experience,interests,availability,organize})});
    if(!response.ok)return res.status(502).json({error:'Could not save your signup. Please try again.'});
    const text=await response.text();
    if(!text.includes('"ok":true'))return res.status(502).json({error:'Could not save your signup. Please try again.'});
    return res.status(200).json({ok:true});
  }catch(e){return res.status(502).json({error:'Could not save your signup. Please try again.'})}
}
