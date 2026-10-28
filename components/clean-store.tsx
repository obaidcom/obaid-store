"use client";

import { useMemo, useState } from "react";
import { Search, ShoppingBag, Heart, UserRound, Menu, X, ArrowLeft, Truck, ShieldCheck, Headphones, ChevronLeft, Plus, Minus, Trash2, Sparkles } from "lucide-react";

type Product = { id:number; name:string; category:string; price:number; oldPrice?:number; image:string; badge?:string; };
const products:Product[] = [
 {id:1,name:"سماعات لاسلكية عازلة للضوضاء",category:"إلكترونيات",price:185000,oldPrice:230000,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30b?auto=format&fit=crop&w=700&q=85",badge:"الأكثر مبيعاً"},
 {id:2,name:"ساعة ذكية رياضية",category:"إلكترونيات",price:245000,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85",badge:"جديد"},
 {id:3,name:"حقيبة يومية بتصميم أنيق",category:"أزياء",price:165000,oldPrice:195000,image:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=85"},
 {id:4,name:"مصباح مكتبي عصري",category:"المنزل",price:98000,image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=85"},
 {id:5,name:"حذاء رياضي مريح",category:"أزياء",price:290000,oldPrice:325000,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",badge:"عرض"},
 {id:6,name:"كاميرا فورية للذكريات",category:"إلكترونيات",price:420000,image:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=85"},
 {id:7,name:"كوب حراري للسفر",category:"المنزل",price:72000,image:"https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=85"},
 {id:8,name:"نظارة شمسية كلاسيكية",category:"أزياء",price:115000,image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=85"},
];
const categories = [
 {name:"الكل",image:"https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=500&q=80"},
 {name:"إلكترونيات",image:"https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=500&q=80"},
 {name:"أزياء",image:"https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=500&q=80"},
 {name:"المنزل",image:"https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=500&q=80"},
];
const money = (n:number) => new Intl.NumberFormat("ar-SY").format(n) + " ل.س";

export function CleanStore() {
 const [query,setQuery] = useState("");
 const [category,setCategory] = useState("الكل");
 const [cart,setCart] = useState<Record<number,number>>({});
 const [favorites,setFavorites] = useState<number[]>([]);
 const [drawer,setDrawer] = useState<"cart"|"account"|"menu"|null>(null);
 const [notice,setNotice] = useState("");
 const [slide,setSlide] = useState(0);
 const slides = [
  {eyebrow:"اختيارات هذا الموسم",title:"كل ما تحبّه،
في مكان واحد",desc:"اكتشف منتجات مختارة بعناية وأسعار واضحة وتجربة تسوّق عربية سهلة.",image:"https://images.unsplash.com/photo-1498049794561-7780e723456?auto=format&fit=crop&w=1600&q=85",cta:"اكتشف المنتجات"},
  {eyebrow:"تقنية تناسب يومك",title:"ارتقِ بتجربتك
مع منتجات ذكية",desc:"إلكترونيات وإكسسوارات تجمع بين التصميم الجميل والاستخدام العملي.",image:"https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=85",cta:"تسوّق الإلكترونيات"},
  {eyebrow:"لمسات تصنع الفرق",title:"تفاصيل صغيرة،
أناقة أكبر",desc:"اكتشف قطعاً مميزة للمنزل وإطلالتك اليومية.",image:"https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=85",cta:"اكتشف الجديد"}
 ];
 const visible = useMemo(()=>products.filter(p=>(category==="الكل"||p.category===category)&&p.name.includes(query.trim())),[category,query]);
 const cartItems = products.filter(p=>cart[p.id]);
 const count = Object.values(cart).reduce((a,b)=>a+b,0);
 const total = cartItems.reduce((sum,p)=>sum+p.price*cart[p.id],0);
 const add = (id:number) => {setCart(c=>({...c,[id]:(c[id]||0)+1}));setNotice("أُضيف المنتج إلى سلتك");setTimeout(()=>setNotice(""),2200);};
 const toggleFavorite = (id:number) => setFavorites(f=>f.includes(id)?f.filter(x=>x!==id):[...f,id]);
 const scrollProducts = () => document.getElementById("products")?.scrollIntoView({behavior:"smooth"});
 return <main dir="rtl" className="min-h-screen bg-[#f2f6ff] text-[#17294c]">
  <div className="bg-[#123b91] px-4 py-2 text-center text-xs font-bold text-white">تسوّق براحة — الدفع عند الاستلام متاح ضمن خيارات المتجر التجريبية</div>
  <header className="sticky top-0 z-40 border-b border-blue-100 bg-[#1646a8] text-white shadow-lg shadow-blue-950/10">
   <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:px-6">
    <button onClick={()=>setDrawer("menu")} className="rounded-xl border border-white/20 p-2 lg:hidden" aria-label="القائمة"><Menu size={20}/></button>
    <a href="#home" className="flex shrink-0 items-center gap-2.5">
     <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-blue-800 shadow"><ShoppingBag size={23}/></span>
     <span><b className="block text-lg font-black leading-tight">عبيد ستور</b><small className="text-[10px] text-blue-100">تسوّق بثقة، كل يوم</small></span>
    </a>
    <nav className="hidden items-center gap-1 text-sm font-bold lg:flex">
     <a className="rounded-xl bg-white/15 px-3 py-2" href="#home">الرئيسية</a><a className="rounded-xl px-3 py-2 hover:bg-white/10" href="#categories">الأقسام</a><a className="rounded-xl px-3 py-2 hover:bg-white/10" href="#products">المنتجات</a><a className="rounded-xl px-3 py-2 hover:bg-white/10" href="#footer">اتصل بنا</a>
    </nav>
    <label className="mx-auto hidden max-w-md flex-1 items-center gap-2 rounded-xl border border-white/20 bg-white px-3 py-2 text-slate-700 md:flex"><Search size={18} className="text-blue-600"/><input value={query} onChange={e=>{setQuery(e.target.value);document.getElementById("products")?.scrollIntoView({behavior:"smooth"});}} placeholder="ابحث عن منتج..." className="w-full bg-transparent text-sm outline-none" /></label>
    <div className="mr-auto flex items-center gap-2">
     <button onClick={()=>setDrawer("account")} className="hidden rounded-xl border border-white/20 p-2.5 hover:bg-white/10 sm:block" aria-label="حسابي"><UserRound size={20}/></button>
     <button onClick={()=>{setCategory("الكل");setQuery("");scrollProducts();}} className="relative hidden rounded-xl border border-white/20 p-2.5 hover:bg-white/10 sm:block" aria-label="المفضلة"><Heart size={20}/>{favorites.length>0&&<span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px]">{favorites.length}</span>}</button>
     <button onClick={()=>setDrawer("cart")} className="relative flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 font-extrabold text-blue-800 shadow-md"><ShoppingBag size={19}/><span className="hidden sm:inline">السلة</span><span className="grid h-5 min-w-5 place-items-center rounded-full bg-blue-100 px-1 text-[10px]">{count}</span></button>
    </div>
   </div>
   <div className="px-4 pb-3 md:hidden"><label className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-slate-700"><Search size={18} className="text-blue-600"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث عن منتج..." className="w-full bg-transparent text-sm outline-none"/></label></div>
  </header>
  <section id="home" className="mx-auto max-w-7xl px-3 pt-5 md:px-6 md:pt-8">
   <div className="relative isolate min-h-[370px] overflow-hidden rounded-[26px] border border-blue-100 bg-[#dce8ff] shadow-xl shadow-blue-950/10 md:min-h-[465px]">
    <img src={slides[slide].image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35 md:opacity-70" />
    <div className="absolute inset-0 bg-gradient-to-l from-[#f7faff] via-[#f0f5ff]/95 to-[#e2ebff]/55"/>
    <div className="relative z-10 flex min-h-[370px] items-center px-6 py-10 md:min-h-[465px] md:px-14">
     <div className="max-w-xl">
      <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/85 px-4 py-2 text-xs font-extrabold text-blue-700"><Sparkles size={15}/>{slides[slide].eyebrow}</span>
      <h1 className="whitespace-pre-line text-4xl font-black leading-[1.25] tracking-tight text-[#172b50] md:text-6xl">{slides[slide].title}</h1>
      <p className="mt-5 max-w-lg text-sm leading-8 text-slate-600 md:text-base">{slides[slide].desc}</p>
      <div className="mt-7 flex flex-wrap items-center gap-3"><button onClick={scrollProducts} className="flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-700/20 hover:bg-blue-800">{slides[slide].cta}<ArrowLeft size={17}/></button><span className="text-xs font-bold text-slate-500">منتجات مختارة • تجربة عربية</span></div>
     </div>
    </div>
    <img src={slides[slide].image} alt="" aria-hidden="true" className="absolute bottom-0 left-0 h-20 w-full scale-y-[-1] object-cover opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent)] md:h-28"/>
    <div className="absolute bottom-5 left-5 z-20 flex gap-2">{slides.map((s,i)=><button key={s.eyebrow} onClick={()=>setSlide(i)} aria-label={"الشريحة "+(i+1)} className={"h-2.5 rounded-full transition-all "+(slide===i?"w-8 bg-blue-700":"w-2.5 bg-white/80")}/>)}</div>
    <button onClick={()=>setSlide((slide+slides.length-1)%slides.length)} aria-label="السابق" className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white bg-white/90 p-3 text-blue-800 shadow md:block"><ChevronLeft size={19}/></button>
    <button onClick={()=>setSlide((slide+1)%slides.length)} aria-label="التالي" className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white bg-white/90 p-3 text-blue-800 shadow md:block"><ChevronLeft size={19} className="rotate-180"/></button>
   </div>
  </section>
  <section className="mx-auto grid max-w-7xl grid-cols-1 gap-3 px-4 py-5 sm:grid-cols-3 md:px-6 md:py-7">
   {[{icon:Truck,title:"توصيل مرن",desc:"خيارات توصيل حسب المنطقة"},{icon:ShieldCheck,title:"تسوّق مطمئن",desc:"تفاصيل واضحة لكل منتج"},{icon:Headphones,title:"نحن هنا للمساعدة",desc:"خدمة عملاء تهتم بك"}].map(({icon:Icon,title,desc})=><div key={title} className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white/90 p-4 shadow-sm"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon size={21}/></span><span><b className="block text-sm">{title}</b><small className="mt-1 block text-xs text-slate-500">{desc}</small></span></div>)}
  </section>
  <section id="categories" className="mx-auto max-w-7xl px-4 py-5 md:px-6">
   <div className="mb-5 flex items-end justify-between"><div><span className="text-xs font-black text-blue-700">تصفّح كما تحب</span><h2 className="mt-1 text-2xl font-black md:text-3xl">تسوّق حسب القسم</h2></div><button onClick={()=>{setCategory("الكل");scrollProducts();}} className="text-xs font-extrabold text-blue-700">كل المنتجات ←</button></div>
   <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">{categories.map(c=><button key={c.name} onClick={()=>{setCategory(c.name);scrollProducts();}} className={"group relative h-36 overflow-hidden rounded-2xl border text-right shadow-sm transition hover:-translate-y-1 hover:shadow-lg md:h-48 "+(category===c.name?"border-blue-500 ring-2 ring-blue-200":"border-white")}><img src={c.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"/><div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/10 to-transparent"/><span className="absolute bottom-4 right-4 text-lg font-black text-white">{c.name==="الكل"?"كل المنتجات":c.name}</span><span className="absolute bottom-4 left-4 rounded-full bg-white/20 p-1.5 text-white backdrop-blur"><ArrowLeft size={15}/></span></button>)}</div>
  </section>
  <section className="mx-auto max-w-7xl px-4 py-5 md:px-6">
   <div className="flex flex-col gap-4 rounded-[22px] border border-blue-100 bg-gradient-to-l from-[#dbe7ff] via-[#f6f8ff] to-[#e2ecff] p-5 sm:flex-row sm:items-center sm:justify-between md:p-7"><div><span className="text-xs font-black text-blue-700">اختيارات تستحق الاكتشاف</span><h2 className="mt-1 text-xl font-black md:text-2xl">جدد أسلوبك بمنتجات مميزة</h2><p className="mt-2 text-sm text-slate-600">تعرّف على مجموعة من المنتجات التي اخترناها لك.</p></div><button onClick={scrollProducts} className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-extrabold text-white hover:bg-blue-800">اكتشف المنتجات<ArrowLeft size={17}/></button></div>
  </section>
  <section id="products" className="mx-auto max-w-7xl px-4 py-7 pb-16 md:px-6 md:py-10">
   <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><span className="text-xs font-black text-blue-700">اختيرت بعناية</span><h2 className="mt-1 text-2xl font-black md:text-3xl">منتجات مميزة</h2><p className="mt-2 text-sm text-slate-500">أسعار تجريبية بالليرة السورية — ليست متصلة بقاعدة بيانات.</p></div><select aria-label="القسم" value={category} onChange={e=>setCategory(e.target.value)} className="rounded-xl border border-blue-100 bg-white px-3 py-2.5 text-sm font-bold outline-none">{categories.map(c=><option key={c.name} value={c.name}>{c.name}</option>)}</select></div>
   {visible.length?<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">{visible.map(p=><article key={p.id} className="group min-w-0 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/10">
    <div className="relative aspect-square overflow-hidden bg-[#eaf1ff]"><img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>{p.badge&&<span className="absolute right-2 top-2 rounded-lg bg-blue-700 px-2 py-1 text-[10px] font-extrabold text-white">{p.badge}</span>}<button onClick={()=>toggleFavorite(p.id)} aria-label="أضف إلى المفضلة" className={"absolute left-2 top-2 rounded-full p-2 shadow transition "+(favorites.includes(p.id)?"bg-rose-500 text-white":"bg-white/95 text-slate-600 hover:text-rose-500")}><Heart size={17} fill={favorites.includes(p.id)?"currentColor":"none"}/></button><button onClick={()=>add(p.id)} aria-label="أضف للسلة" className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-2 rounded-xl bg-white/95 py-2.5 text-xs font-black text-blue-800 shadow-lg backdrop-blur hover:bg-blue-700 hover:text-white"><Plus size={16}/> أضف إلى السلة</button></div>
    <div className="p-3 md:p-4"><small className="text-[10px] font-bold text-blue-700">{p.category}</small><h3 className="mt-1 min-h-10 text-sm font-extrabold leading-6">{p.name}</h3><div className="mt-3 flex flex-wrap items-baseline gap-2"><b className="text-sm font-black text-blue-800 md:text-base">{money(p.price)}</b>{p.oldPrice&&<del className="text-[10px] text-slate-400">{money(p.oldPrice)}</del>}</div></div>
   </article>)}</div>:<div className="rounded-2xl border border-blue-100 bg-white p-10 text-center text-slate-500">لا توجد منتجات مطابقة لبحثك.</div>}
  </section>
  <footer id="footer" className="border-t border-blue-100 bg-[#e6eeff] px-4 pb-24 pt-9 md:px-6 md:pb-8"><div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4"><div><div className="flex items-center gap-2"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-700 text-white"><ShoppingBag size={20}/></span><b className="text-lg font-black">عبيد ستور</b></div><p className="mt-3 max-w-xs text-sm leading-7 text-slate-600">متجر عربي قيد البناء، نعمل على تقديم تجربة تسوّق بسيطة وعصرية.</p></div><div><b className="text-sm">روابط المتجر</b><div className="mt-3 grid gap-2 text-sm text-slate-600"><a href="#home" className="hover:text-blue-700">الرئيسية</a><a href="#categories" className="hover:text-blue-700">الأقسام</a><a href="#products" className="hover:text-blue-700">المنتجات</a></div></div><div><b className="text-sm">خدمة العملاء</b><div className="mt-3 grid gap-2 text-sm text-slate-600"><button onClick={()=>setNotice("سيتم إضافة صفحة سياسة الخصوصية ضمن المرحلة التالية.")} className="text-right hover:text-blue-700">سياسة الخصوصية</button><button onClick={()=>setNotice("سيتم إضافة شروط الاستخدام ضمن المرحلة التالية.")} className="text-right hover:text-blue-700">الشروط والأحكام</button><button onClick={()=>setNotice("قنوات التواصل ستُضاف بعد تحديد بيانات المتجر الرسمية.")} className="text-right hover:text-blue-700">اتصل بنا</button></div></div><div><b className="text-sm">تجربة تسوّق أفضل</b><p className="mt-3 text-sm leading-7 text-slate-600">تصميم متجاوب للهاتف والكمبيوتر. الطلبات والدفع هنا تجريبيان ولا يتم إرسال طلب حقيقي.</p></div></div><div className="mx-auto mt-8 max-w-7xl border-t border-blue-200 pt-4 text-xs text-slate-500">© {new Date().getFullYear()} عبيد ستور — نسخة تطوير تجريبية</div></footer>
  <nav aria-label="التنقل السريع" className="fixed bottom-3 left-3 right-3 z-40 flex items-center justify-around rounded-2xl border border-blue-100 bg-white/95 p-2 text-[10px] font-bold text-slate-500 shadow-xl backdrop-blur md:hidden"><a href="#home" className="flex flex-col items-center gap-1 px-3 py-1 text-blue-700"><ShoppingBag size={20}/>الرئيسية</a><a href="#categories" className="flex flex-col items-center gap-1 px-3 py-1"><Menu size={20}/>الأقسام</a><button onClick={()=>setDrawer("cart")} className="flex flex-col items-center gap-1 rounded-xl bg-blue-700 px-4 py-2 text-white"><ShoppingBag size={20}/>السلة ({count})</button><button onClick={()=>setDrawer("account")} className="flex flex-col items-center gap-1 px-3 py-1"><UserRound size={20}/>حسابي</button></nav>
  {notice&&<div role="status" className="fixed bottom-24 left-1/2 z-[70] -translate-x-1/2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-xl">{notice}</div>}
  {drawer&&<div className="fixed inset-0 z-[60] flex justify-end bg-slate-950/50" onClick={()=>setDrawer(null)}><aside onClick={e=>e.stopPropagation()} className="flex h-full w-full max-w-md flex-col overflow-y-auto border-r border-blue-100 bg-[#f7f9ff] p-5 text-[#17294c] shadow-2xl"><div className="flex items-center justify-between border-b border-blue-100 pb-4"><h2 className="text-xl font-black">{drawer==="cart"?"سلة التسوق":drawer==="account"?"حسابي":"القائمة"}</h2><button onClick={()=>setDrawer(null)} className="rounded-xl border border-blue-100 bg-white p-2" aria-label="إغلاق"><X size={19}/></button></div>
   {drawer==="cart"?<><div className="flex-1 py-4">{cartItems.length?cartItems.map(p=><div key={p.id} className="mb-3 flex gap-3 rounded-2xl border border-blue-100 bg-white p-3"><img src={p.image} alt="" className="h-20 w-20 rounded-xl object-cover"/><div className="min-w-0 flex-1"><b className="block text-sm">{p.name}</b><span className="mt-1 block text-xs font-bold text-blue-700">{money(p.price)}</span><div className="mt-2 flex items-center gap-2"><button onClick={()=>setCart(c=>({...c,[p.id]:Math.max(0,(c[p.id]||0)-1)}))} className="rounded-md border border-blue-100 p-1"><Minus size={13}/></button><span className="text-xs font-black">{cart[p.id]}</span><button onClick={()=>add(p.id)} className="rounded-md border border-blue-100 p-1"><Plus size={13}/></button><button onClick={()=>setCart(c=>({...c,[p.id]:0}))} aria-label="حذف المنتج" className="mr-auto rounded-md p-1 text-rose-500"><Trash2 size={15}/></button></div></div></div>):<div className="py-16 text-center text-slate-500"><ShoppingBag size={35} className="mx-auto mb-3 text-blue-300"/><b>سلتك فارغة حالياً</b><p className="mt-2 text-sm">أضف المنتجات التي أعجبتك لتظهر هنا.</p></div>}</div><div className="border-t border-blue-100 pt-4"><div className="mb-4 flex justify-between font-black"><span>المجموع</span><span className="text-blue-800">{money(total)}</span></div><button onClick={()=>{setNotice("الدفع والطلبات غير مفعّلة بعد؛ هذه نسخة واجهة تجريبية.");setDrawer(null);setTimeout(()=>setNotice(""),3500)}} disabled={!cartItems.length} className="w-full rounded-xl bg-blue-700 py-3.5 font-extrabold text-white disabled:opacity-40">متابعة إتمام الطلب (تجريبي)</button><p className="mt-2 text-center text-[11px] text-slate-500">لا يتم إرسال طلب أو تحصيل دفعة حقيقية.</p></div></>:drawer==="account"?<div className="py-7"><div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-blue-100 text-blue-700"><UserRound size={34}/></div><h3 className="mt-4 text-center text-lg font-black">أهلاً بك في عبيد ستور</h3><p className="mt-2 text-center text-sm leading-7 text-slate-500">ملف الحساب وتسجيل الدخول سيُفعّلان بعد تجهيز نظام الحسابات بشكل آمن.</p><div className="mt-6 rounded-xl border border-blue-100 bg-white p-4 text-sm leading-7">هذه نسخة واجهة فقط. لا تدخل بيانات شخصية أو كلمات مرور هنا.</div></div>:<div className="grid gap-3 py-5"><a onClick={()=>setDrawer(null)} href="#home" className="rounded-xl bg-white p-4 font-bold">الرئيسية</a><a onClick={()=>setDrawer(null)} href="#categories" className="rounded-xl bg-white p-4 font-bold">الأقسام</a><a onClick={()=>setDrawer(null)} href="#products" className="rounded-xl bg-white p-4 font-bold">المنتجات</a><button onClick={()=>{setDrawer("account")}} className="rounded-xl bg-white p-4 text-right font-bold">حسابي</button></div>}
  </aside></div>}
 </main>;
}
