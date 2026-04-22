import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, ScatterChart, Scatter, ZAxis, CartesianGrid } from "recharts";

// ── CURRENCIES ────────────────────────────────────────────────────────────────
const CURRENCIES = {
  EUR: { symbol:"€", rate:1,     locale:"de-DE" },
  CZK: { symbol:"Kč",rate:25.2,  locale:"cs-CZ" },
  USD: { symbol:"$", rate:1.08,  locale:"en-US" },
  GBP: { symbol:"£", rate:0.86,  locale:"en-GB" },
};

// ── SETS (replaces BRANDS) ────────────────────────────────────────────────────
const SETS = [
  // Vintage / Base Era
  {n:"Base Set",f:"🔴"},{n:"Base Set 2",f:"🔴"},{n:"Base Set Shadowless",f:"⭐"},
  {n:"Jungle",f:"🌿"},{n:"Fossil",f:"🦴"},{n:"Team Rocket",f:"🌑"},
  {n:"Gym Heroes",f:"🏋️"},{n:"Gym Challenge",f:"🏆"},
  {n:"Neo Genesis",f:"🌟"},{n:"Neo Discovery",f:"🔍"},
  {n:"Neo Revelation",f:"✨"},{n:"Neo Destiny",f:"🌙"},
  {n:"Legendary Collection",f:"🏛️"},{n:"Expedition",f:"🗺️"},
  {n:"Aquapolis",f:"💧"},{n:"Skyridge",f:"☁️"},
  // EX Era
  {n:"EX Ruby & Sapphire",f:"💎"},{n:"EX Sandstorm",f:"🌪️"},
  {n:"EX Dragon",f:"🐉"},{n:"EX Team Magma vs Team Aqua",f:"🌋"},
  {n:"EX FireRed & LeafGreen",f:"🔥"},{n:"EX Deoxys",f:"🌀"},
  {n:"EX Emerald",f:"💚"},{n:"EX Unseen Forces",f:"👁️"},
  {n:"EX Delta Species",f:"🔬"},{n:"EX Legend Maker",f:"📜"},
  {n:"EX Holon Phantoms",f:"👻"},{n:"EX Crystal Guardians",f:"💠"},
  {n:"EX Dragon Frontiers",f:"🐲"},{n:"EX Power Keepers",f:"⚡"},
  // Diamond & Pearl
  {n:"Diamond & Pearl",f:"💎"},{n:"Mysterious Treasures",f:"🗝️"},
  {n:"Secret Wonders",f:"🌺"},{n:"Great Encounters",f:"🤝"},
  {n:"Majestic Dawn",f:"🌅"},{n:"Legends Awakened",f:"⚔️"},
  {n:"Stormfront",f:"⛈️"},{n:"Platinum",f:"🥈"},
  // HeartGold & SoulSilver
  {n:"HeartGold & SoulSilver",f:"💛"},{n:"Unleashed",f:"🔓"},
  {n:"Undaunted",f:"🛡️"},{n:"Triumphant",f:"🏆"},
  // Black & White
  {n:"Black & White",f:"⚫"},{n:"Emerging Powers",f:"⚡"},
  {n:"Noble Victories",f:"🎖️"},{n:"Next Destinies",f:"🌠"},
  {n:"Dark Explorers",f:"🌑"},{n:"Dragons Exalted",f:"🐉"},
  {n:"Boundaries Crossed",f:"🌉"},{n:"Plasma Storm",f:"🌩️"},
  {n:"Plasma Freeze",f:"❄️"},{n:"Plasma Blast",f:"💥"},
  {n:"Legendary Treasures",f:"👑"},
  // XY Era
  {n:"XY",f:"✖️"},{n:"Flashfire",f:"🔥"},{n:"Furious Fists",f:"👊"},
  {n:"Phantom Forces",f:"👻"},{n:"Primal Clash",f:"⚔️"},
  {n:"Roaring Skies",f:"🌪️"},{n:"Ancient Origins",f:"🏺"},
  {n:"BREAKthrough",f:"💥"},{n:"BREAKpoint",f:"🔱"},
  {n:"Fates Collide",f:"🌀"},{n:"Steam Siege",f:"♨️"},
  {n:"Evolutions",f:"🔄"},
  // Sun & Moon
  {n:"Sun & Moon",f:"☀️"},{n:"Guardians Rising",f:"🛡️"},
  {n:"Burning Shadows",f:"🌑"},{n:"Shining Legends",f:"⭐"},
  {n:"Crimson Invasion",f:"🔴"},{n:"Ultra Prism",f:"💜"},
  {n:"Forbidden Light",f:"🚫"},{n:"Celestial Storm",f:"⛈️"},
  {n:"Dragon Majesty",f:"🐉"},{n:"Lost Thunder",f:"⚡"},
  {n:"Team Up",f:"🤝"},{n:"Unbroken Bonds",f:"🔗"},
  {n:"Unified Minds",f:"🧠"},{n:"Hidden Fates",f:"🎭"},
  {n:"Cosmic Eclipse",f:"🌌"},
  // Sword & Shield
  {n:"Sword & Shield",f:"⚔️"},{n:"Rebel Clash",f:"⚡"},
  {n:"Darkness Ablaze",f:"🌑"},{n:"Champion's Path",f:"🏆"},
  {n:"Vivid Voltage",f:"💛"},{n:"Shining Fates",f:"✨"},
  {n:"Battle Styles",f:"🥋"},{n:"Chilling Reign",f:"❄️"},
  {n:"Evolving Skies",f:"🌈"},{n:"Celebrations",f:"🎉"},
  {n:"Fusion Strike",f:"💥"},{n:"Brilliant Stars",f:"⭐"},
  {n:"Astral Radiance",f:"🌟"},{n:"Pokémon GO",f:"📱"},
  {n:"Lost Origin",f:"👁️"},{n:"Silver Tempest",f:"🌪️"},
  {n:"Crown Zenith",f:"👑"},
  // Scarlet & Violet
  {n:"Scarlet & Violet",f:"🔴"},{n:"Paldea Evolved",f:"🌿"},
  {n:"Obsidian Flames",f:"🔥"},{n:"151",f:"#️⃣"},
  {n:"Paradox Rift",f:"⏳"},{n:"Paldean Fates",f:"🌟"},
  {n:"Temporal Forces",f:"⏰"},{n:"Twilight Masquerade",f:"🎭"},
  {n:"Shrouded Fable",f:"📖"},{n:"Stellar Crown",f:"👑"},
  {n:"Surging Sparks",f:"⚡"},{n:"Prismatic Evolutions",f:"🌈"},
  {n:"Other / Promo",f:"🎁"},
];

const SET_COLORS = {
  "Base Set":"#e85d04","Base Set Shadowless":"#f59e0b","Jungle":"#16a34a",
  "Fossil":"#78716c","Team Rocket":"#7c3aed","Neo Genesis":"#0ea5e9",
  "Hidden Fates":"#ec4899","Shining Fates":"#8b5cf6","Celebrations":"#f59e0b",
  "Evolving Skies":"#6366f1","Brilliant Stars":"#c9a84c","151":"#e11d48",
  "Prismatic Evolutions":"#a855f7","Scarlet & Violet":"#dc2626",
  "Crown Zenith":"#ca8a04","Base Set 2":"#ea580c",
};
const sc = s => SET_COLORS[s] || "#6366f1";

// Grades / Conditions
const GRADES     = ["Raw","PSA 1","PSA 2","PSA 3","PSA 4","PSA 5","PSA 6","PSA 7","PSA 8","PSA 9","PSA 10","BGS 9","BGS 9.5","BGS 10","CGC 9","CGC 9.5","CGC 10"];
const STATUSES   = ["listed","sold","holding","grading"];
const MONTHS     = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const NAV        = ["Overview","Inventory","Logistics","P&L","Suppliers","Sales","Intelligence","Wishlist","Pipeline","Calculator"];

const pct         = n => (n * 100).toFixed(1) + "%";
const profRaw     = c => c.askingPrice - c.cost;
const daysBetween = (a,b) => a && b ? Math.round((new Date(b)-new Date(a))/86400000) : null;
const holdDays    = c => {
  if (c.bought && c.soldDate) return daysBetween(c.bought, c.soldDate);
  if (c.bought) return Math.round((Date.now()-new Date(c.bought))/86400000);
  return null;
};

const SC = {
  sold:     { bg:"#1a2f3a", fg:"#3a7bd5" },
  listed:   { bg:"#2a1a0e", fg:"#c9a84c" },
  holding:  { bg:"#1a2a1a", fg:"#5de08a" },
  grading:  { bg:"#1e1230", fg:"#9333ea" },
  preparing:{ bg:"#222222", fg:"#888" },
  "in transit":{ bg:"#2a1a0e", fg:"#c9a84c" },
  delivered:{ bg:"#1a2f3a", fg:"#3a7bd5" },
};

const BASE_INP = { width:"100%", background:"#121212", border:"1px solid #2e2e2e", borderRadius:8, padding:"9px 12px", color:"#f0ebe0", fontSize:14, outline:"none", boxSizing:"border-box" };
const BASE_LBL = { display:"block", fontSize:10, color:"#777", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:5, fontFamily:"'DM Sans',sans-serif" };
const NUM      = { fontFamily:"'IBM Plex Mono',monospace", fontWeight:500 };
const CARD     = { background:"#181818", border:"1px solid #2e2e2e", borderRadius:14, padding:"20px 20px 14px" };
const SH_STYLE = { fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:600, color:"#c9a84c", marginBottom:14 };

// ── PERSISTENCE ───────────────────────────────────────────────────────────────
const LS = "cardvault_data_v1";
function loadData(key, fallback) {
  try { const r=localStorage.getItem(LS); if(!r) return fallback; return JSON.parse(r)[key]??fallback; } catch { return fallback; }
}
function usePersisted(key, fallback) {
  const [val, setVal] = useState(()=>loadData(key,fallback));
  const set = useCallback(upd => {
    setVal(prev => {
      const next = typeof upd==="function" ? upd(prev) : upd;
      try { const r=localStorage.getItem(LS); const all=r?JSON.parse(r):{}; localStorage.setItem(LS,JSON.stringify({...all,[key]:next})); } catch {}
      return next;
    });
  },[key]);
  return [val,set];
}

// ── SEED DATA ─────────────────────────────────────────────────────────────────
const CARDS0 = [
  {id:1,set:"Base Set Shadowless",name:"Charizard",cardNo:"4/102",year:"1999",grade:"PSA 8",cost:1200,askingPrice:2200,status:"listed",bought:"2024-01-10",soldDate:"",supplierId:1,gradingCost:0,marketValue:2400,notes:"Centered, no scratches on holo",tags:["holo","vintage","1st-ed"],photos:[],timeline:[{date:"2024-01-10",type:"bought",note:"Bought at local card fair"},{date:"2024-01-20",type:"offer",note:"Offer €1800 received, declined"}]},
  {id:2,set:"Base Set",name:"Blastoise",cardNo:"2/102",year:"1999",grade:"PSA 9",cost:380,askingPrice:720,status:"sold",bought:"2024-01-18",soldDate:"2024-02-14",supplierId:2,gradingCost:0,marketValue:750,notes:"Near mint, great centering",tags:["holo","vintage"],photos:[],timeline:[{date:"2024-01-18",type:"bought",note:"eBay lot"},{date:"2024-02-14",type:"sold",note:"Sold to German collector €720"}]},
  {id:3,set:"Hidden Fates",name:"Charizard GX",cardNo:"SV49/SV94",year:"2019",grade:"PSA 10",cost:290,askingPrice:580,status:"sold",bought:"2024-02-01",soldDate:"2024-02-28",supplierId:1,gradingCost:25,marketValue:600,notes:"Shiny vault, perfect centering",tags:["shiny","GX","modern"],photos:[],timeline:[{date:"2024-02-01",type:"bought",note:"Local collector"},{date:"2024-02-28",type:"sold",note:"Quick flip, great PSA 10"}]},
  {id:4,set:"Jungle",name:"Scyther",cardNo:"10/64",year:"1999",grade:"PSA 9",cost:85,askingPrice:180,status:"sold",bought:"2024-01-25",soldDate:"2024-03-05",supplierId:3,gradingCost:0,marketValue:185,notes:"Holo, very clean",tags:["holo","vintage"],photos:[],timeline:[{date:"2024-01-25",type:"bought",note:"Bulk lot find"},{date:"2024-03-05",type:"sold",note:"Facebook marketplace"}]},
  {id:5,set:"151",name:"Mew ex",cardNo:"205/165",year:"2023",grade:"PSA 10",cost:95,askingPrice:210,status:"listed",bought:"2024-03-10",soldDate:"",supplierId:2,gradingCost:25,marketValue:220,notes:"Alt art, flawless pull",tags:["alt-art","ex","modern"],photos:[],timeline:[{date:"2024-03-10",type:"bought",note:"Opened from booster box"},{date:"2024-03-25",type:"offer",note:"Offer €180, too low"}]},
  {id:6,set:"Evolving Skies",name:"Umbreon VMAX",cardNo:"215/203",year:"2021",grade:"PSA 10",cost:180,askingPrice:380,status:"sold",bought:"2024-02-10",soldDate:"2024-03-20",supplierId:1,gradingCost:25,marketValue:400,notes:"Alt art rainbow rare",tags:["alt-art","VMAX","rainbow"],photos:[],timeline:[{date:"2024-02-10",type:"bought",note:"Great deal from collector"},{date:"2024-03-20",type:"sold",note:"Best margin this month"}]},
  {id:7,set:"Base Set Shadowless",name:"Venusaur",cardNo:"15/102",year:"1999",grade:"Raw",cost:220,askingPrice:420,status:"holding",bought:"2024-03-18",soldDate:"",supplierId:3,gradingCost:0,marketValue:450,notes:"Sending to PSA soon",tags:["holo","vintage","shadowless"],photos:[],timeline:[{date:"2024-03-18",type:"bought",note:"Estate sale find"}]},
  {id:8,set:"Shining Fates",name:"Pikachu V",cardNo:"SV44/SV122",year:"2021",grade:"PSA 9",cost:45,askingPrice:95,status:"sold",bought:"2024-02-20",soldDate:"2024-04-01",supplierId:2,gradingCost:0,marketValue:100,notes:"Full art, clean",tags:["shiny","V","full-art"],photos:[],timeline:[{date:"2024-02-20",type:"bought",note:"Bought in lot"},{date:"2024-04-01",type:"sold",note:"Quick sale"}]},
  {id:9,set:"Brilliant Stars",name:"Charizard V",cardNo:"017/172",year:"2022",grade:"PSA 10",cost:120,askingPrice:260,status:"listed",bought:"2024-04-05",soldDate:"",supplierId:1,gradingCost:25,marketValue:280,notes:"Alternate full art",tags:["alt-art","V","modern"],photos:[],timeline:[{date:"2024-04-05",type:"bought",note:"From CardShop Prague"}]},
  {id:10,set:"Celebrations",name:"Pikachu",cardNo:"24/25",year:"2021",grade:"PSA 10",cost:65,askingPrice:140,status:"grading",bought:"2024-04-08",soldDate:"",supplierId:3,gradingCost:25,marketValue:150,notes:"25th anniversary, sent to PSA",tags:["promo","modern","anniversary"],photos:[],timeline:[{date:"2024-04-08",type:"bought",note:"Bulk buy"},{date:"2024-04-15",type:"service",note:"Sent to PSA for grading €25"}]},
  {id:11,set:"Neo Genesis",name:"Lugia",cardNo:"9/111",year:"2000",grade:"PSA 7",cost:320,askingPrice:620,status:"listed",bought:"2024-03-22",soldDate:"",supplierId:2,gradingCost:0,marketValue:680,notes:"Holo, light play",tags:["holo","vintage","neo"],photos:[],timeline:[{date:"2024-03-22",type:"bought",note:"Watch list score"}]},
];

const SUPPLIERS0 = [
  {id:1,name:"CardShop Prague",type:"Local Shop",country:"Czech Republic",city:"Prague",email:"cards@cardshop.cz",phone:"+420 777 123 456",reliability:5,avgDiscount:10,notes:"Best local source. Regular stock updates. Good on bulk deals.",tags:["vintage","modern","bulk"]},
  {id:2,name:"Stefan Müller",type:"Private Collector",country:"Germany",city:"Berlin",email:"stefan@example.de",phone:"+49 30 9876543",reliability:4,avgDiscount:8,notes:"Vintage Base Set specialist. Has large collection, sells pieces regularly.",tags:["base-set","vintage","PSA"]},
  {id:3,name:"Jan Novák",type:"Private Collector",country:"Czech Republic",city:"Brno",email:"jan@example.cz",phone:"+420 608 987 654",reliability:5,avgDiscount:15,notes:"Buys bulk lots at auctions. Best source for mixed vintage lots.",tags:["bulk","vintage","lots"]},
];

const WISHLIST0 = [
  {id:1,set:"Base Set Shadowless",name:"Charizard",cardNo:"4/102",year:"1999",targetBuy:800,marketEst:2200,priority:"high",notes:"PSA 7 or better",found:false},
  {id:2,set:"Neo Genesis",name:"Lugia Holo",cardNo:"9/111",year:"2000",targetBuy:200,marketEst:680,priority:"high",notes:"Any PSA grade acceptable",found:false},
  {id:3,set:"151",name:"Charizard ex",cardNo:"006/165",year:"2023",targetBuy:150,marketEst:350,priority:"medium",notes:"Alt art preferred",found:true},
];

const PIPELINE0 = [
  {id:1,set:"Base Set",name:"Charizard Holo",cardNo:"4/102",year:"1999",askingPrice:1800,offerMade:1400,status:"negotiating",supplierId:2,notes:"Seller wants £1600, pushing to 1400",lastContact:"2024-05-10"},
  {id:2,set:"Jungle",name:"Clefable Holo",cardNo:"5/64",year:"1999",askingPrice:120,offerMade:85,status:"interested",supplierId:3,notes:"In lot of 20 cards, negotiating lot price",lastContact:"2024-05-08"},
  {id:3,set:"Evolving Skies",name:"Rayquaza VMAX Alt Art",cardNo:"218/203",year:"2021",askingPrice:580,offerMade:0,status:"tracking",supplierId:1,notes:"Waiting for price to drop",lastContact:"2024-04-30"},
];

const LOGISTICS0 = [
  {id:1,cardId:2,set:"Base Set",name:"Blastoise",carrier:"DPD",trackingNo:"1234567890",from:"Berlin, Germany",to:"Prague, CZ",status:"delivered",sent:"2024-01-20",eta:"2024-01-23",arrived:"2024-01-22",cost:8,insured:true,insuredValue:720,notes:"Tracked, card sleeve + toploader"},
  {id:2,cardId:6,set:"Evolving Skies",name:"Umbreon VMAX",carrier:"DHL",trackingNo:"9876543210",from:"Prague, CZ",to:"Amsterdam, NL",status:"delivered",sent:"2024-03-18",eta:"2024-03-21",arrived:"2024-03-20",cost:12,insured:true,insuredValue:380,notes:"Sold to buyer, sent in rigid mailer"},
  {id:3,cardId:10,set:"Celebrations",name:"Pikachu",carrier:"PSA Vault",trackingNo:"PSA-2024-88776",from:"Prague, CZ",to:"PSA Grading, US",status:"in transit",sent:"2024-04-15",eta:"2024-07-15",arrived:"",cost:35,insured:true,insuredValue:150,notes:"Grading submission, ~90 day turnaround"},
];

// ── PASSWORD AUTH ─────────────────────────────────────────────────────────────
const ADMIN_PASS  = "cardvault2024";
const VIEWER_PASS = "viewonly";

function LoginScreen({ onAuth }) {
  const [pw,setPw]=useState(""); const [err,setErr]=useState(""); const [shake,setShake]=useState(false); const [show,setShow]=useState(false);
  function tryLogin() {
    if(pw===ADMIN_PASS){onAuth("admin");return;} if(pw===VIEWER_PASS){onAuth("viewer");return;}
    setShake(true);setErr("Incorrect password");setPw(""); setTimeout(()=>setShake(false),500);
  }
  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:28 }}>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}`}</style>
      <div style={{ textAlign:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"center", marginBottom:6 }}>
          <div style={{ fontSize:24 }}>🃏</div>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, color:"#c9a84c", letterSpacing:"0.06em" }}>CARD VAULT</span>
        </div>
        <div style={{ fontSize:12, color:"#444" }}>Pokémon Card Portfolio Tracker</div>
      </div>
      <div style={{ animation:shake?"shake 0.4s ease":"none", display:"flex", flexDirection:"column", gap:12, width:280 }}>
        <div style={{ position:"relative" }}>
          <input type={show?"text":"password"} value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&tryLogin()} autoFocus placeholder="Password"
            style={{ width:"100%", background:"#181818", border:`1px solid ${err?"#e85d04":"#2e2e2e"}`, borderRadius:10, padding:"12px 44px 12px 16px", color:"#f0ebe0", fontSize:14, outline:"none", boxSizing:"border-box" }}/>
          <button onClick={()=>setShow(s=>!s)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#555", cursor:"pointer", fontSize:14, padding:0 }}>{show?"🙈":"👁"}</button>
        </div>
        {err&&<div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, color:"#e85d04", textAlign:"center" }}>{err}</div>}
        <button onClick={tryLogin} style={{ background:"#c9a84c", border:"none", borderRadius:10, padding:"11px", color:"#0d0d0d", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"'Syne',sans-serif" }}>Enter</button>
      </div>
    </div>
  );
}

// ── SET DROPDOWN ──────────────────────────────────────────────────────────────
function SetSelect({ value, onChange }) {
  const [open,setOpen]=useState(false); const [q,setQ]=useState(""); const ref=useRef();
  useEffect(()=>{ const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);}; document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h); },[]);
  const filtered=SETS.filter(s=>s.n.toLowerCase().includes(q.toLowerCase()));
  const sel=SETS.find(s=>s.n===value);
  return (
    <div ref={ref} style={{ position:"relative" }}>
      <div onClick={()=>setOpen(o=>!o)} style={{ ...BASE_INP, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", color:value?"#f0ebe0":"#555" }}>
        <span>{sel?`${sel.f} ${sel.n}`:"Select set…"}</span>
        <span style={{ color:"#555", fontSize:10 }}>{open?"▲":"▼"}</span>
      </div>
      {open&&(
        <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, zIndex:999, background:"#181818", border:"1px solid #2e2e2e", borderRadius:10, boxShadow:"0 20px 50px rgba(0,0,0,0.7)", overflow:"hidden" }}>
          <div style={{ padding:"8px 10px", borderBottom:"1px solid #222" }}>
            <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search set…" style={{ ...BASE_INP, fontSize:13, padding:"6px 10px" }}/>
          </div>
          <div style={{ maxHeight:220, overflowY:"auto" }}>
            {filtered.map(s=>(
              <div key={s.n} onClick={()=>{onChange(s.n);setOpen(false);setQ("");}}
                style={{ padding:"9px 14px", cursor:"pointer", fontSize:13, display:"flex", gap:8, color:value===s.n?"#c9a84c":"#ccc" }}
                onMouseEnter={e=>e.currentTarget.style.background="#222"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span>{s.f}</span><span>{s.n}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── SHARED UI ─────────────────────────────────────────────────────────────────
function Kpi({ label, value, sub, accent, small, highlight }) {
  return (
    <div style={{ ...CARD, padding:"18px 20px", background:highlight?"#1a1808":"#181818", borderColor:highlight?"#3a3010":"#2e2e2e" }}>
      <div style={{ fontSize:10, color:"#555", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:7 }}>{label}</div>
      <div style={{ ...NUM, fontSize:small?17:22, color:accent||"#f0ebe0", lineHeight:1, letterSpacing:"-0.02em" }}>{value}</div>
      {sub&&<div style={{ fontSize:11, color:"#555", marginTop:5 }}>{sub}</div>}
    </div>
  );
}
function Stars({ n }) { return <span>{[1,2,3,4,5].map(i=><span key={i} style={{ color:i<=n?"#c9a84c":"#222", fontSize:12 }}>★</span>)}</span>; }
function Badge({ status }) { const s=SC[status]||SC.listed; return <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:s.bg, color:s.fg, whiteSpace:"nowrap" }}>{status}</span>; }
function TH({ children }) { return <th style={{ padding:"10px 14px", textAlign:"left", color:"#555", fontWeight:500, fontSize:10, textTransform:"uppercase", letterSpacing:"0.08em" }}>{children}</th>; }
function TD({ children, mono, accent, dim, bold }) { return <td style={{ padding:"10px 14px", ...(mono?NUM:{}), color:accent||(dim?"#666":"#ccc"), fontWeight:bold?600:400, fontSize:mono?11:12 }}>{children}</td>; }
function ChartTip({ active, payload, label }) {
  if(!active||!payload?.length) return null;
  return <div style={{ background:"#181818", border:"1px solid #2e2e2e", borderRadius:10, padding:"10px 14px", fontSize:12 }}>
    {label&&<div style={{ color:"#555", marginBottom:4 }}>{label}</div>}
    {payload.map((p,i)=><div key={i} style={{ ...NUM, color:p.color||"#c9a84c" }}>{p.name}: {typeof p.value==="number"&&Math.abs(p.value)>100?"€"+Number(p.value).toLocaleString("de-DE"):p.value+(p.name?.includes("%")?"%":"")}</div>)}
  </div>;
}

// ── CARD MODAL ────────────────────────────────────────────────────────────────
function CardModal({ data, suppliers, onClose, onSave }) {
  const [f,setF]=useState(data||{set:"",name:"",cardNo:"",year:"",grade:"Raw",cost:"",askingPrice:"",status:"listed",bought:"",soldDate:"",supplierId:"",gradingCost:"",marketValue:"",notes:"",tags:"",photos:[],timeline:[]});
  const u=(k,v)=>setF(p=>({...p,[k]:v}));
  const fileRef=useRef();
  const np=f.cost&&f.askingPrice?Number(f.askingPrice)-Number(f.cost)-Number(f.gradingCost||0):null;
  const nm=np!==null&&Number(f.cost)>0?np/Number(f.cost):null;
  const handlePhoto=e=>{Array.from(e.target.files).forEach(file=>{const r=new FileReader();r.onload=ev=>setF(p=>({...p,photos:[...(p.photos||[]),{name:file.name,data:ev.target.result}]}));r.readAsDataURL(file);});};
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#181818", border:"1px solid #2e2e2e", borderRadius:18, padding:"28px", width:580, maxWidth:"100%", maxHeight:"92vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:600 }}>{data?"Edit Card":"Add Card"}</span>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#555", fontSize:22, cursor:"pointer" }}>×</button>
        </div>
        <div style={{ marginBottom:12 }}><label style={BASE_LBL}>Set</label><SetSelect value={f.set} onChange={v=>u("set",v)}/></div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11 }}>
          {[["name","Card Name"],["cardNo","Card Number"],["year","Year"]].map(([k,l])=>(
            <div key={k}><label style={BASE_LBL}>{l}</label><input value={f[k]||""} onChange={e=>u(k,e.target.value)} style={BASE_INP} placeholder={k==="cardNo"?"e.g. 4/102":k==="year"?"e.g. 1999":""}/></div>
          ))}
          <div><label style={BASE_LBL}>Grade</label><select value={f.grade} onChange={e=>u("grade",e.target.value)} style={BASE_INP}>{GRADES.map(g=><option key={g}>{g}</option>)}</select></div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:11, marginTop:11 }}>
          <div><label style={BASE_LBL}>Buy Cost (€)</label><input value={f.cost||""} onChange={e=>u("cost",e.target.value)} type="number" style={BASE_INP} placeholder="0"/></div>
          <div><label style={BASE_LBL}>Asking Price (€)</label><input value={f.askingPrice||""} onChange={e=>u("askingPrice",e.target.value)} type="number" style={BASE_INP} placeholder="0"/></div>
          <div><label style={BASE_LBL}>Grading Cost (€)</label><input value={f.gradingCost||""} onChange={e=>u("gradingCost",e.target.value)} type="number" style={BASE_INP} placeholder="0"/></div>
        </div>
        <div style={{ marginTop:11 }}><label style={BASE_LBL}>Market Value (€)</label><input value={f.marketValue||""} onChange={e=>u("marketValue",e.target.value)} type="number" style={BASE_INP} placeholder="Current market estimate"/></div>
        {np!==null&&(
          <div style={{ background:"#121212", border:"1px solid #2e2e2e", borderRadius:8, padding:"10px 14px", marginTop:10, display:"flex", gap:20 }}>
            <span style={{ fontSize:12, color:"#777" }}>Net profit: <strong style={{ ...NUM, color:np>=0?"#5de08a":"#e85d04" }}>€{Number(np).toLocaleString("de-DE")}</strong></span>
            <span style={{ fontSize:12, color:"#777" }}>Margin: <strong style={{ ...NUM, color:"#c9a84c" }}>{nm!==null?pct(nm):"—"}</strong></span>
          </div>
        )}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11, marginTop:11 }}>
          <div><label style={BASE_LBL}>Status</label><select value={f.status} onChange={e=>u("status",e.target.value)} style={BASE_INP}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select></div>
          <div><label style={BASE_LBL}>Supplier</label><select value={f.supplierId||""} onChange={e=>u("supplierId",Number(e.target.value))} style={BASE_INP}><option value="">— none —</option>{suppliers.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          <div><label style={BASE_LBL}>Date Bought</label><input value={f.bought||""} onChange={e=>u("bought",e.target.value)} type="date" style={BASE_INP}/></div>
          {f.status==="sold"&&<div><label style={BASE_LBL}>Date Sold</label><input value={f.soldDate||""} onChange={e=>u("soldDate",e.target.value)} type="date" style={BASE_INP}/></div>}
        </div>
        <div style={{ marginTop:11 }}><label style={BASE_LBL}>Tags (comma separated)</label><input value={typeof f.tags==="string"?f.tags:(f.tags||[]).join(", ")} onChange={e=>u("tags",e.target.value)} style={BASE_INP} placeholder="holo, 1st-ed, shadowless, alt-art…"/></div>
        <div style={{ marginTop:11 }}><label style={BASE_LBL}>Notes</label><textarea value={f.notes||""} onChange={e=>u("notes",e.target.value)} rows={2} style={{ ...BASE_INP, resize:"vertical", fontFamily:"inherit" }}/></div>
        <div style={{ marginTop:14 }}>
          <label style={BASE_LBL}>Photos</label>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:8 }}>
            {(f.photos||[]).map((p,i)=>(
              <div key={i} style={{ position:"relative" }}>
                <img src={p.data} alt={p.name} style={{ width:72, height:72, objectFit:"cover", borderRadius:8, border:"1px solid #2e2e2e" }}/>
                <button onClick={()=>setF(pr=>({...pr,photos:pr.photos.filter((_,j)=>j!==i)}))} style={{ position:"absolute", top:-6, right:-6, background:"#e85d04", border:"none", borderRadius:"50%", width:18, height:18, color:"#fff", fontSize:11, cursor:"pointer", lineHeight:"18px", textAlign:"center" }}>×</button>
              </div>
            ))}
            <button onClick={()=>fileRef.current?.click()} style={{ width:72, height:72, borderRadius:8, border:"1px dashed #2e2e2e", background:"#121212", color:"#555", fontSize:22, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={handlePhoto} style={{ display:"none" }}/>
        </div>
        <div style={{ display:"flex", gap:10, marginTop:20, justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{ background:"none", border:"1px solid #2e2e2e", borderRadius:8, padding:"8px 18px", color:"#666", fontSize:13, cursor:"pointer" }}>Cancel</button>
          <button onClick={()=>onSave({...f,cost:Number(f.cost),askingPrice:Number(f.askingPrice),gradingCost:Number(f.gradingCost||0),marketValue:Number(f.marketValue||0),id:f.id||Date.now(),tags:typeof f.tags==="string"?f.tags.split(",").map(t=>t.trim()).filter(Boolean):f.tags})}
            style={{ background:"#c9a84c", border:"none", borderRadius:8, padding:"8px 22px", color:"#0d0d0d", fontWeight:700, fontSize:13, cursor:"pointer" }}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ── SUPPLIER MODAL ────────────────────────────────────────────────────────────
function SupplierModal({ data, onClose, onSave }) {
  const [f,setF]=useState(data?{...data,tags:data.tags?.join(", ")||""}:{name:"",type:"Local Shop",country:"",city:"",email:"",phone:"",reliability:3,avgDiscount:0,notes:"",tags:""});
  const u=(k,v)=>setF(p=>({...p,[k]:v}));
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#181818", border:"1px solid #2e2e2e", borderRadius:18, padding:"28px", width:500, maxWidth:"100%", maxHeight:"92vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:600 }}>{data?"Edit Supplier":"Add Supplier"}</span>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#555", fontSize:22, cursor:"pointer" }}>×</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11 }}>
          <div style={{ gridColumn:"span 2" }}><label style={BASE_LBL}>Name</label><input value={f.name} onChange={e=>u("name",e.target.value)} style={BASE_INP}/></div>
          <div><label style={BASE_LBL}>Type</label><select value={f.type} onChange={e=>u("type",e.target.value)} style={BASE_INP}>{["Local Shop","Private Collector","Online Seller","Convention","Auction House","Other"].map(t=><option key={t}>{t}</option>)}</select></div>
          <div><label style={BASE_LBL}>Country</label><input value={f.country} onChange={e=>u("country",e.target.value)} style={BASE_INP}/></div>
          <div><label style={BASE_LBL}>City</label><input value={f.city} onChange={e=>u("city",e.target.value)} style={BASE_INP}/></div>
          <div><label style={BASE_LBL}>Email</label><input value={f.email} onChange={e=>u("email",e.target.value)} type="email" style={BASE_INP}/></div>
          <div><label style={BASE_LBL}>Phone</label><input value={f.phone} onChange={e=>u("phone",e.target.value)} style={BASE_INP}/></div>
          <div><label style={BASE_LBL}>Reliability (1–5)</label><input value={f.reliability} onChange={e=>u("reliability",Math.min(5,Math.max(1,Number(e.target.value))))} type="number" min={1} max={5} style={BASE_INP}/></div>
          <div><label style={BASE_LBL}>Avg Discount %</label><input value={f.avgDiscount} onChange={e=>u("avgDiscount",Number(e.target.value))} type="number" style={BASE_INP}/></div>
          <div style={{ gridColumn:"span 2" }}><label style={BASE_LBL}>Specialties</label><input value={f.tags} onChange={e=>u("tags",e.target.value)} style={BASE_INP} placeholder="vintage, PSA, bulk, modern…"/></div>
          <div style={{ gridColumn:"span 2" }}><label style={BASE_LBL}>Notes</label><textarea value={f.notes} onChange={e=>u("notes",e.target.value)} rows={3} style={{ ...BASE_INP, resize:"vertical", fontFamily:"inherit" }}/></div>
        </div>
        <div style={{ display:"flex", gap:10, marginTop:20, justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{ background:"none", border:"1px solid #2e2e2e", borderRadius:8, padding:"8px 18px", color:"#666", fontSize:13, cursor:"pointer" }}>Cancel</button>
          <button onClick={()=>onSave({...f,reliability:Number(f.reliability),avgDiscount:Number(f.avgDiscount),id:f.id||Date.now(),tags:f.tags.split(",").map(t=>t.trim()).filter(Boolean)})}
            style={{ background:"#c9a84c", border:"none", borderRadius:8, padding:"8px 22px", color:"#0d0d0d", fontWeight:700, fontSize:13, cursor:"pointer" }}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ── TIMELINE MODAL ────────────────────────────────────────────────────────────
function TimelineModal({ card, onClose, onSave }) {
  const [timeline,setTimeline]=useState(card.timeline||[]);
  const [note,setNote]=useState(""); const [type,setType]=useState("note"); const [date,setDate]=useState(new Date().toISOString().slice(0,10));
  const TYPES=["note","offer","bought","sold","grading","received","negotiation"];
  const TC={note:"#666",offer:"#c9a84c",bought:"#3a7bd5",sold:"#5de08a",grading:"#9333ea",received:"#5de08a",negotiation:"#f59e0b"};
  const add=()=>{if(!note.trim())return;const e={date,type,note:note.trim()};setTimeline(t=>[...t,e].sort((a,b)=>new Date(a.date)-new Date(b.date)));setNote("");};
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#181818", border:"1px solid #2e2e2e", borderRadius:18, padding:"28px", width:560, maxWidth:"100%", maxHeight:"92vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:600 }}>Note Timeline</div>
            <div style={{ fontSize:11, color:"#666", marginTop:2 }}>{card.name} · {card.set} · {card.cardNo}</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#555", fontSize:22, cursor:"pointer" }}>×</button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:0, marginBottom:20 }}>
          {timeline.length===0&&<div style={{ color:"#555", fontSize:12, padding:"20px 0" }}>No entries yet.</div>}
          {[...timeline].reverse().map((e,i,arr)=>(
            <div key={i} style={{ display:"flex", gap:14, paddingBottom:16 }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                <div style={{ width:9, height:9, borderRadius:"50%", background:TC[e.type]||"#555", marginTop:2 }}/>
                {i<arr.length-1&&<div style={{ width:1, flex:1, background:"#1e1e1e", marginTop:4 }}/>}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:2 }}>
                  <span style={{ fontSize:10, padding:"1px 7px", borderRadius:20, background:"#1e1e1e", color:TC[e.type]||"#555" }}>{e.type}</span>
                  <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:"#444" }}>{e.date}</span>
                </div>
                <div style={{ fontSize:12, color:"#bbb" }}>{e.note}</div>
              </div>
              <button onClick={()=>setTimeline(t=>t.filter((_,j)=>j!==timeline.length-1-i))} style={{ background:"none", border:"none", color:"#333", fontSize:16, cursor:"pointer", alignSelf:"flex-start" }}>×</button>
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid #2e2e2e", paddingTop:16 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
            <div><label style={BASE_LBL}>Type</label><select value={type} onChange={e=>setType(e.target.value)} style={BASE_INP}>{TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
            <div><label style={BASE_LBL}>Date</label><input value={date} onChange={e=>setDate(e.target.value)} type="date" style={BASE_INP}/></div>
          </div>
          <div style={{ marginBottom:10 }}><label style={BASE_LBL}>Note</label><input value={note} onChange={e=>setNote(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="Offer received €250, buyer from Berlin…" style={BASE_INP}/></div>
          <button onClick={add} style={{ background:"#222", border:"1px solid #2e2e2e", borderRadius:8, padding:"8px 16px", color:"#c9a84c", fontSize:13, cursor:"pointer", width:"100%" }}>+ Add Entry</button>
        </div>
        <div style={{ display:"flex", gap:10, marginTop:16, justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{ background:"none", border:"1px solid #2e2e2e", borderRadius:8, padding:"8px 18px", color:"#666", fontSize:13, cursor:"pointer" }}>Cancel</button>
          <button onClick={()=>onSave({...card,timeline})} style={{ background:"#c9a84c", border:"none", borderRadius:8, padding:"8px 22px", color:"#0d0d0d", fontWeight:700, fontSize:13, cursor:"pointer" }}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ── CARD DETAIL DRAWER ────────────────────────────────────────────────────────
function CardDrawer({ card, suppliers, onClose, onEdit, onDuplicate, onDelete }) {
  const sup=suppliers.find(s=>s.id===card.supplierId);
  const np=card.askingPrice-card.cost-(card.gradingCost||0);
  const nm=card.cost>0?np/card.cost:0;
  const hd=holdDays(card);
  const TC={note:"#666",offer:"#c9a84c",bought:"#3a7bd5",sold:"#5de08a",grading:"#9333ea",received:"#5de08a",negotiation:"#f59e0b"};
  return (
    <div style={{ position:"fixed", inset:0, zIndex:500, display:"flex" }} onClick={onClose}>
      <div style={{ flex:1 }}/>
      <div onClick={e=>e.stopPropagation()} style={{ width:420, maxWidth:"95vw", height:"100vh", background:"#141414", borderLeft:"1px solid #2e2e2e", overflowY:"auto" }}>
        <div style={{ padding:"20px 22px 16px", borderBottom:"1px solid #1e1e1e", position:"sticky", top:0, background:"#141414", zIndex:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <span style={{ fontSize:18 }}>{SETS.find(s=>s.n===card.set)?.f||"🃏"}</span>
                <span style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:700 }}>{card.name}</span>
              </div>
              <div style={{ fontSize:13, color:"#888", marginBottom:3 }}>{card.set}</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, color:"#666" }}>{card.cardNo}</span>
                <span style={{ fontSize:11, color:"#555" }}>·</span>
                <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, color:"#666" }}>{card.year}</span>
                <span style={{ fontSize:11, color:"#555" }}>·</span>
                <span style={{ fontSize:11, color:"#9333ea" }}>{card.grade}</span>
              </div>
            </div>
            <button onClick={onClose} style={{ background:"none", border:"none", color:"#555", fontSize:22, cursor:"pointer" }}>×</button>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:12 }}>
            <button onClick={onEdit} style={{ background:"#c9a84c", border:"none", borderRadius:8, padding:"6px 14px", color:"#0d0d0d", fontWeight:700, fontSize:12, cursor:"pointer" }}>Edit</button>
            <button onClick={onDuplicate} style={{ background:"none", border:"1px solid #2e2e2e", borderRadius:8, padding:"6px 14px", color:"#888", fontSize:12, cursor:"pointer" }}>Duplicate</button>
            <button onClick={onDelete} style={{ background:"none", border:"1px solid #3a1a1a", borderRadius:8, padding:"6px 14px", color:"#e85d04", fontSize:12, cursor:"pointer", marginLeft:"auto" }}>🗑 Delete</button>
          </div>
        </div>
        <div style={{ padding:"20px 22px", display:"flex", flexDirection:"column", gap:20 }}>
          {card.photos?.length>0&&(
            <div>
              <div style={{ fontSize:10, color:"#555", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>Photos</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>{card.photos.map((p,i)=><img key={i} src={p.data} alt="" style={{ width:90, height:90, objectFit:"cover", borderRadius:8, border:"1px solid #2e2e2e" }}/>)}</div>
            </div>
          )}
          <div>
            <div style={{ fontSize:10, color:"#555", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>Financials</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {[["Buy Cost",`€${card.cost.toLocaleString("de-DE")}`,"#f0ebe0"],["Asking Price",`€${card.askingPrice.toLocaleString("de-DE")}`,"#c9a84c"],["Grading Cost",card.gradingCost?`€${card.gradingCost.toLocaleString("de-DE")}`:"—","#9333ea"],["Net Profit",`€${np.toLocaleString("de-DE")}`,np>=0?"#5de08a":"#e85d04"],["Margin",pct(nm),nm>=0.15?"#5de08a":nm>=0.05?"#c9a84c":"#e85d04"],["Market Value",card.marketValue?`€${card.marketValue.toLocaleString("de-DE")}`:"—","#3a7bd5"]].map(([l,v,c])=>(
                <div key={l} style={{ background:"#1a1a1a", borderRadius:8, padding:"10px 12px" }}>
                  <div style={{ fontSize:10, color:"#555", marginBottom:4 }}>{l}</div>
                  <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:14, color:c }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:10, color:"#555", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>Details</div>
            {[["Supplier",sup?.name||"—"],["Date Bought",card.bought||"—"],["Date Sold",card.soldDate||"—"],["Hold Days",hd?hd+"d":"—"],["Tags",(Array.isArray(card.tags)?card.tags:card.tags?.split(",")||[]).filter(Boolean).join(", ")||"—"]].map(([l,v])=>(
              <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #1a1a1a" }}>
                <span style={{ fontSize:12, color:"#555" }}>{l}</span>
                <span style={{ fontSize:11, color:"#ccc", fontFamily:"'IBM Plex Mono',monospace" }}>{v}</span>
              </div>
            ))}
          </div>
          {card.notes&&<div><div style={{ fontSize:10, color:"#555", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>Notes</div><div style={{ fontSize:13, color:"#aaa", lineHeight:1.6, background:"#1a1a1a", borderRadius:8, padding:"12px 14px" }}>{card.notes}</div></div>}
          {card.timeline?.length>0&&(
            <div>
              <div style={{ fontSize:10, color:"#555", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>Timeline</div>
              {[...card.timeline].reverse().map((e,i,arr)=>(
                <div key={i} style={{ display:"flex", gap:12, paddingBottom:14 }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                    <div style={{ width:9, height:9, borderRadius:"50%", background:TC[e.type]||"#555", marginTop:2 }}/>
                    {i<arr.length-1&&<div style={{ width:1, flex:1, background:"#1e1e1e", marginTop:4 }}/>}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:2 }}>
                      <span style={{ fontSize:10, padding:"1px 7px", borderRadius:20, background:"#1e1e1e", color:TC[e.type]||"#555" }}>{e.type}</span>
                      <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:"#444" }}>{e.date}</span>
                    </div>
                    <div style={{ fontSize:12, color:"#bbb" }}>{e.note}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── CSV EXPORT ────────────────────────────────────────────────────────────────
function exportCSV(cards, suppliers) {
  const h=["ID","Set","Card Name","Card No.","Year","Grade","Buy Cost","Asking Price","Grading Cost","Net Profit","Margin %","Status","Bought","Sold Date","Hold Days","Market Value","Supplier","Tags","Notes"];
  const rows=cards.map(c=>{
    const np=c.askingPrice-c.cost-(c.gradingCost||0), nm=c.cost>0?((np/c.cost)*100).toFixed(1):"", sup=suppliers.find(s=>s.id===c.supplierId), hd=holdDays(c);
    return [c.id,c.set,c.name,c.cardNo,c.year,c.grade,c.cost,c.askingPrice,c.gradingCost||0,np,nm,c.status,c.bought,c.soldDate||"",hd||"",c.marketValue||"",sup?.name||"",(Array.isArray(c.tags)?c.tags.join(";"):c.tags||""),c.notes||""].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",");
  });
  const csv=[h.join(","),...rows].join("\n");
  const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"})); a.download="cardvault-export.csv"; a.click();
}

// ── MARKET CALCULATOR ─────────────────────────────────────────────────────────
function MarketCalculator({ cards, sold, netProf, netMarg, fmtC, pct, currency }) {
  const [query,setQuery]=useState(""); const [buyCost,setBuy]=useState(""); const [gradeCost,setGrade]=useState(""); const [targetPct,setTarget]=useState("20");
  const [loading,setLoading]=useState(false); const [result,setResult]=useState(null); const [error,setError]=useState(""); const [searched,setSearched]=useState(false);
  const totalCost=(Number(buyCost)||0)+(Number(gradeCost)||0);
  const targetSell=totalCost>0?totalCost*(1+Number(targetPct)/100):0;
  const comparables=useMemo(()=>{if(!query.trim())return[];const q=query.toLowerCase();return cards.filter(c=>`${c.set} ${c.name} ${c.cardNo}`.toLowerCase().includes(q)).slice(0,6);},[query,cards]);

  async function search() {
    if(!query.trim())return; setLoading(true);setError("");setResult(null);setSearched(true);
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        model:"claude-sonnet-4-20250514",max_tokens:1200,
        tools:[{type:"web_search_20250305",name:"web_search"}],
        system:`You are a Pokémon card market analyst. Search for current market prices for the given card. Look at eBay sold listings, TCGPlayer, CardMarket, PSA registry, PriceCharting, and Reddit r/PokemonTCG. Return ONLY a valid JSON object, no other text:
{"cardName":"string","priceRange":{"low":number,"high":number},"avgPrice":number,"confidence":"low|medium|high","sources":[{"name":"string","price":number,"grade":"string","url":"string","date":"string"}],"marketNotes":"string","gradePremiums":{"Raw":0,"PSA 7":40,"PSA 8":80,"PSA 9":150,"PSA 10":300,"BGS 9.5":250}}
All prices in EUR.`,
        messages:[{role:"user",content:`Search Pokémon card market prices: ${query}. Find recent sold prices on eBay, TCGPlayer, CardMarket, PriceCharting. Return only the JSON.`}]
      })});
      const data=await res.json();
      const text=data.content.filter(b=>b.type==="text").map(b=>b.text).join("");
      const match=text.match(/\{[\s\S]*\}/);
      if(match)setResult(JSON.parse(match[0]));
      else setError("Could not parse results. Try a more specific search.");
    } catch(e){setError("Search failed. Check connection and try again.");}
    setLoading(false);
  }

  const gradeAdj=(base,grade)=>result?.gradePremiums?.[grade]!==undefined?Math.round(base*(1+(result.gradePremiums[grade]/100))):null;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700, margin:"0 0 6px" }}>Market Calculator</h1>
        <div style={{ fontSize:12, color:"#666" }}>Search live prices across eBay, TCGPlayer, CardMarket & PSA registry. Compare against your costs.</div>
      </div>
      <div style={CARD}>
        <div style={SH_STYLE}>Card + Cost</div>
        <div style={{ display:"grid", gridTemplateColumns:"3fr 1fr 1fr 1fr", gap:12, marginBottom:14 }}>
          <div><label style={BASE_LBL}>Card Name or Set + Number</label><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()} placeholder="Charizard Base Set 4/102, Pikachu 25th…" style={BASE_INP}/></div>
          <div><label style={BASE_LBL}>Buy Cost ({currency})</label><input value={buyCost} onChange={e=>setBuy(e.target.value)} type="number" placeholder="0" style={BASE_INP}/></div>
          <div><label style={BASE_LBL}>Grading Cost ({currency})</label><input value={gradeCost} onChange={e=>setGrade(e.target.value)} type="number" placeholder="0" style={BASE_INP}/></div>
          <div><label style={BASE_LBL}>Target Margin %</label><input value={targetPct} onChange={e=>setTarget(e.target.value)} type="number" placeholder="20" style={BASE_INP}/></div>
        </div>
        <button onClick={search} disabled={!query.trim()||loading}
          style={{ background:loading||!query.trim()?"#222":"#c9a84c", border:"none", borderRadius:8, padding:"9px 22px", color:loading||!query.trim()?"#555":"#0d0d0d", fontWeight:700, fontSize:13, cursor:loading?"default":"pointer", display:"inline-flex", alignItems:"center", gap:8 }}>
          {loading?<><span style={{ display:"inline-block",width:13,height:13,border:"2px solid #555",borderTopColor:"#c9a84c",borderRadius:"50%",animation:"spin 0.8s linear infinite" }}/>Searching markets…</>:"🔍 Search Market Prices"}
        </button>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
      {totalCost>0&&(
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
          {[["Total Cost",totalCost,"#888"],["Break Even",totalCost,"#666"],["Target Sell",targetSell,"#c9a84c"],["Target Profit",targetSell-totalCost,"#5de08a"]].map(([l,v,c])=>(
            <div key={l} style={{ ...CARD, padding:"16px 18px" }}>
              <div style={{ fontSize:10, color:"#555", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>{l}</div>
              <div style={{ ...NUM, fontSize:18, color:c }}>€{Number(v).toLocaleString("de-DE")}</div>
            </div>
          ))}
        </div>
      )}
      {comparables.length>0&&(
        <div style={CARD}>
          <div style={SH_STYLE}>From Your Collection ({comparables.length} matches)</div>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead><tr style={{ borderBottom:"1px solid #222" }}>{["Card","Set","No.","Grade","Cost","Ask/Sold","Net Profit","Margin","Status"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
            <tbody>
              {comparables.map(c=>(
                <tr key={c.id} style={{ borderBottom:"1px solid #161616" }}>
                  <td style={{ padding:"9px 12px", color:"#ccc" }}>{c.name}</td>
                  <TD dim>{c.set}</TD>
                  <TD mono dim>{c.cardNo}</TD>
                  <td style={{ padding:"9px 12px", color:"#9333ea", fontSize:11 }}>{c.grade}</td>
                  <TD mono>€{c.cost.toLocaleString("de-DE")}</TD>
                  <td style={{ padding:"9px 12px", ...NUM, color:"#c9a84c" }}>€{c.askingPrice.toLocaleString("de-DE")}</td>
                  <td style={{ padding:"9px 12px", ...NUM, color:netProf(c)>=0?"#5de08a":"#e85d04", fontWeight:600 }}>€{netProf(c).toLocaleString("de-DE")}</td>
                  <td style={{ padding:"9px 12px", ...NUM, color:netMarg(c)>=0.15?"#5de08a":netMarg(c)>=0.05?"#c9a84c":"#e85d04" }}>{pct(netMarg(c))}</td>
                  <td style={{ padding:"9px 12px" }}><Badge status={c.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {error&&<div style={{ ...CARD, borderColor:"#3a1010", background:"#1a0808", color:"#e85d04", fontSize:13 }}>{error}</div>}
      {result&&(
        <>
          <div style={CARD}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:600, marginBottom:4 }}>{result.cardName}</div>
                <div style={{ fontSize:12, color:"#777", lineHeight:1.5 }}>{result.marketNotes}</div>
              </div>
              <span style={{ fontSize:10, padding:"3px 10px", borderRadius:20, background:result.confidence==="high"?"#1a2a1a":result.confidence==="medium"?"#2a1a0e":"#222", color:result.confidence==="high"?"#5de08a":result.confidence==="medium"?"#c9a84c":"#888", flexShrink:0, marginLeft:12 }}>{result.confidence} confidence</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:14 }}>
              {[["Market Low",result.priceRange?.low||0,"#888"],["Avg Price",result.avgPrice||0,"#c9a84c"],["Market High",result.priceRange?.high||0,"#5de08a"]].map(([l,v,c])=>(
                <div key={l} style={{ background:"#121212", borderRadius:10, padding:"14px 16px", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:"#555", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>{l}</div>
                  <div style={{ ...NUM, fontSize:20, color:c }}>€{Number(v).toLocaleString("de-DE")}</div>
                </div>
              ))}
            </div>
            {totalCost>0&&result.avgPrice&&(
              <div style={{ background:"#121212", borderRadius:10, padding:"14px 16px", marginBottom:14, display:"flex", gap:24, flexWrap:"wrap" }}>
                <span style={{ fontSize:12, color:"#777" }}>At avg: <strong style={{ ...NUM, color:(result.avgPrice-totalCost)>=0?"#5de08a":"#e85d04" }}>€{(result.avgPrice-totalCost).toLocaleString("de-DE")} profit</strong></span>
                <span style={{ fontSize:12, color:"#777" }}>Margin: <strong style={{ ...NUM, color:"#c9a84c" }}>{totalCost>0?pct((result.avgPrice-totalCost)/totalCost):"—"}</strong></span>
                <span style={{ fontSize:12, color:"#777" }}>vs target: <strong style={{ color:result.avgPrice>=targetSell?"#5de08a":"#e85d04" }}>{result.avgPrice>=targetSell?"✓ achievable":"✗ below target"}</strong></span>
              </div>
            )}
            {result.gradePremiums&&(
              <div>
                <div style={{ fontSize:11, color:"#666", marginBottom:8 }}>Price by grade (from avg €{(result.avgPrice||0).toLocaleString("de-DE")}):</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:8 }}>
                  {["Raw","PSA 7","PSA 8","PSA 9","PSA 10","BGS 9.5"].map(g=>{
                    const adj=gradeAdj(result.avgPrice,g), m=totalCost>0&&adj?((adj-totalCost)/totalCost):null;
                    return (
                      <div key={g} style={{ background:"#121212", borderRadius:8, padding:"10px 8px", textAlign:"center" }}>
                        <div style={{ fontSize:9, color:"#555", marginBottom:4 }}>{g}</div>
                        <div style={{ ...NUM, fontSize:13, color:"#ddd" }}>{adj?`€${adj.toLocaleString("de-DE")}`:"—"}</div>
                        {m!==null&&<div style={{ fontSize:10, color:m>=0.15?"#5de08a":m>=0.05?"#c9a84c":"#e85d04", marginTop:3 }}>{pct(m)}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          {result.sources?.length>0&&(
            <div style={CARD}>
              <div style={SH_STYLE}>Market Sources</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {result.sources.map((s,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"10px 12px", background:"#121212", borderRadius:8 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, color:"#ccc", fontWeight:500 }}>{s.name}</div>
                      <div style={{ fontSize:11, color:"#666", marginTop:2 }}>{s.grade}{s.date?` · ${s.date}`:""}</div>
                    </div>
                    <div style={{ ...NUM, fontSize:16, color:"#c9a84c" }}>€{Number(s.price||0).toLocaleString("de-DE")}</div>
                    {s.url&&s.url.startsWith("http")&&<a href={s.url} target="_blank" rel="noreferrer" style={{ fontSize:11, color:"#3a7bd5", textDecoration:"none", padding:"3px 8px", border:"1px solid #1a2f3a", borderRadius:6 }}>View →</a>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      {searched&&!loading&&!result&&!error&&<div style={{ ...CARD, color:"#555", fontSize:13, textAlign:"center", padding:"30px" }}>No results. Try "Charizard Base Set 4/102" or "Pikachu Hidden Fates SV57".</div>}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function CardVault() {
  const [cards,     setCards]     = usePersisted("cards",     CARDS0);
  const [suppliers, setSuppliers] = usePersisted("suppliers", SUPPLIERS0);
  const [wishlist,  setWishlist]  = usePersisted("wishlist",  WISHLIST0);
  const [pipeline,  setPipeline]  = usePersisted("pipeline",  PIPELINE0);
  const [logistics, setLogistics] = usePersisted("logistics", LOGISTICS0);
  const [tab,       setTab]       = useState("Overview");
  const [role,      setRole]      = useState(null);
  const [currency,  setCurrency]  = useState("EUR");
  const [cm,        setCm]        = useState(null);  // card modal
  const [sm,        setSm]        = useState(null);  // supplier modal
  const [tlm,       setTlm]       = useState(null);  // timeline modal
  const [drawer,    setDrawer]    = useState(null);  // detail drawer
  const [mobileNav, setMobileNav] = useState(false);
  const [search,    setSearch]    = useState("");
  const [fStatus,   setFStatus]   = useState("all");
  const [fSet,      setFSet]      = useState("all");
  const [fGrade,    setFGrade]    = useState("all");
  const [fMargin,   setFMargin]   = useState("0");
  const [fSupplier, setFSupplier] = useState("all");
  const [period,    setPeriod]    = useState("all");
  const [sortCol,   setSortCol]   = useState("bought");
  const [sortDir,   setSortDir]   = useState("desc");
  const [selected,  setSelected]  = useState(new Set());
  const [bulkStatus,setBulkStatus]= useState("");

  const CUR   = CURRENCIES[currency];
  const fmtC  = useCallback(n=>{const c=Math.round(Number(n)*CUR.rate);return CUR.symbol+c.toLocaleString(CUR.locale);},[currency,CUR]);
  const netProf  = useCallback(c=>profRaw(c)-(c.gradingCost||0),[]);
  const netMarg  = useCallback(c=>c.cost>0?netProf(c)/c.cost:0,[netProf]);

  const sold   = useMemo(()=>cards.filter(c=>c.status==="sold"),[cards]);
  const active = useMemo(()=>cards.filter(c=>c.status!=="sold"),[cards]);

  const totalNetProfit  = useMemo(()=>sold.reduce((a,c)=>a+netProf(c),0),[sold,netProf]);
  const totalRevenue    = useMemo(()=>sold.reduce((a,c)=>a+c.askingPrice,0),[sold]);
  const totalGradeCost  = useMemo(()=>cards.reduce((a,c)=>a+(c.gradingCost||0),0),[cards]);
  const avgNetMargin    = useMemo(()=>sold.length?sold.reduce((a,c)=>a+netMarg(c),0)/sold.length:0,[sold,netMarg]);
  const capRisk         = useMemo(()=>active.reduce((a,c)=>a+c.cost,0),[active]);
  const unrealisedPnl   = useMemo(()=>active.reduce((a,c)=>a+(c.marketValue||c.askingPrice)-c.cost-(c.gradingCost||0),0),[active]);
  const avgHold         = useMemo(()=>{const cs=sold.filter(c=>c.bought&&c.soldDate);return cs.length?Math.round(cs.reduce((a,c)=>a+daysBetween(c.bought,c.soldDate),0)/cs.length):0;},[sold]);
  const winRate         = useMemo(()=>sold.length?sold.filter(c=>netMarg(c)>=0.1).length/sold.length:0,[sold,netMarg]);
  const bestFlip        = useMemo(()=>sold.length?sold.reduce((a,b)=>netProf(a)>netProf(b)?a:b):null,[sold,netProf]);
  const worstFlip       = useMemo(()=>sold.length?sold.reduce((a,b)=>netProf(a)<netProf(b)?a:b):null,[sold,netProf]);
  const recentActivity  = useMemo(()=>[...cards].filter(c=>c.bought||c.soldDate).sort((a,b)=>new Date(b.soldDate||b.bought)-new Date(a.soldDate||a.bought)).slice(0,5),[cards]);

  const monthly = useMemo(()=>{
    const map={};
    sold.forEach(c=>{if(!c.soldDate)return;const d=new Date(c.soldDate);const k=`${d.getFullYear()}-${String(d.getMonth()).padStart(2,"0")}`;
      if(!map[k])map[k]={label:MONTHS[d.getMonth()]+"'"+String(d.getFullYear()).slice(2),profit:0,cost:0,month:d.getMonth(),year:d.getFullYear()};
      map[k].profit+=netProf(c);map[k].cost+=c.cost;
    });
    let cum=0;
    return Object.values(map).sort((a,b)=>a.year-b.year||a.month-b.month).map(m=>({...m,cumulative:(cum+=m.profit),marginPct:m.cost?+((m.profit/m.cost)*100).toFixed(1):0}));
  },[sold,netProf]);

  const setStats = useMemo(()=>{
    const map={};
    cards.forEach(c=>{if(!map[c.set])map[c.set]={set:c.set,profit:0,cost:0,sold:0};if(c.status==="sold"){map[c.set].profit+=netProf(c);map[c.set].cost+=c.cost;map[c.set].sold++;}});
    return Object.values(map).map(s=>({...s,avgMarginPct:s.cost?+((s.profit/s.cost)*100).toFixed(1):0})).sort((a,b)=>b.profit-a.profit);
  },[cards,netProf]);

  const supStats = useMemo(()=>suppliers.map(s=>{
    const sw=cards.filter(c=>c.supplierId===s.id), ss=sw.filter(c=>c.status==="sold");
    return{...s,wCount:sw.length,sCount:ss.length,totalP:ss.reduce((a,c)=>a+netProf(c),0),avgM:ss.length?ss.reduce((a,c)=>a+netMarg(c),0)/ss.length:0};
  }),[suppliers,cards,netProf,netMarg]);

  const pnlCards = useMemo(()=>{
    if(period==="all")return sold;
    const cutoff=new Date();cutoff.setMonth(cutoff.getMonth()-Number(period));
    return sold.filter(c=>c.soldDate&&new Date(c.soldDate)>=cutoff);
  },[sold,period]);

  const scatterData = useMemo(()=>sold.filter(c=>c.bought&&c.soldDate).map(c=>({x:daysBetween(c.bought,c.soldDate),y:+(netMarg(c)*100).toFixed(1),z:c.cost,name:`${c.name} ${c.cardNo}`,set:c.set})),[sold,netMarg]);
  const monthlyCount= useMemo(()=>{const map={};sold.forEach(c=>{if(!c.soldDate)return;const m=MONTHS[new Date(c.soldDate).getMonth()];if(!map[m])map[m]={month:m,count:0,profit:0};map[m].count++;map[m].profit+=netProf(c);});return MONTHS.filter(m=>map[m]).map(m=>map[m]);},[sold,netProf]);

  const filtered = useMemo(()=>cards.filter(c=>{
    const q=search.toLowerCase();
    const margin=c.cost>0?netMarg(c):0;
    return(
      (!q||`${c.set} ${c.name} ${c.cardNo} ${c.year} ${c.notes||""}`.toLowerCase().includes(q))&&
      (fStatus==="all"||c.status===fStatus)&&
      (fSet==="all"||c.set===fSet)&&
      (fGrade==="all"||c.grade===fGrade)&&
      (fMargin==="0"||margin>=Number(fMargin))&&
      (fSupplier==="all"||String(c.supplierId)===String(fSupplier))
    );
  }),[cards,search,fStatus,fSet,fGrade,fMargin,fSupplier,netMarg]);

  const saveCard     = f=>{setCards(cs=>f.id&&cs.find(x=>x.id===f.id)?cs.map(x=>x.id===f.id?f:x):[...cs,{...f,timeline:[],photos:[]}]);setCm(null);};
  const saveSupplier = f=>{setSuppliers(ss=>f.id&&ss.find(x=>x.id===f.id)?ss.map(x=>x.id===f.id?f:x):[...ss,f]);setSm(null);};
  const saveTimeline = f=>{setCards(cs=>cs.map(c=>c.id===f.id?f:c));setTlm(null);};
  const deleteCard   = id=>{if(!window.confirm("Delete this card? Cannot be undone."))return;setCards(cs=>cs.filter(c=>c.id!==id));if(drawer?.id===id)setDrawer(null);};
  const deleteSelected=()=>{if(!selected.size)return;if(!window.confirm(`Delete ${selected.size} card${selected.size>1?"s":""}? Cannot be undone.`))return;setCards(cs=>cs.filter(c=>!selected.has(c.id)));setSelected(new Set());};
  const deleteSupplier=id=>{if(!window.confirm("Delete supplier?"))return;setSuppliers(ss=>ss.filter(s=>s.id!==id));};
  const duplicateCard =c=>{setCards(cs=>[...cs,{...c,id:Date.now(),status:"listed",bought:new Date().toISOString().slice(0,10),soldDate:"",timeline:[],photos:[]}]);};
  const applyBulkStatus=()=>{if(!bulkStatus||!selected.size)return;setCards(cs=>cs.map(c=>selected.has(c.id)?{...c,status:bulkStatus,soldDate:bulkStatus==="sold"?new Date().toISOString().slice(0,10):c.soldDate}:c));setSelected(new Set());setBulkStatus("");};
  const toggleSelect   =id=>setSelected(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});
  const toggleSelectAll=ids=>setSelected(s=>s.size===ids.length?new Set():new Set(ids));

  const SORT_FNS={year:(a,b)=>(a.year||"").localeCompare(b.year||""),set:(a,b)=>a.set.localeCompare(b.set),name:(a,b)=>a.name.localeCompare(b.name),grade:(a,b)=>GRADES.indexOf(a.grade)-GRADES.indexOf(b.grade),cost:(a,b)=>a.cost-b.cost,askingPrice:(a,b)=>a.askingPrice-b.askingPrice,netProfit:(a,b)=>netProf(a)-netProf(b),margin:(a,b)=>netMarg(a)-netMarg(b),days:(a,b)=>(holdDays(a)||0)-(holdDays(b)||0),bought:(a,b)=>new Date(a.bought||0)-new Date(b.bought||0),status:(a,b)=>a.status.localeCompare(b.status)};
  const sortedFiltered = useMemo(()=>{const fn=SORT_FNS[sortCol]||SORT_FNS.bought;return[...filtered].sort((a,b)=>sortDir==="asc"?fn(a,b):fn(b,a));},[filtered,sortCol,sortDir]);
  const setSort=col=>{if(sortCol===col)setSortDir(d=>d==="asc"?"desc":"asc");else{setSortCol(col);setSortDir("asc");}};
  const SortIcon=({col})=>sortCol===col?(sortDir==="asc"?"↑":"↓"):<span style={{color:"#333"}}>↕</span>;

  useEffect(()=>{
    const h=e=>{
      if(role!=="admin")return;
      if(e.key==="n"&&!e.ctrlKey&&!e.metaKey&&document.activeElement.tagName!=="INPUT"&&document.activeElement.tagName!=="TEXTAREA")setCm("new");
      if(e.key==="Escape"){setCm(null);setSm(null);setTlm(null);setDrawer(null);}
    };
    window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);
  },[role]);

  // ── all hooks above — PIN check below ──────────────────────────────────────
  if(!role) return <LoginScreen onAuth={r=>setRole(r)}/>;
  const isAdmin=role==="admin";

  const INP=BASE_INP, LBL=BASE_LBL, SH=SH_STYLE;
  const H1={fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,margin:"0 0 20px"};
  const donut=[{name:"Listed",value:cards.filter(c=>c.status==="listed").length,color:"#c9a84c"},{name:"Sold",value:sold.length,color:"#3a7bd5"},{name:"Holding",value:cards.filter(c=>c.status==="holding").length,color:"#5de08a"},{name:"Grading",value:cards.filter(c=>c.status==="grading").length,color:"#9333ea"}].filter(d=>d.value>0);

  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#f0ebe0", fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;} input,select,textarea{color-scheme:dark;}
        ::-webkit-scrollbar{width:5px;height:5px} ::-webkit-scrollbar-track{background:#0d0d0d} ::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:3px}
        input::placeholder,textarea::placeholder{color:#333}
        .row:hover td{background:#111 !important}
        .ghost{background:none;border:1px solid #2e2e2e;border-radius:8px;padding:5px 12px;color:#666;font-size:11px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.1s}
        .ghost:hover{border-color:#444;color:#aaa}
        .pill{border:1px solid #2e2e2e;border-radius:8px;padding:5px 11px;font-size:11px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.1s}
        @media(max-width:768px){.desktop-nav{display:none!important}.mobile-btn{display:flex!important}.kpi4{grid-template-columns:1fr 1fr!important}.kpi6{grid-template-columns:1fr 1fr!important}.two-col{grid-template-columns:1fr!important}.filter-grid{grid-template-columns:1fr 1fr!important}}
      `}</style>

      {/* NAV */}
      <nav style={{ borderBottom:"1px solid #1e1e1e", padding:"0 24px", display:"flex", alignItems:"center", height:54, position:"sticky", top:0, background:"rgba(13,13,13,0.97)", backdropFilter:"blur(20px)", zIndex:200 }}>
        <div style={{ display:"flex", alignItems:"center", gap:7, marginRight:16, flexShrink:0 }}>
          <span style={{ fontSize:20 }}>🃏</span>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:"#c9a84c", letterSpacing:"0.06em", whiteSpace:"nowrap" }}>CARD VAULT</span>
        </div>
        <div className="desktop-nav" style={{ display:"flex", gap:1, overflowX:"auto", flex:1 }}>
          {NAV.map(n=><button key={n} onClick={()=>setTab(n)} style={{ background:tab===n?"#1c1c1c":"none", border:"none", borderRadius:7, padding:"5px 11px", color:tab===n?"#f0ebe0":"#444", fontSize:12, cursor:"pointer", fontWeight:tab===n?600:400, whiteSpace:"nowrap", flexShrink:0 }}>{n}</button>)}
        </div>
        <button className="mobile-btn" onClick={()=>setMobileNav(o=>!o)} style={{ display:"none", background:"none", border:"1px solid #2e2e2e", borderRadius:8, padding:"5px 10px", color:"#888", fontSize:18, cursor:"pointer", marginLeft:8, flexShrink:0 }}>☰</button>
        <div style={{ marginLeft:"auto", display:"flex", gap:8, flexShrink:0 }}>
          <select value={currency} onChange={e=>setCurrency(e.target.value)} style={{ background:"#1c1c1c", border:"1px solid #2e2e2e", borderRadius:8, padding:"5px 10px", color:"#888", fontSize:11, cursor:"pointer", outline:"none" }}>
            {Object.keys(CURRENCIES).map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={()=>exportCSV(cards,suppliers)} className="ghost">↓ CSV</button>
          {isAdmin&&<><button onClick={()=>setSm("new")} className="ghost">+ Supplier</button>
          <button onClick={()=>setCm("new")} style={{ background:"#c9a84c", border:"none", borderRadius:8, padding:"6px 16px", color:"#0d0d0d", fontWeight:700, fontSize:12, cursor:"pointer" }}>+ Card</button></>}
          <div style={{ width:1, height:20, background:"#222", margin:"0 4px" }}/>
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 10px", background:"#1a1a1a", borderRadius:8, border:"1px solid #2e2e2e" }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:isAdmin?"#5de08a":"#3a7bd5" }}/>
            <span style={{ fontSize:11, color:isAdmin?"#5de08a":"#3a7bd5" }}>{isAdmin?"Admin":"View only"}</span>
            <button onClick={()=>setRole(null)} style={{ background:"none", border:"none", color:"#444", fontSize:11, cursor:"pointer", padding:0, marginLeft:4 }}>↩</button>
          </div>
          {isAdmin&&<button onClick={()=>{if(window.confirm("Reset all data to demo?")){{localStorage.removeItem(LS);window.location.reload();}}}} className="ghost" style={{ color:"#e85d04", borderColor:"#3a1a1a", fontSize:10 }}>Reset</button>}
        </div>
      </nav>
      {mobileNav&&<div style={{ position:"fixed", top:54, left:0, right:0, background:"#181818", borderBottom:"1px solid #2e2e2e", zIndex:190, display:"flex", flexDirection:"column", padding:8 }}>
        {NAV.map(n=><button key={n} onClick={()=>{setTab(n);setMobileNav(false);}} style={{ background:tab===n?"#222":"none", border:"none", borderRadius:8, padding:"10px 16px", color:tab===n?"#f0ebe0":"#888", fontSize:14, cursor:"pointer", textAlign:"left" }}>{n}</button>)}
      </div>}

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"26px 24px" }}>

        {/* ── OVERVIEW ── */}
        {tab==="Overview"&&<>
          <h1 style={H1}>Collection Overview</h1>
          <div style={{ fontSize:10, color:"#555", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>Realised</div>
          <div className="kpi4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
            <Kpi label="Net P&L"    value={fmtC(totalNetProfit)} sub={`${sold.length} cards sold`}   accent="#c9a84c" highlight/>
            <Kpi label="Win Rate"   value={pct(winRate)}         sub="Deals ≥10% margin"             accent="#5de08a"/>
            <Kpi label="Avg Margin" value={pct(avgNetMargin)}    sub="After grading costs"           accent="#5de08a"/>
            <Kpi label="Avg Hold"   value={avgHold+"d"}          sub="Days to sell"/>
          </div>
          <div style={{ fontSize:10, color:"#555", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>Active</div>
          <div className="kpi4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
            <Kpi label="Stock Value"      value={fmtC(capRisk)}         sub={`${active.length} cards`}/>
            <Kpi label="Unrealised P&L"   value={fmtC(unrealisedPnl)}   sub="vs market value" accent={unrealisedPnl>=0?"#3a7bd5":"#e85d04"}/>
            <Kpi label="Grading Spend"    value={fmtC(totalGradeCost)}  sub="Total grading costs"/>
            <Kpi label="Pipeline"         value={pipeline.length+""}    sub="Deals tracked" accent="#9333ea"/>
          </div>
          <div className="two-col" style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:14, marginBottom:14 }}>
            <div style={CARD}>
              <div style={SH}>Recent Activity</div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {recentActivity.map(c=>{const hd=holdDays(c);return(
                  <div key={c.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", background:"#121212", borderRadius:10 }}>
                    <span style={{ fontSize:18, flexShrink:0 }}>{SETS.find(s=>s.n===c.set)?.f||"🃏"}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, color:"#ddd", fontWeight:500 }}>{c.name}</div>
                      <div style={{ fontSize:11, color:"#666", marginTop:2 }}>{c.set} · {c.grade}{hd?` · ${hd}d`:""}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ ...NUM, fontSize:13, color:c.status==="sold"?"#5de08a":"#c9a84c" }}>{fmtC(c.askingPrice)}</div>
                      <div style={{ marginTop:3 }}><Badge status={c.status}/></div>
                    </div>
                  </div>
                );})}
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={CARD}>
                <div style={SH}>Monthly P&L</div>
                <ResponsiveContainer width="100%" height={130}>
                  <BarChart data={monthly} barSize={14}>
                    <XAxis dataKey="label" tick={{fill:"#555",fontSize:9}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fill:"#555",fontSize:9,...NUM}} axisLine={false} tickLine={false} tickFormatter={v=>"€"+(v/1000).toFixed(0)+"k"}/>
                    <Tooltip content={<ChartTip/>}/>
                    <Bar dataKey="profit" name="Net Profit" fill="#c9a84c" radius={[3,3,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div style={{ ...CARD, padding:"14px 16px" }}>
                  <div style={{ fontSize:10, color:"#555", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Best Flip</div>
                  {bestFlip?<><div style={{ fontSize:11, color:"#999", marginBottom:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{bestFlip.name}</div><div style={{ ...NUM, fontSize:16, color:"#5de08a" }}>{fmtC(netProf(bestFlip))}</div><div style={{ fontSize:10, color:"#555", marginTop:2 }}>{pct(netMarg(bestFlip))}</div></>:<div style={{ color:"#555", fontSize:11 }}>No sales yet</div>}
                </div>
                <div style={{ ...CARD, padding:"14px 16px" }}>
                  <div style={{ fontSize:10, color:"#555", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Worst Flip</div>
                  {worstFlip?<><div style={{ fontSize:11, color:"#999", marginBottom:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{worstFlip.name}</div><div style={{ ...NUM, fontSize:16, color:netProf(worstFlip)<0?"#e85d04":"#c9a84c" }}>{fmtC(netProf(worstFlip))}</div><div style={{ fontSize:10, color:"#555", marginTop:2 }}>{pct(netMarg(worstFlip))}</div></>:<div style={{ color:"#555", fontSize:11 }}>No sales yet</div>}
                </div>
              </div>
            </div>
          </div>
          <div style={CARD}>
            <div style={SH}>Active Collection — What's Sitting</div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead><tr style={{ borderBottom:"1px solid #222" }}>{["Card","Set","Card No.","Grade","Cost","Ask","Unreal. P&L","Days","Status"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
                <tbody>
                  {active.sort((a,b)=>(holdDays(b)||0)-(holdDays(a)||0)).map(c=>{
                    const unreal=(c.marketValue||c.askingPrice)-c.cost-(c.gradingCost||0),hd=holdDays(c);
                    return <tr key={c.id} className="row" style={{ borderBottom:"1px solid #161616" }}>
                      <td style={{ padding:"10px 14px", color:"#ccc" }}>{c.name}</td>
                      <td style={{ padding:"10px 14px", color:"#888", fontSize:11 }}>{c.set}</td>
                      <TD mono dim>{c.cardNo}</TD>
                      <td style={{ padding:"10px 14px", fontSize:11, color:"#9333ea" }}>{c.grade}</td>
                      <TD mono>{fmtC(c.cost)}</TD>
                      <TD mono>{fmtC(c.askingPrice)}</TD>
                      <td style={{ padding:"10px 14px",...NUM,color:unreal>=0?"#3a7bd5":"#e85d04",fontWeight:600 }}>{fmtC(unreal)}</td>
                      <td style={{ padding:"10px 14px",...NUM,fontSize:11,color:hd>90?"#e85d04":hd>30?"#c9a84c":"#5de08a" }}>{hd}d</td>
                      <td style={{ padding:"10px 14px" }}><Badge status={c.status}/></td>
                    </tr>;
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>}

        {/* ── INVENTORY ── */}
        {tab==="Inventory"&&<>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, flexWrap:"wrap" }}>
            <h1 style={{ ...H1, margin:0, flex:1 }}>Inventory</h1>
            <button onClick={()=>exportCSV(cards,suppliers)} className="ghost">↓ CSV</button>
            {isAdmin&&<button onClick={()=>setCm("new")} style={{ background:"#c9a84c", border:"none", borderRadius:8, padding:"7px 16px", color:"#0d0d0d", fontWeight:700, fontSize:12, cursor:"pointer" }}>+ Card</button>}
          </div>
          <div style={{ ...CARD, padding:"14px 16px", marginBottom:14 }}>
            <div className="filter-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr auto", gap:10, alignItems:"end" }}>
              <div><label style={LBL}>Search</label><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Card name, set, number…" style={INP}/></div>
              <div><label style={LBL}>Status</label><select value={fStatus} onChange={e=>setFStatus(e.target.value)} style={INP}><option value="all">All</option>{STATUSES.map(s=><option key={s}>{s}</option>)}</select></div>
              <div><label style={LBL}>Set</label><select value={fSet} onChange={e=>setFSet(e.target.value)} style={INP}><option value="all">All sets</option>{[...new Set(cards.map(c=>c.set))].sort().map(s=><option key={s}>{s}</option>)}</select></div>
              <div><label style={LBL}>Grade</label><select value={fGrade} onChange={e=>setFGrade(e.target.value)} style={INP}><option value="all">All</option>{GRADES.map(g=><option key={g}>{g}</option>)}</select></div>
              <div><label style={LBL}>Min Margin</label><select value={fMargin} onChange={e=>setFMargin(e.target.value)} style={INP}><option value="0">Any</option><option value="0.05">5%+</option><option value="0.10">10%+</option><option value="0.20">20%+</option><option value="0.30">30%+</option></select></div>
              <div><label style={LBL}>Supplier</label><select value={fSupplier} onChange={e=>setFSupplier(e.target.value)} style={INP}><option value="all">All</option>{suppliers.map(s=><option key={s.id} value={s.id}>{s.name.split(" ")[0]}</option>)}</select></div>
              <button onClick={()=>{setSearch("");setFStatus("all");setFSet("all");setFGrade("all");setFMargin("0");setFSupplier("all");}} className="ghost" style={{ padding:"9px 14px", alignSelf:"flex-end" }}>Reset</button>
            </div>
          </div>
          <div style={{ fontSize:11, color:"#555", marginBottom:10 }}>{filtered.length} cards{filtered.length!==cards.length?` (filtered from ${cards.length})`:""}</div>
          {isAdmin&&selected.size>0&&(
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 16px", background:"#1e1a0e", border:"1px solid #3a2a0e", borderRadius:10, marginBottom:12 }}>
              <span style={{ fontSize:12, color:"#c9a84c", fontWeight:600 }}>{selected.size} selected</span>
              <select value={bulkStatus} onChange={e=>setBulkStatus(e.target.value)} style={{ ...BASE_INP, width:140, padding:"6px 10px", fontSize:12 }}><option value="">Set status…</option>{STATUSES.map(s=><option key={s}>{s}</option>)}</select>
              <button onClick={applyBulkStatus} disabled={!bulkStatus} style={{ background:bulkStatus?"#c9a84c":"#333", border:"none", borderRadius:8, padding:"6px 16px", color:bulkStatus?"#0d0d0d":"#555", fontSize:12, fontWeight:700, cursor:bulkStatus?"pointer":"default" }}>Apply</button>
              <div style={{ width:1, height:18, background:"#3a2a0e" }}/>
              <button onClick={deleteSelected} style={{ background:"none", border:"1px solid #5a1a1a", borderRadius:8, padding:"6px 14px", color:"#e85d04", fontSize:12, fontWeight:600, cursor:"pointer" }}>🗑 Delete {selected.size}</button>
              <button onClick={()=>setSelected(new Set())} className="ghost" style={{ marginLeft:"auto" }}>Clear</button>
            </div>
          )}
          <div style={{ ...CARD, padding:0, overflow:"hidden" }}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid #222" }}>
                    {isAdmin&&<th style={{ padding:"10px 14px", width:36 }}><input type="checkbox" checked={selected.size===sortedFiltered.length&&sortedFiltered.length>0} onChange={()=>toggleSelectAll(sortedFiltered.map(c=>c.id))} style={{ cursor:"pointer" }}/></th>}
                    {[["year","Year"],["set","Set"],["name","Card"],["","No."],["grade","Grade"],["cost","Cost"],["askingPrice","Ask"],["","Grading"],["netProfit","Net Profit"],["margin","Margin"],["days","Days"],["","Mkt Val."],["status","Status"],["",""],["",""],["",""]].map(([col,label],i)=>(
                      <th key={i} onClick={()=>col&&setSort(col)} style={{ padding:"10px 14px", textAlign:"left", color:col&&sortCol===col?"#c9a84c":"#555", fontWeight:500, fontSize:10, textTransform:"uppercase", letterSpacing:"0.08em", cursor:col?"pointer":"default", userSelect:"none", whiteSpace:"nowrap" }}>
                        {label} {col&&<SortIcon col={col}/>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedFiltered.map(c=>{
                    const np=netProf(c),nm=netMarg(c),mv=c.marketValue,isSel=selected.has(c.id),photos=c.photos||[];
                    return (
                      <tr key={c.id} className="row" onClick={()=>setDrawer(c)} style={{ borderBottom:"1px solid #161616", cursor:"pointer", background:isSel?"#1a1a0a":"transparent" }}>
                        {isAdmin&&<td style={{ padding:"10px 14px" }} onClick={e=>{e.stopPropagation();toggleSelect(c.id);}}><input type="checkbox" checked={isSel} onChange={()=>toggleSelect(c.id)} style={{ cursor:"pointer" }}/></td>}
                        <TD mono dim>{c.year}</TD>
                        <td style={{ padding:"10px 14px" }}><span style={{ display:"flex",alignItems:"center",gap:6 }}><span style={{ fontSize:14 }}>{SETS.find(s=>s.n===c.set)?.f||"🃏"}</span><span style={{ color:"#888",fontSize:11 }}>{c.set}</span></span></td>
                        <td style={{ padding:"10px 14px", color:"#ddd", fontWeight:500 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            {photos.length>0&&<img src={photos[0].data} alt="" style={{ width:24,height:24,objectFit:"cover",borderRadius:4,border:"1px solid #2e2e2e",flexShrink:0 }}/>}
                            {c.name}
                          </div>
                        </td>
                        <TD mono dim>{c.cardNo}</TD>
                        <td style={{ padding:"10px 14px", fontSize:11, color:"#9333ea" }}>{c.grade}</td>
                        <TD mono>{fmtC(c.cost)}</TD>
                        <TD mono>{fmtC(c.askingPrice)}</TD>
                        <td style={{ padding:"10px 14px",...NUM,fontSize:11,color:c.gradingCost?"#9333ea":"#444" }}>{c.gradingCost?fmtC(c.gradingCost):"—"}</td>
                        <td style={{ padding:"10px 14px",...NUM,color:np>=0?"#5de08a":"#e85d04",fontWeight:600 }}>{fmtC(np)}</td>
                        <td style={{ padding:"10px 14px",...NUM,color:nm>=0.15?"#5de08a":nm>=0.05?"#c9a84c":"#e85d04" }}>{pct(nm)}</td>
                        <TD mono dim>{holdDays(c)??"-"}</TD>
                        <td style={{ padding:"10px 14px",...NUM,fontSize:11,color:mv?(mv>c.cost?"#3a7bd5":"#e85d04"):"#444" }}>{mv?fmtC(mv):"—"}</td>
                        <td style={{ padding:"10px 14px" }}><Badge status={c.status}/></td>
                        {isAdmin&&<td style={{ padding:"10px 14px" }} onClick={e=>e.stopPropagation()}><button className="ghost" onClick={()=>setCm(c)}>Edit</button></td>}
                        {isAdmin&&<td style={{ padding:"10px 14px" }} onClick={e=>e.stopPropagation()}><button className="ghost" style={{ color:"#9333ea",borderColor:"#2e1e40" }} onClick={()=>setTlm(c)}>Log</button></td>}
                        {isAdmin&&<td style={{ padding:"10px 14px" }} onClick={e=>e.stopPropagation()}><button className="ghost" style={{ color:"#e85d04",borderColor:"#3a1a1a" }} onClick={()=>deleteCard(c.id)}>🗑</button></td>}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>}

        {/* ── LOGISTICS ── */}
        {tab==="Logistics"&&<>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
            <h1 style={{ ...H1, margin:0, flex:1 }}>Logistics</h1>
            {isAdmin&&<button onClick={()=>setLogistics(l=>[...l,{id:Date.now(),cardId:"",set:"",name:"",carrier:"",trackingNo:"",from:"",to:"",status:"preparing",sent:"",eta:"",arrived:"",cost:0,insured:false,insuredValue:0,notes:""}])} style={{ background:"#c9a84c", border:"none", borderRadius:8, padding:"7px 18px", color:"#0d0d0d", fontWeight:700, fontSize:12, cursor:"pointer" }}>+ Add Shipment</button>}
          </div>
          <div className="kpi4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:18 }}>
            <Kpi label="Total Shipments" value={logistics.length}/>
            <Kpi label="In Transit"      value={logistics.filter(l=>l.status==="in transit").length} accent="#c9a84c"/>
            <Kpi label="Delivered"       value={logistics.filter(l=>l.status==="delivered").length}  accent="#5de08a"/>
            <Kpi label="Shipping Spend"  value={fmtC(logistics.reduce((a,l)=>a+(l.cost||0),0))}     accent="#9333ea"/>
          </div>
          {logistics.filter(l=>l.status!=="delivered").length>0&&<>
            <div style={{ fontSize:10, color:"#555", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>In Transit / Grading</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
              {logistics.filter(l=>l.status!=="delivered").map(s=>(
                <div key={s.id} style={{ ...CARD, padding:"16px 20px", display:"flex", gap:16, alignItems:"center", flexWrap:"wrap" }}>
                  <div style={{ flex:1, minWidth:200 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, flexWrap:"wrap" }}>
                      <span style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:600 }}>{s.name||"—"}</span>
                      <Badge status={s.status}/>
                      {s.insured&&<span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:"#1a2a1a", color:"#5de08a" }}>insured</span>}
                    </div>
                    <div style={{ display:"flex", gap:16, fontSize:11, color:"#666", flexWrap:"wrap" }}>
                      <span>📦 {s.carrier||"—"}</span><span>📍 {s.from||"—"} → {s.to||"—"}</span>
                      {s.eta&&<span>🕐 ETA: {s.eta}</span>}
                    </div>
                    {s.trackingNo&&<div style={{ ...NUM, fontSize:11, color:"#666", marginTop:5 }}>{s.trackingNo}</div>}
                  </div>
                  <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:10, color:"#555", marginBottom:2 }}>Cost</div>
                      <div style={{ ...NUM, fontSize:13, color:"#aaa" }}>{fmtC(s.cost||0)}</div>
                    </div>
                    {isAdmin&&["preparing","in transit","delivered"].map(st=>(
                      <button key={st} onClick={()=>setLogistics(ls=>ls.map(x=>x.id===s.id?{...x,status:st,arrived:st==="delivered"?new Date().toISOString().slice(0,10):x.arrived}:x))}
                        className="pill" style={{ background:s.status===st?"#c9a84c":"#181818", color:s.status===st?"#0d0d0d":"#666", fontWeight:s.status===st?700:400, fontSize:10, padding:"4px 8px" }}>{st}</button>
                    ))}
                    {isAdmin&&<button onClick={()=>{if(window.confirm("Delete shipment?"))setLogistics(ls=>ls.filter(x=>x.id!==s.id));}} className="ghost" style={{ color:"#e85d04", borderColor:"#3a1a1a" }}>🗑</button>}
                  </div>
                </div>
              ))}
            </div>
          </>}
          <div style={{ ...CARD, padding:0, overflow:"hidden" }}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead><tr style={{ borderBottom:"1px solid #222" }}>{["Card","Carrier","Tracking","Route","Sent","ETA/Arrived","Cost","Insured","Status"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
                <tbody>
                  {[...logistics].sort((a,b)=>new Date(b.sent||0)-new Date(a.sent||0)).map(s=>(
                    <tr key={s.id} className="row" style={{ borderBottom:"1px solid #161616" }}>
                      <td style={{ padding:"10px 14px", color:"#ccc" }}>{s.name}</td>
                      <TD dim>{s.carrier||"—"}</TD>
                      <td style={{ padding:"10px 14px",...NUM,fontSize:11,color:"#666" }}>{s.trackingNo||"—"}</td>
                      <td style={{ padding:"10px 14px",fontSize:11,color:"#777" }}>{s.from&&s.to?`${s.from} → ${s.to}`:"—"}</td>
                      <TD mono dim>{s.sent||"—"}</TD>
                      <TD mono dim>{s.arrived||s.eta||"—"}</TD>
                      <TD mono>{s.cost?fmtC(s.cost):"—"}</TD>
                      <td style={{ padding:"10px 14px",fontSize:11,color:s.insured?"#5de08a":"#555" }}>{s.insured?fmtC(s.insuredValue):"No"}</td>
                      <td style={{ padding:"10px 14px" }}><Badge status={s.status}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>}

        {/* ── P&L ── */}
        {tab==="P&L"&&<>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18, flexWrap:"wrap" }}>
            <h1 style={{ ...H1, margin:0, flex:1 }}>P&L Analysis</h1>
            <div style={{ display:"flex", gap:4 }}>
              {[["all","All Time"],["3","3M"],["6","6M"],["12","12M"]].map(([v,l])=>(
                <button key={v} onClick={()=>setPeriod(v)} className="pill" style={{ background:period===v?"#c9a84c":"#181818", color:period===v?"#0d0d0d":"#555", fontWeight:period===v?700:400 }}>{l}</button>
              ))}
            </div>
          </div>
          <div className="kpi6" style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10, marginBottom:16 }}>
            {[["Net P&L",fmtC(pnlCards.reduce((a,c)=>a+netProf(c),0)),"#c9a84c"],["Revenue",fmtC(pnlCards.reduce((a,c)=>a+c.askingPrice,0)),"#f0ebe0"],["Cost Basis",fmtC(pnlCards.reduce((a,c)=>a+c.cost,0)),"#666"],["Grading",fmtC(pnlCards.reduce((a,c)=>a+(c.gradingCost||0),0)),"#9333ea"],["Avg Margin",pnlCards.length?pct(pnlCards.reduce((a,c)=>a+netMarg(c),0)/pnlCards.length):"—","#5de08a"],["Deals",pnlCards.length,"#aaa"]].map(([l,v,a])=><Kpi key={l} label={l} value={v} accent={a} small/>)}
          </div>
          <div className="two-col" style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:14, marginBottom:14 }}>
            <div style={CARD}><div style={SH}>Cumulative Net P&L</div>
              <ResponsiveContainer width="100%" height={175}><LineChart data={monthly}><XAxis dataKey="label" tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#555",fontSize:10,...NUM}} axisLine={false} tickLine={false} tickFormatter={v=>"€"+(v/1000).toFixed(0)+"k"}/><Tooltip content={<ChartTip/>}/><Line type="monotone" dataKey="cumulative" name="Cumulative P&L" stroke="#c9a84c" strokeWidth={2} dot={{fill:"#c9a84c",r:3}}/></LineChart></ResponsiveContainer>
            </div>
            <div style={CARD}><div style={SH}>Monthly Margin %</div>
              <ResponsiveContainer width="100%" height={175}><BarChart data={monthly} barSize={16}><XAxis dataKey="label" tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#555",fontSize:10,...NUM}} axisLine={false} tickLine={false} tickFormatter={v=>v+"%"}/><Tooltip content={<ChartTip/>}/><Bar dataKey="marginPct" name="Margin %" fill="#3a7bd5" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer>
            </div>
          </div>
          <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            <div style={CARD}><div style={SH}>P&L by Set</div>
              <ResponsiveContainer width="100%" height={185}><BarChart data={setStats.filter(s=>s.sold>0)} layout="vertical" barSize={12}><XAxis type="number" tick={{fill:"#555",fontSize:10,...NUM}} axisLine={false} tickLine={false} tickFormatter={v=>"€"+(v/1000).toFixed(0)+"k"}/><YAxis dataKey="set" type="category" tick={{fill:"#aaa",fontSize:10}} axisLine={false} tickLine={false} width={110}/><Tooltip content={<ChartTip/>}/><Bar dataKey="profit" name="Net Profit" radius={[0,4,4,0]}>{setStats.map((s,i)=><Cell key={i} fill={sc(s.set)}/>)}</Bar></BarChart></ResponsiveContainer>
            </div>
            <div style={CARD}><div style={SH}>Margin % by Set</div>
              <ResponsiveContainer width="100%" height={185}><BarChart data={setStats.filter(s=>s.sold>0)} layout="vertical" barSize={12}><XAxis type="number" tick={{fill:"#555",fontSize:10,...NUM}} axisLine={false} tickLine={false} tickFormatter={v=>v+"%"}/><YAxis dataKey="set" type="category" tick={{fill:"#aaa",fontSize:10}} axisLine={false} tickLine={false} width={110}/><Tooltip content={<ChartTip/>}/><Bar dataKey="avgMarginPct" name="Avg Margin %" radius={[0,4,4,0]}>{setStats.map((s,i)=><Cell key={i} fill={sc(s.set)}/>)}</Bar></BarChart></ResponsiveContainer>
            </div>
          </div>
          <div style={{ ...CARD, padding:0, overflow:"hidden" }}>
            <div style={{ padding:"14px 18px", borderBottom:"1px solid #222" }}><span style={SH}>Deal Breakdown</span></div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead><tr style={{ borderBottom:"1px solid #222" }}>{["Date","Card","Set","No.","Grade","Cost","Grading","Sold For","Net Profit","Margin","Hold Days","Supplier"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
                <tbody>
                  {[...pnlCards].sort((a,b)=>new Date(b.soldDate)-new Date(a.soldDate)).map(c=>{
                    const np=netProf(c),nm=netMarg(c),sup=suppliers.find(s=>s.id===c.supplierId);
                    return <tr key={c.id} className="row" style={{ borderBottom:"1px solid #161616" }}>
                      <TD mono dim>{c.soldDate}</TD>
                      <td style={{ padding:"10px 14px", color:"#ddd", fontWeight:500 }}>{c.name}</td>
                      <td style={{ padding:"10px 14px", color:"#777", fontSize:11 }}>{c.set}</td>
                      <TD mono dim>{c.cardNo}</TD>
                      <td style={{ padding:"10px 14px", fontSize:11, color:"#9333ea" }}>{c.grade}</td>
                      <TD mono>{fmtC(c.cost)}</TD>
                      <td style={{ padding:"10px 14px",...NUM,fontSize:11,color:c.gradingCost?"#9333ea":"#555" }}>{c.gradingCost?fmtC(c.gradingCost):"—"}</td>
                      <TD mono>{fmtC(c.askingPrice)}</TD>
                      <td style={{ padding:"10px 14px",...NUM,fontWeight:600,color:np>=0?"#5de08a":"#e85d04" }}>{fmtC(np)}</td>
                      <td style={{ padding:"10px 14px",...NUM,color:nm>=0.15?"#5de08a":nm>=0.05?"#c9a84c":"#e85d04" }}>{pct(nm)}</td>
                      <TD mono dim>{holdDays(c)??"-"}</TD>
                      <TD dim>{sup?.name||"—"}</TD>
                    </tr>;
                  })}
                </tbody>
                <tfoot><tr style={{ borderTop:"1px solid #2e2e2e", background:"#121212" }}>
                  <td colSpan={5} style={{ padding:"10px 14px",color:"#444",fontSize:10,textTransform:"uppercase",letterSpacing:"0.07em" }}>Total / Avg</td>
                  <TD mono>{fmtC(pnlCards.reduce((a,c)=>a+c.cost,0))}</TD>
                  <td style={{ padding:"10px 14px",...NUM,color:"#9333ea" }}>{fmtC(pnlCards.reduce((a,c)=>a+(c.gradingCost||0),0))}</td>
                  <TD mono>{fmtC(pnlCards.reduce((a,c)=>a+c.askingPrice,0))}</TD>
                  <td style={{ padding:"10px 14px",...NUM,fontWeight:600,color:"#c9a84c" }}>{fmtC(pnlCards.reduce((a,c)=>a+netProf(c),0))}</td>
                  <td style={{ padding:"10px 14px",...NUM,color:"#5de08a" }}>{pnlCards.length?pct(pnlCards.reduce((a,c)=>a+netMarg(c),0)/pnlCards.length):"—"}</td>
                  <td colSpan={2}/>
                </tr></tfoot>
              </table>
            </div>
          </div>
        </>}

        {/* ── SUPPLIERS ── */}
        {tab==="Suppliers"&&<>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
            <h1 style={{ ...H1, margin:0, flex:1 }}>Suppliers</h1>
            {isAdmin&&<button onClick={()=>setSm("new")} style={{ background:"#c9a84c", border:"none", borderRadius:8, padding:"7px 18px", color:"#0d0d0d", fontWeight:700, fontSize:12, cursor:"pointer" }}>+ Add Supplier</button>}
          </div>
          <div className="kpi4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:18 }}>
            <Kpi label="Total Suppliers" value={suppliers.length}/>
            <Kpi label="Top Source"      value={[...supStats].sort((a,b)=>b.totalP-a.totalP)[0]?.name.split(" ")[0]||"—"} accent="#c9a84c"/>
            <Kpi label="Avg Reliability" value={(suppliers.reduce((a,s)=>a+s.reliability,0)/Math.max(1,suppliers.length)).toFixed(1)+" / 5"} accent="#5de08a"/>
            <Kpi label="Cards Sourced"   value={cards.filter(c=>c.supplierId).length}/>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {supStats.map(s=>(
              <div key={s.id} style={{ ...CARD, display:"flex", gap:16, alignItems:"flex-start", padding:"18px 20px", flexWrap:"wrap" }}>
                <div style={{ width:40,height:40,borderRadius:"50%",background:"#1e1e1e",border:"1.5px solid #2e2e2e",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>🃏</div>
                <div style={{ flex:1, minWidth:200 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3, flexWrap:"wrap" }}>
                    <span style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:600 }}>{s.name}</span>
                    <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:"#222", color:"#666" }}>{s.type}</span>
                    <span style={{ fontSize:11, color:"#444" }}>{[s.city,s.country].filter(Boolean).join(", ")}</span>
                  </div>
                  <Stars n={s.reliability}/>
                  <div style={{ fontSize:12, color:"#555", marginTop:4, marginBottom:5 }}>{s.notes}</div>
                  {s.tags?.length>0&&<div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>{s.tags.map(t=><span key={t} style={{ fontSize:10,padding:"2px 8px",borderRadius:20,background:"#161616",color:"#555",border:"1px solid #222" }}>{t}</span>)}</div>}
                  <div style={{ display:"flex", gap:14, marginTop:7 }}>
                    {s.email&&<span style={{ fontSize:11,color:"#3a7bd5" }}>✉ {s.email}</span>}
                    {s.phone&&<span style={{ fontSize:11,color:"#555" }}>☎ {s.phone}</span>}
                  </div>
                </div>
                <div style={{ display:"flex", gap:14, alignItems:"center", flexWrap:"wrap" }}>
                  {[["Net P&L",fmtC(s.totalP),s.totalP>0?"#5de08a":"#666"],["Avg Margin",s.avgM>0?pct(s.avgM):"—","#c9a84c"],["Cards",s.wCount,"#aaa"],["Disc.",s.avgDiscount+"%","#aaa"]].map(([l,v,c])=>(
                    <div key={l} style={{ textAlign:"right" }}>
                      <div style={{ fontSize:10,color:"#444",marginBottom:2,textTransform:"uppercase",letterSpacing:"0.07em" }}>{l}</div>
                      <div style={{ ...NUM,fontSize:14,color:c }}>{v}</div>
                    </div>
                  ))}
                  {isAdmin&&<button className="ghost" onClick={()=>setSm(s)}>Edit</button>}
                  {isAdmin&&<button className="ghost" style={{ color:"#e85d04",borderColor:"#3a1a1a" }} onClick={()=>deleteSupplier(s.id)}>🗑</button>}
                </div>
              </div>
            ))}
          </div>
        </>}

        {/* ── SALES ── */}
        {tab==="Sales"&&<>
          <h1 style={H1}>Sales History</h1>
          <div className="two-col" style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:14, marginBottom:14 }}>
            <div style={CARD}><div style={SH}>Cumulative Profit</div>
              <ResponsiveContainer width="100%" height={180}><LineChart data={monthly}><XAxis dataKey="label" tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#555",fontSize:10,...NUM}} axisLine={false} tickLine={false} tickFormatter={v=>"€"+(v/1000).toFixed(0)+"k"}/><Tooltip content={<ChartTip/>}/><Line type="monotone" dataKey="cumulative" name="Cumulative P&L" stroke="#c9a84c" strokeWidth={2} dot={{fill:"#c9a84c",r:3}}/></LineChart></ResponsiveContainer>
            </div>
            <div style={CARD}><div style={SH}>Margin Bands</div>
              {[["0–10%",0,0.1],["10–20%",0.1,0.2],["20–30%",0.2,0.3],["30%+",0.3,Infinity]].map(([range,lo,hi])=>{
                const cnt=sold.filter(c=>{const m=netMarg(c);return m>=lo&&m<hi;}).length,p=sold.length?(cnt/sold.length)*100:0;
                return <div key={range} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <span style={{ ...NUM, fontSize:11, color:"#555", width:50 }}>{range}</span>
                  <div style={{ flex:1, height:7, background:"#1e1e1e", borderRadius:4, overflow:"hidden" }}><div style={{ height:"100%", width:p+"%", background:"#c9a84c", borderRadius:4 }}/></div>
                  <span style={{ ...NUM, fontSize:12, color:"#888", width:16, textAlign:"right" }}>{cnt}</span>
                </div>;
              })}
            </div>
          </div>
          <div style={{ ...CARD, padding:0, overflow:"hidden" }}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead><tr style={{ borderBottom:"1px solid #222" }}>{["Date","Card","Set","No.","Grade","Cost","Grading","Sold For","Net Profit","Margin","Hold Days"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
                <tbody>
                  {[...sold].sort((a,b)=>new Date(b.soldDate)-new Date(a.soldDate)).map(c=>(
                    <tr key={c.id} className="row" style={{ borderBottom:"1px solid #161616" }}>
                      <TD mono dim>{c.soldDate}</TD>
                      <td style={{ padding:"10px 14px", color:"#ddd", fontWeight:500 }}>{c.name}</td>
                      <td style={{ padding:"10px 14px", color:"#777", fontSize:11 }}>{c.set}</td>
                      <TD mono dim>{c.cardNo}</TD>
                      <td style={{ padding:"10px 14px", fontSize:11, color:"#9333ea" }}>{c.grade}</td>
                      <TD mono>{fmtC(c.cost)}</TD>
                      <td style={{ padding:"10px 14px",...NUM,fontSize:11,color:c.gradingCost?"#9333ea":"#555" }}>{c.gradingCost?fmtC(c.gradingCost):"—"}</td>
                      <TD mono>{fmtC(c.askingPrice)}</TD>
                      <td style={{ padding:"10px 14px",...NUM,fontWeight:600,color:netProf(c)>=0?"#5de08a":"#e85d04" }}>{fmtC(netProf(c))}</td>
                      <td style={{ padding:"10px 14px",...NUM,color:netMarg(c)>=0.15?"#5de08a":netMarg(c)>=0.05?"#c9a84c":"#e85d04" }}>{pct(netMarg(c))}</td>
                      <TD mono dim>{holdDays(c)??"-"}</TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>}

        {/* ── INTELLIGENCE ── */}
        {tab==="Intelligence"&&<>
          <h1 style={H1}>Business Intelligence</h1>
          <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            <div style={CARD}>
              <div style={SH}>Margin vs Hold Days</div>
              <div style={{ fontSize:11, color:"#555", marginBottom:10 }}>Each dot = one flip. Bigger = higher cost. Line = trend.</div>
              <ResponsiveContainer width="100%" height={200}>
                <ScatterChart>
                  <CartesianGrid stroke="#1e1e1e" strokeDasharray="3 3"/>
                  <XAxis type="number" dataKey="x" name="Hold Days" tick={{fill:"#555",fontSize:10,...NUM}} axisLine={false} tickLine={false}/>
                  <YAxis type="number" dataKey="y" name="Margin %" tick={{fill:"#555",fontSize:10,...NUM}} axisLine={false} tickLine={false} tickFormatter={v=>v+"%"}/>
                  <ZAxis dataKey="z" range={[40,200]}/>
                  <Tooltip cursor={{stroke:"#2e2e2e"}} content={({active,payload})=>{if(!active||!payload?.length)return null;const d=payload[0].payload;return<div style={{background:"#181818",border:"1px solid #2e2e2e",borderRadius:8,padding:"8px 12px",fontSize:12}}><div style={{color:"#888",marginBottom:3}}>{d.name}</div><div style={{...NUM,color:"#c9a84c"}}>{d.y}% margin · {d.x}d</div></div>;}}/>
                  <Scatter data={scatterData} fillOpacity={0.85}>{scatterData.map((d,i)=><Cell key={i} fill={sc(d.set)}/>)}</Scatter>
                  {scatterData.length>=2&&(()=>{const n=scatterData.length,sx=scatterData.reduce((a,d)=>a+d.x,0),sy=scatterData.reduce((a,d)=>a+d.y,0),sxy=scatterData.reduce((a,d)=>a+d.x*d.y,0),sxx=scatterData.reduce((a,d)=>a+d.x*d.x,0),slope=(n*sxy-sx*sy)/(n*sxx-sx*sx||1),intercept=(sy-slope*sx)/n,xs=[Math.min(...scatterData.map(d=>d.x)),Math.max(...scatterData.map(d=>d.x))];return<Line data={xs.map(x=>({x,y:+(slope*x+intercept).toFixed(1)}))} type="linear" dataKey="y" stroke="#c9a84c44" strokeWidth={1.5} strokeDasharray="4 3" dot={false} legendType="none"/>;})()}
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div style={CARD}><div style={SH}>Sales by Month</div>
              <ResponsiveContainer width="100%" height={200}><BarChart data={monthlyCount} barSize={20}><XAxis dataKey="month" tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#555",fontSize:10,...NUM}} axisLine={false} tickLine={false}/><Tooltip content={<ChartTip/>}/><Bar dataKey="count" name="Cards Sold" fill="#3a7bd5" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer>
            </div>
          </div>
          <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            <div style={CARD}>
              <div style={SH}>Capital Efficiency by Set</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {setStats.filter(s=>s.sold>0).map(s=>{const eff=s.cost?s.profit/s.cost:0,maxEff=Math.max(...setStats.filter(x=>x.sold>0).map(x=>x.cost?x.profit/x.cost:0));return(
                  <div key={s.set} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:12 }}>{SETS.find(x=>x.n===s.set)?.f||"🃏"}</span>
                    <span style={{ fontSize:11, color:"#888", width:100, flexShrink:0, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.set}</span>
                    <div style={{ flex:1, height:7, background:"#1e1e1e", borderRadius:4, overflow:"hidden" }}><div style={{ height:"100%", width:`${(eff/maxEff)*100}%`, background:sc(s.set), borderRadius:4 }}/></div>
                    <span style={{ ...NUM, fontSize:12, color:"#c9a84c", width:50, textAlign:"right" }}>{pct(eff)}</span>
                  </div>
                );})}
              </div>
            </div>
            <div style={CARD}>
              <div style={SH}>Supplier ROI Ranking</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {[...supStats].sort((a,b)=>b.avgM-a.avgM).map((s,i)=>(
                  <div key={s.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:"#121212", borderRadius:10 }}>
                    <span style={{ ...NUM,fontSize:13,color:"#444",width:18 }}>#{i+1}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, color:"#ccc" }}>{s.name}</div>
                      <div style={{ fontSize:10, color:"#555" }}>{s.sCount} sold · {s.avgDiscount}% disc</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ ...NUM, fontSize:15, color:"#5de08a" }}>{s.avgM>0?pct(s.avgM):"—"}</div>
                      <div style={{ fontSize:10, color:"#555" }}>avg margin</div>
                    </div>
                    <Stars n={s.reliability}/>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={CARD}>
            <div style={SH}>Grade vs Margin — What Grade is Worth Targeting</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10 }}>
              {["Raw","PSA 7","PSA 8","PSA 9","PSA 10","BGS 9.5"].map(g=>{
                const cs=sold.filter(c=>c.grade===g),avg=cs.length?cs.reduce((a,c)=>a+netMarg(c),0)/cs.length:null;
                return(
                  <div key={g} style={{ background:"#121212",borderRadius:10,padding:"14px 12px",textAlign:"center" }}>
                    <div style={{ fontSize:10,color:"#555",marginBottom:6 }}>{g}</div>
                    <div style={{ ...NUM,fontSize:17,color:avg===null?"#333":avg>=0.15?"#5de08a":avg>=0.05?"#c9a84c":"#e85d04" }}>{avg!==null?pct(avg):"—"}</div>
                    <div style={{ fontSize:10,color:"#444",marginTop:4 }}>{cs.length} sold</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>}

        {/* ── WISHLIST ── */}
        {tab==="Wishlist"&&<>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
            <h1 style={{ ...H1, margin:0, flex:1 }}>Wishlist</h1>
            {isAdmin&&<button onClick={()=>setWishlist(w=>[...w,{id:Date.now(),set:"",name:"",cardNo:"",year:"",targetBuy:0,marketEst:0,priority:"medium",notes:"",found:false}])} style={{ background:"#c9a84c", border:"none", borderRadius:8, padding:"7px 18px", color:"#0d0d0d", fontWeight:700, fontSize:12, cursor:"pointer" }}>+ Add</button>}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {wishlist.map(item=>(
              <div key={item.id} style={{ ...CARD, padding:"16px 20px", display:"flex", gap:16, alignItems:"center", flexWrap:"wrap", opacity:item.found?0.5:1 }}>
                <div style={{ flex:1, minWidth:200 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3, flexWrap:"wrap" }}>
                    <span style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:600, color:item.found?"#666":"#f0ebe0" }}>{item.name||"—"}</span>
                    <span style={{ fontSize:11, color:"#666" }}>{item.set}</span>
                    <span style={{ fontSize:10,padding:"2px 8px",borderRadius:20,background:item.priority==="high"?"#2a1a0e":item.priority==="medium"?"#222":"#1a2a1a",color:item.priority==="high"?"#c9a84c":item.priority==="medium"?"#888":"#5de08a" }}>{item.priority}</span>
                    {item.found&&<span style={{ fontSize:10,padding:"2px 8px",borderRadius:20,background:"#1a2f3a",color:"#3a7bd5" }}>found</span>}
                  </div>
                  <div style={{ fontSize:11, color:"#555" }}>{item.cardNo} {item.year&&`· ${item.year}`} {item.notes&&`· ${item.notes}`}</div>
                </div>
                <div style={{ display:"flex", gap:18, alignItems:"center", flexWrap:"wrap" }}>
                  {[["Target Buy",item.targetBuy,"#c9a84c"],["Market Est.",item.marketEst,"#888"],["Upside",item.marketEst&&item.targetBuy?item.marketEst-item.targetBuy:null,(item.marketEst-item.targetBuy)>0?"#5de08a":"#e85d04"]].map(([l,v,c])=>(
                    <div key={l} style={{ textAlign:"right" }}>
                      <div style={{ fontSize:10,color:"#444",marginBottom:2 }}>{l}</div>
                      <div style={{ ...NUM,fontSize:15,color:v?c:"#444" }}>{v?fmtC(v):"—"}</div>
                    </div>
                  ))}
                  {isAdmin&&<button onClick={()=>setWishlist(w=>w.map(x=>x.id===item.id?{...x,found:!x.found}:x))} className="ghost">{item.found?"Unmark":"Mark Found"}</button>}
                  {isAdmin&&<button onClick={()=>{if(window.confirm("Remove from wishlist?"))setWishlist(w=>w.filter(x=>x.id!==item.id));}} className="ghost" style={{ color:"#e85d04",borderColor:"#3a1a1a" }}>🗑</button>}
                </div>
              </div>
            ))}
            {!wishlist.length&&<div style={{ color:"#444",fontSize:13,textAlign:"center",padding:"40px 0" }}>No cards on wishlist yet</div>}
          </div>
        </>}

        {/* ── PIPELINE ── */}
        {tab==="Pipeline"&&<>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
            <h1 style={{ ...H1, margin:0, flex:1 }}>Deal Pipeline</h1>
            {isAdmin&&<button onClick={()=>setPipeline(p=>[...p,{id:Date.now(),set:"",name:"",cardNo:"",year:"",askingPrice:0,offerMade:0,status:"interested",supplierId:"",notes:"",lastContact:""}])} style={{ background:"#c9a84c", border:"none", borderRadius:8, padding:"7px 18px", color:"#0d0d0d", fontWeight:700, fontSize:12, cursor:"pointer" }}>+ Add Deal</button>}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:18 }}>
            {[["tracking","Tracking","#666"],["interested","Interested","#3a7bd5"],["negotiating","Negotiating","#c9a84c"]].map(([s,l,c])=>(
              <div key={s} style={{ ...CARD, textAlign:"center" }}>
                <div style={{ fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6 }}>{l}</div>
                <div style={{ ...NUM,fontSize:28,color:c }}>{pipeline.filter(p=>p.status===s).length}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {pipeline.map(item=>{
              const gap=item.askingPrice&&item.offerMade?item.askingPrice-item.offerMade:null,sup=suppliers.find(s=>s.id===item.supplierId);
              return (
                <div key={item.id} style={{ ...CARD, padding:"16px 20px", display:"flex", gap:16, alignItems:"center", flexWrap:"wrap" }}>
                  <div style={{ flex:1, minWidth:200 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                      <span style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:600 }}>{item.name||"—"}</span>
                      <span style={{ fontSize:11, color:"#666" }}>{item.set}</span>
                      <Badge status={item.status}/>
                    </div>
                    <div style={{ fontSize:11, color:"#555" }}>{item.cardNo} {item.year&&`· ${item.year}`}{sup?` · ${sup.name}`:""}</div>
                    <div style={{ fontSize:11, color:"#666", marginTop:4 }}>{item.notes}</div>
                    {item.lastContact&&<div style={{ fontSize:10, color:"#444", marginTop:4 }}>Last contact: {item.lastContact}</div>}
                  </div>
                  <div style={{ display:"flex", gap:14, alignItems:"center", flexWrap:"wrap" }}>
                    {[["Asking",item.askingPrice,"#888"],["Offer",item.offerMade,"#c9a84c"],["Gap",gap,gap>0?"#e85d04":"#5de08a"]].map(([l,v,c])=>(
                      <div key={l} style={{ textAlign:"right" }}>
                        <div style={{ fontSize:10,color:"#444",marginBottom:2 }}>{l}</div>
                        <div style={{ ...NUM,fontSize:14,color:v?c:"#444" }}>{v?fmtC(v):"—"}</div>
                      </div>
                    ))}
                    {isAdmin&&<div style={{ display:"flex", gap:5 }}>
                      {["tracking","interested","negotiating"].map(s=>(
                        <button key={s} onClick={()=>setPipeline(p=>p.map(x=>x.id===item.id?{...x,status:s}:x))}
                          className="pill" style={{ background:item.status===s?"#c9a84c":"#181818", color:item.status===s?"#0d0d0d":"#666", fontWeight:item.status===s?700:400, fontSize:10, padding:"4px 8px" }}>{s}</button>
                      ))}
                      <button onClick={()=>{if(window.confirm("Remove from pipeline?"))setPipeline(p=>p.filter(x=>x.id!==item.id));}} className="ghost" style={{ color:"#e85d04",borderColor:"#3a1a1a" }}>🗑</button>
                    </div>}
                  </div>
                </div>
              );
            })}
            {!pipeline.length&&<div style={{ color:"#444",fontSize:13,textAlign:"center",padding:"40px 0" }}>No deals in pipeline</div>}
          </div>
        </>}

        {/* ── CALCULATOR ── */}
        {tab==="Calculator"&&<MarketCalculator cards={cards} sold={sold} netProf={netProf} netMarg={netMarg} fmtC={fmtC} pct={pct} currency={CUR.symbol}/>}

      </div>

      {cm&&isAdmin&&<CardModal data={cm==="new"?null:cm} suppliers={suppliers} onClose={()=>setCm(null)} onSave={saveCard}/>}
      {sm&&isAdmin&&<SupplierModal data={sm==="new"?null:sm} onClose={()=>setSm(null)} onSave={saveSupplier}/>}
      {tlm&&isAdmin&&<TimelineModal card={tlm} onClose={()=>setTlm(null)} onSave={saveTimeline}/>}
      {drawer&&<CardDrawer card={drawer} suppliers={suppliers} onClose={()=>setDrawer(null)} onEdit={()=>{if(isAdmin){setCm(drawer);setDrawer(null);}}} onDuplicate={()=>{if(isAdmin){duplicateCard(drawer);setDrawer(null);}}} onDelete={()=>{if(isAdmin){deleteCard(drawer.id);}}}/>}
      {isAdmin&&!cm&&!sm&&!tlm&&!drawer&&<div style={{ position:"fixed", bottom:16, right:20, fontSize:10, color:"#333", fontFamily:"'IBM Plex Mono',monospace", pointerEvents:"none" }}>Press <span style={{color:"#555"}}>N</span> to add · <span style={{color:"#555"}}>Esc</span> to close</div>}
    </div>
  );
}
