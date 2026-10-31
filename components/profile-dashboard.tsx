"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserRound, Package, MapPin, Heart, ShieldCheck, Headphones, LogOut, Camera, Save,
  Plus, Trash2, Star, FileText, ChevronLeft, Menu, X, Mail, Phone, LockKeyhole,
  LoaderCircle, CheckCircle2, ShoppingBag, CalendarDays, Truck, Home, Edit3
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";

type Profile = { id:string; full_name:string; phone:string; governorate:string; default_address:string; avatar_url:string|null; theme:string };
type Address = { id:string; label:string; recipient_name:string; phone:string; governorate:string; district:string; address_line:string; details:string; is_default:boolean };
type Order = { id:string; order_number:string; status:string; payment_status:string; payment_method:string; total:number; created_at:string; tracking_code:string|null; shipping_address:string; governorate:string };
type Product = { id:string; name:string; image_url:string|null; price:number };

const nav = [
  {id:"profile",label:"البيانات الشخصية",icon:UserRound},
  {id:"orders",label:"طلباتي ومتابعة الشحن",icon:Package},
  {id:"addresses",label:"عناوين التوصيل",icon:MapPin},
  {id:"favorites",label:"قائمة المفضلة",icon:Heart},
  {id:"security",label:"الأمان وكلمة المرور",icon:ShieldCheck},
  {id:"support",label:"الدعم والمساعدة",icon:Headphones},
] as const;
type Section = typeof nav[number]["id"];
const governorates = ["دمشق","ريف دمشق","حلب","حمص","حماة","اللاذقية","طرطوس","إدلب","درعا","السويداء","القنيطرة","دير الزور","الرقة","الحسكة"];
const statusLabel:Record<string,string> = {pending:"قيد المراجعة",confirmed:"تم التأكيد",processing:"قيد التجهيز",shipped:"تم الشحن",delivered:"تم التسليم",cancelled:"ملغي",returned:"مرتجع"};
const paymentLabel:Record<string,string> = {sham_cash:"شام كاش",syriatel_cash:"سيريتل كاش",cash_on_delivery:"الدفع عند الاستلام"};
const money=(n:number)=>new Intl.NumberFormat("ar-SY").format(Number(n||0))+" ل.س";
const dateLabel=(s:string)=>new Date(s).toLocaleDateString("ar-SY",{year:"numeric",month:"long",day:"numeric"});

export function ProfileDashboard() {
  const router=useRouter();
  const [section,setSection]=useState<Section>("profile");
  const [mobileNav,setMobileNav]=useState(false);
  const [user,setUser]=useState<any>(null);
  const [profile,setProfile]=useState<Profile|null>(null);
  const [addresses,setAddresses]=useState<Address[]>([]);
  const [orders,setOrders]=useState<Order[]>([]);
  const [favorites,setFavorites]=useState<Product[]>([]);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [notice,setNotice]=useState("");
  const [error,setError]=useState("");
  const [addressForm,setAddressForm]=useState({label:"المنزل",recipient_name:"",phone:"",governorate:"دمشق",district:"",address_line:"",details:""});
  const [showAddressForm,setShowAddressForm]=useState(false);
  const [newPassword,setNewPassword]=useState("");
  const [confirmPassword,setConfirmPassword]=useState("");

  const load=useCallback(async()=>{
    const supabase=getSupabase();
    if(!supabase){setError("تعذر الاتصال بإعدادات Supabase.");setLoading(false);return;}
    const {data:{user:current},error:authError}=await supabase.auth.getUser();
    if(authError||!current){router.replace("/login");return;}
    setUser(current);
    const {data:row,error:profileError}=await supabase.from("profiles").select("*").eq("id",current.id).maybeSingle();
    if(profileError){setError("تعذر تحميل الملف الشخصي: "+profileError.message);setLoading(false);return;}
    let p=row as Profile|null;
    if(!p){
      const {data:created,error:createError}=await supabase.from("profiles").upsert({id:current.id,full_name:current.user_metadata?.full_name||"",phone:current.user_metadata?.phone||"",governorate:"دمشق",default_address:""},{onConflict:"id"}).select("*").single();
      if(createError){setError("تعذر تجهيز الملف الشخصي: "+createError.message);setLoading(false);return;}
      p=created as Profile;
    }
    setProfile(p);
    const [a,o,f]=await Promise.all([
      supabase.from("addresses").select("*").eq("user_id",current.id).order("created_at",{ascending:false}),
      supabase.from("orders").select("id,order_number,status,payment_status,payment_method,total,created_at,tracking_code,shipping_address,governorate").eq("user_id",current.id).order("created_at",{ascending:false}),
      supabase.from("favorites").select("product_id").eq("user_id",current.id)
    ]);
    if(a.error)setError("تعذر تحميل العناوين: "+a.error.message); else setAddresses((a.data||[]) as Address[]);
    if(o.error)setError("تعذر تحميل الطلبات: "+o.error.message); else setOrders((o.data||[]) as Order[]);
    if(!f.error&&f.data?.length){
      const ids=f.data.map((x:any)=>x.product_id);
      const {data:products}=await supabase.from("products").select("id,name,image_url,price").in("id",ids);
      setFavorites((products||[]) as Product[]);
    }else setFavorites([]);
    setLoading(false);
  },[router]);

  useEffect(()=>{load();},[load]);

  const updateProfile=(key:keyof Profile,value:string)=>setProfile(p=>p?({...p,[key]:value}):p);
  const saveProfile=async(e:FormEvent)=>{e.preventDefault();if(!profile)return;setSaving(true);setNotice("");setError("");const s=getSupabase();if(!s||!user){setSaving(false);return;}
    const {error:e1}=await s.from("profiles").update({full_name:profile.full_name,phone:profile.phone,governorate:profile.governorate,default_address:profile.default_address}).eq("id",user.id);
    if(e1)setError("لم يتم حفظ البيانات: "+e1.message);else{setNotice("تم حفظ بياناتك بنجاح.");setProfile({...profile});}
    setSaving(false);
  };

  const uploadAvatar=async(e:ChangeEvent<HTMLInputElement>)=>{const file=e.target.files?.[0];if(!file||!user||!profile)return;setError("");setNotice("");
    if(!["image/jpeg","image/png","image/webp"].includes(file.type)){setError("اختر صورة JPG أو PNG أو WEBP.");return;}
    if(file.size>3*1024*1024){setError("حجم الصورة يجب ألا يتجاوز 3 ميغابايت.");return;}
    const s=getSupabase();if(!s)return;setSaving(true);
    const path=user.id+"/"+Date.now()+"-"+file.name.replace(/[^a-zA-Z0-9._-]/g,"-");
    const {error:uploadError}=await s.storage.from("avatars").upload(path,file,{upsert:true,contentType:file.type});
    if(uploadError){setError("تعذر رفع الصورة: "+uploadError.message);setSaving(false);return;}
    const {data}=s.storage.from("avatars").getPublicUrl(path);
    const {error:updateError}=await s.from("profiles").update({avatar_url:data.publicUrl}).eq("id",user.id);
    if(updateError)setError("تم رفع الصورة لكن تعذر حفظ رابطها: "+updateError.message);
    else{setProfile({...profile,avatar_url:data.publicUrl});setNotice("تم تحديث الصورة الشخصية.");}
    setSaving(false);e.target.value="";
  };

  const addAddress=async(e:FormEvent)=>{e.preventDefault();if(!user)return;setSaving(true);setError("");const s=getSupabase();if(!s)return;
    const {error:e1}=await s.from("addresses").insert({...addressForm,user_id:user.id,is_default:addresses.length===0});
    if(e1)setError("تعذر إضافة العنوان: "+e1.message);else{setShowAddressForm(false);setAddressForm({label:"المنزل",recipient_name:"",phone:"",governorate:"دمشق",district:"",address_line:"",details:""});await load();setNotice("تمت إضافة عنوان التوصيل.");}
    setSaving(false);
  };
  const deleteAddress=async(id:string)=>{const s=getSupabase();if(!s)return;const {error:e1}=await s.from("addresses").delete().eq("id",id);if(e1)setError(e1.message);else setAddresses(v=>v.filter(a=>a.id!==id));};
  const defaultAddress=async(id:string)=>{if(!user)return;const s=getSupabase();if(!s)return;const {error:e1}=await s.from("addresses").update({is_default:true}).eq("id",id);if(e1)setError(e1.message);else{await s.from("addresses").update({is_default:false}).eq("user_id",user.id).neq("id",id);setAddresses(v=>v.map(a=>({...a,is_default:a.id===id})));}};
  const removeFavorite=async(id:string)=>{if(!user)return;const s=getSupabase();if(!s)return;const {error:e1}=await s.from("favorites").delete().eq("user_id",user.id).eq("product_id",id);if(e1)setError(e1.message);else setFavorites(v=>v.filter(p=>p.id!==id));};
  const changePassword=async(e:FormEvent)=>{e.preventDefault();setError("");setNotice("");if(newPassword.length<8){setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل.");return;}if(newPassword!==confirmPassword){setError("كلمتا المرور غير متطابقتين.");return;}const s=getSupabase();if(!s)return;setSaving(true);const {error:e1}=await s.auth.updateUser({password:newPassword});if(e1)setError("تعذر تغيير كلمة المرور: "+e1.message);else{setNotice("تم تغيير كلمة المرور بنجاح.");setNewPassword("");setConfirmPassword("");}setSaving(false);};
  const signOut=async()=>{const s=getSupabase();if(s)await s.auth.signOut();router.replace("/login");router.refresh();};
  const counts=useMemo(()=>({orders:orders.length,favorites:favorites.length,addresses:addresses.length}),[orders,favorites,addresses]);

  if(loading)return <main dir="rtl" className="grid min-h-screen place-items-center bg-[#eef3fb]"><div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-5 text-slate-600 shadow"><LoaderCircle className="animate-spin text-blue-700"/> جارٍ تحميل حسابك...</div></main>;

  return <main dir="rtl" className="min-h-screen bg-[#eef3fb] text-slate-800">
    <header className="sticky top-0 z-30 border-b border-blue-100 bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3"><div className="flex items-center gap-3"><button onClick={()=>setMobileNav(v=>!v)} className="rounded-xl border border-slate-200 p-2 lg:hidden" aria-label="القائمة">{mobileNav?<X size={19}/>:<Menu size={19}/>}</button><Link href="/" className="flex items-center gap-2"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-700 font-black text-white">ع</span><span><b className="block text-base font-black text-[#14233e]">متجر عبيد</b><small className="text-[9px] tracking-[.2em] text-blue-700">OBEID STORE</small></span></Link></div><div className="flex items-center gap-3"><span className="hidden text-sm text-slate-500 sm:block">{user?.email}</span><button onClick={signOut} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:border-rose-200 hover:text-rose-600"><LogOut size={16}/> خروج</button></div></div></header>
    <div className="mx-auto grid max-w-7xl gap-5 px-3 py-5 sm:px-5 lg:grid-cols-[260px_1fr] lg:py-8">
      <aside className={(mobileNav?"block":"hidden")+" h-fit overflow-hidden rounded-3xl bg-[#111f39] text-white shadow-xl lg:sticky lg:top-24 lg:block"}>
        <div className="border-b border-white/10 p-6"><div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center overflow-hidden rounded-full border-2 border-blue-300/50 bg-blue-500/20">{profile?.avatar_url?<img src={profile.avatar_url} alt="الصورة الشخصية" className="h-full w-full object-cover"/>:<UserRound size={24} className="text-blue-200"/>}</div><div className="min-w-0"><b className="block truncate">{profile?.full_name||"مرحباً بك"}</b><span className="block truncate text-xs text-slate-400">{user?.email}</span></div></div><p className="mt-4 text-xs leading-6 text-slate-400">إدارة حسابك وطلباتك وعناوين التوصيل من مكان واحد.</p></div>
        <nav className="grid gap-1 p-3">{nav.map(item=>{const Icon=item.icon;return <button key={item.id} onClick={()=>{setSection(item.id);setMobileNav(false);setNotice("");setError("");}} className={"flex items-center gap-3 rounded-xl px-4 py-3 text-right text-sm font-bold transition "+(section===item.id?"bg-blue-600 text-white shadow-lg shadow-blue-950/30":"text-slate-300 hover:bg-white/10 hover:text-white")}><Icon size={18}/><span className="flex-1">{item.label}</span>{section===item.id&&<ChevronLeft size={16}/>}</button>})}</nav>
        <div className="m-3 rounded-2xl border border-white/10 bg-white/5 p-4"><div className="mb-2 flex items-center gap-2 text-xs font-bold text-blue-200"><ShieldCheck size={16}/> حسابك محمي</div><p className="text-[11px] leading-5 text-slate-400">بياناتك الشخصية لا تظهر إلا لحسابك وفق صلاحيات قاعدة البيانات.</p></div>
      </aside>
      <section className="min-w-0">
        <div className="mb-5 rounded-3xl bg-gradient-to-l from-[#102345] via-[#174b93] to-[#2876d8] p-6 text-white shadow-lg sm:p-8"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="mb-2 text-sm font-semibold text-blue-100">مرحباً بك في عبيد ستور</p><h1 className="text-2xl font-black sm:text-3xl">{profile?.full_name?profile.full_name:"حسابك الشخصي"}</h1><p className="mt-2 text-sm text-blue-100">كل ما يخص حسابك وطلباتك أصبح في مكان واحد.</p></div><div className="hidden h-16 w-16 place-items-center rounded-2xl border border-white/20 bg-white/10 sm:grid"><ShoppingBag size={31}/></div></div><div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">{[{n:counts.orders,l:"طلباتي"},{n:counts.addresses,l:"عناويني"},{n:counts.favorites,l:"المفضلة"}].map(x=><div key={x.l} className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3"><b className="block text-xl">{x.n}</b><span className="text-xs text-blue-100">{x.l}</span></div>)}</div></div>
        {error&&<div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
        {notice&&<div role="status" className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"><CheckCircle2 size={17}/>{notice}</div>}
        {section==="profile"&&<div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm sm:p-7"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-black text-[#14233e]">البيانات الشخصية</h2><p className="mt-1 text-sm text-slate-500">حدّث بياناتك لتسهيل التواصل والتوصيل.</p></div><span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">ملفك الشخصي</span></div>
          <div className="mb-7 flex flex-wrap items-center gap-4"><div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full border-4 border-blue-100 bg-blue-50 text-blue-700">{profile?.avatar_url?<img src={profile.avatar_url} alt="الصورة الشخصية" className="h-full w-full object-cover"/>:<UserRound size={42}/>}</div><div><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800"><Camera size={17}/> تغيير الصورة<input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={uploadAvatar}/></label><p className="mt-2 text-xs text-slate-400">JPG أو PNG أو WEBP، حتى 3 ميغابايت.</p></div></div>
          <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-bold">الاسم الكامل<input value={profile?.full_name||""} onChange={e=>updateProfile("full_name",e.target.value)} required className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"/></label><label className="grid gap-2 text-sm font-bold">البريد الإلكتروني<input value={user?.email||""} readOnly className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500"/></label><label className="grid gap-2 text-sm font-bold">رقم الهاتف<input type="tel" value={profile?.phone||""} onChange={e=>updateProfile("phone",e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"/></label><label className="grid gap-2 text-sm font-bold">المحافظة<select value={profile?.governorate||"دمشق"} onChange={e=>updateProfile("governorate",e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500">{governorates.map(g=><option key={g}>{g}</option>)}</select></label><label className="grid gap-2 text-sm font-bold sm:col-span-2">العنوان الافتراضي<textarea value={profile?.default_address||""} onChange={e=>updateProfile("default_address",e.target.value)} rows={3} placeholder="المدينة، الحي، الشارع، أقرب نقطة دالة" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"/></label><div className="sm:col-span-2"><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 font-extrabold text-white hover:bg-blue-800 disabled:opacity-60">{saving?<LoaderCircle size={17} className="animate-spin"/>:<Save size={17}/>} حفظ التغييرات</button></div></form>
        </div>}
        {section==="orders"&&<div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm sm:p-7"><h2 className="text-xl font-black text-[#14233e]">طلباتي ومتابعة الشحن</h2><p className="mb-6 mt-1 text-sm text-slate-500">تابع حالة كل طلب واحتفظ بملخص قابل للطباعة.</p>{orders.length===0?<div className="rounded-2xl bg-slate-50 p-10 text-center"><Package size={36} className="mx-auto mb-3 text-slate-300"/><b>لا توجد طلبات حتى الآن</b><p className="mt-2 text-sm text-slate-500">ستظهر طلباتك هنا بعد إتمام الشراء من المتجر.</p><Link href="/" className="mt-4 inline-flex rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white">ابدأ التسوق</Link></div>:<div className="grid gap-4">{orders.map(o=><article key={o.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><b className="text-[#14233e]">{o.order_number}</b><p className="mt-1 text-xs text-slate-500"><CalendarDays size={13} className="ml-1 inline"/>{dateLabel(o.created_at)}</p></div><span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">{statusLabel[o.status]||o.status}</span></div><div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3"><div><span className="text-xs text-slate-400">الإجمالي</span><b className="mt-1 block">{money(o.total)}</b></div><div><span className="text-xs text-slate-400">طريقة الدفع</span><b className="mt-1 block text-sm">{paymentLabel[o.payment_method]||o.payment_method}</b></div><div><span className="text-xs text-slate-400">رقم التتبع</span><b className="mt-1 block text-sm">{o.tracking_code||"سيظهر عند الشحن"}</b></div></div><div className="mt-4 flex flex-wrap gap-2"><button onClick={()=>window.print()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-50"><FileText size={15}/> طباعة ملخص الطلب</button>{o.tracking_code&&<span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700"><Truck size={15}/> رقم التتبع: {o.tracking_code}</span>}</div></article>)}</div>}</div>}
        {section==="addresses"&&<div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm sm:p-7"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-black text-[#14233e]">دفتر عناوين التوصيل</h2><p className="mt-1 text-sm text-slate-500">احفظ أكثر من عنوان واختر الافتراضي.</p></div><button onClick={()=>setShowAddressForm(v=>!v)} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white"><Plus size={17}/> إضافة عنوان</button></div>
          {showAddressForm&&<form onSubmit={addAddress} className="mb-5 grid gap-3 rounded-2xl bg-blue-50/70 p-4 sm:grid-cols-2"><label className="grid gap-1 text-sm font-bold">اسم العنوان<input required value={addressForm.label} onChange={e=>setAddressForm({...addressForm,label:e.target.value})} className="rounded-lg border border-blue-100 bg-white px-3 py-2.5"/></label><label className="grid gap-1 text-sm font-bold">اسم المستلم<input required value={addressForm.recipient_name} onChange={e=>setAddressForm({...addressForm,recipient_name:e.target.value})} className="rounded-lg border border-blue-100 bg-white px-3 py-2.5"/></label><label className="grid gap-1 text-sm font-bold">رقم الهاتف<input required value={addressForm.phone} onChange={e=>setAddressForm({...addressForm,phone:e.target.value})} className="rounded-lg border border-blue-100 bg-white px-3 py-2.5"/></label><label className="grid gap-1 text-sm font-bold">المحافظة<select value={addressForm.governorate} onChange={e=>setAddressForm({...addressForm,governorate:e.target.value})} className="rounded-lg border border-blue-100 bg-white px-3 py-2.5">{governorates.map(g=><option key={g}>{g}</option>)}</select></label><label className="grid gap-1 text-sm font-bold">المنطقة / الحي<input value={addressForm.district} onChange={e=>setAddressForm({...addressForm,district:e.target.value})} className="rounded-lg border border-blue-100 bg-white px-3 py-2.5"/></label><label className="grid gap-1 text-sm font-bold sm:col-span-2">العنوان التفصيلي<input required value={addressForm.address_line} onChange={e=>setAddressForm({...addressForm,address_line:e.target.value})} className="rounded-lg border border-blue-100 bg-white px-3 py-2.5"/></label><label className="grid gap-1 text-sm font-bold sm:col-span-2">ملاحظات التوصيل<textarea value={addressForm.details} onChange={e=>setAddressForm({...addressForm,details:e.target.value})} rows={2} className="rounded-lg border border-blue-100 bg-white px-3 py-2.5"/></label><div className="flex gap-2 sm:col-span-2"><button disabled={saving} className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white">حفظ العنوان</button><button type="button" onClick={()=>setShowAddressForm(false)} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold">إلغاء</button></div></form>}
          {addresses.length===0?<p className="rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-500">لم تضف عناوين توصيل بعد.</p>:<div className="grid gap-3 sm:grid-cols-2">{addresses.map(a=><article key={a.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-start justify-between"><div className="flex items-center gap-2"><MapPin className="text-blue-700" size={18}/><b>{a.label}</b></div>{a.is_default&&<span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">افتراضي</span>}</div><p className="mt-3 font-bold">{a.recipient_name}</p><p className="mt-1 text-sm text-slate-600">{a.phone}</p><p className="mt-1 text-sm text-slate-600">{a.governorate} - {a.district}</p><p className="mt-1 text-sm leading-6 text-slate-500">{a.address_line} {a.details}</p><div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">{!a.is_default&&<button onClick={()=>defaultAddress(a.id)} className="text-xs font-bold text-blue-700">تعيين افتراضي</button>}<button onClick={()=>deleteAddress(a.id)} className="mr-auto inline-flex items-center gap-1 text-xs font-bold text-rose-600"><Trash2 size={14}/> حذف</button></div></article>)}</div>}</div>}
        {section==="favorites"&&<div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm sm:p-7"><h2 className="text-xl font-black text-[#14233e]">قائمة المفضلة</h2><p className="mb-6 mt-1 text-sm text-slate-500">المنتجات التي حفظتها للعودة إليها لاحقاً.</p>{favorites.length===0?<div className="rounded-2xl bg-slate-50 p-9 text-center"><Heart size={34} className="mx-auto mb-3 text-slate-300"/><b>قائمة المفضلة فارغة</b><p className="mt-2 text-sm text-slate-500">أضف المنتجات التي تعجبك من المتجر.</p></div>:<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{favorites.map(p=><article key={p.id} className="overflow-hidden rounded-2xl border border-slate-200"><div className="aspect-square bg-slate-50">{p.image_url&&<img src={p.image_url} alt={p.name} className="h-full w-full object-cover"/>}</div><div className="p-3"><b className="block truncate text-sm">{p.name}</b><p className="mt-1 text-xs font-bold text-blue-700">{money(p.price)}</p><button onClick={()=>removeFavorite(p.id)} className="mt-3 text-xs font-bold text-rose-600">إزالة من المفضلة</button></div></article>)}</div>}</div>}
        {section==="security"&&<div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm sm:p-7"><div className="mb-6"><h2 className="text-xl font-black text-[#14233e]">الأمان وكلمة المرور</h2><p className="mt-1 text-sm text-slate-500">حدّث كلمة المرور للحفاظ على أمان حسابك.</p></div><form onSubmit={changePassword} className="grid max-w-xl gap-4"><label className="grid gap-2 text-sm font-bold">كلمة المرور الجديدة<input type="password" minLength={8} required value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"/></label><label className="grid gap-2 text-sm font-bold">تأكيد كلمة المرور<input type="password" minLength={8} required value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"/></label><button disabled={saving} className="w-fit rounded-xl bg-blue-700 px-6 py-3.5 font-bold text-white disabled:opacity-60">تحديث كلمة المرور</button></form><div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-4"><div className="flex items-center gap-2 font-bold text-blue-900"><ShieldCheck size={18}/> حماية الحساب</div><p className="mt-2 text-sm leading-6 text-blue-800">لا تشارك كلمة المرور أو رمز التحقق مع أي شخص. يمكنك تسجيل الخروج من الأجهزة العامة بعد الانتهاء.</p></div></div>}
        {section==="support"&&<div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm sm:p-7"><h2 className="text-xl font-black text-[#14233e]">الدعم والمساعدة</h2><p className="mt-2 text-sm leading-7 text-slate-500">نحن هنا لمساعدتك في الطلبات والحساب والتوصيل.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><a href="mailto:obaidstore.shop@gmail.com" className="rounded-2xl border border-slate-200 p-5 hover:border-blue-300"><Mail className="mb-3 text-blue-700"/><b>البريد الإلكتروني</b><p className="mt-1 text-sm text-slate-500">obaidstore.shop@gmail.com</p></a><a href="https://wa.me/" className="rounded-2xl border border-slate-200 p-5 hover:border-blue-300"><Headphones className="mb-3 text-blue-700"/><b>خدمة العملاء</b><p className="mt-1 text-sm text-slate-500">تواصل مع فريق المتجر عند توفر رقم الدعم.</p></a></div><p className="mt-5 text-xs leading-6 text-slate-400">سياسة الخصوصية وشروط الاستخدام متاحة من صفحات المتجر.</p></div>}
      </section>
    </div>
  </main>;
}
