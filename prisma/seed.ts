import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
 const categories = [
  {name:"إلكترونيات",slug:"electronics",sortOrder:1},
  {name:"أزياء",slug:"fashion",sortOrder:2},
  {name:"المنزل",slug:"home",sortOrder:3},
  {name:"العناية",slug:"care",sortOrder:4}
 ];
 for (const c of categories) await prisma.category.upsert({where:{slug:c.slug},update:{name:c.name,sortOrder:c.sortOrder},create:c});
 const items = [
  ["سماعات لاسلكية","wireless-headphones","electronics",285000,24],
  ["ساعة ذكية","smart-watch","electronics",420000,16],
  ["حقيبة يومية","daily-bag","fashion",195000,18],
  ["حذاء رياضي","sport-shoes","fashion",310000,20],
  ["مصباح مكتبي","desk-lamp","home",165000,15],
  ["كاميرا فورية","instant-camera","electronics",560000,8],
  ["مجموعة عناية","care-set","care",125000,30],
  ["زجاجة حرارية","thermal-bottle","home",88000,40],
  ["شاحن سريع","fast-charger","electronics",97000,35],
  ["محفظة جلدية","leather-wallet","fashion",112000,22],
  ["وسادة سفر","travel-pillow","home",65000,26],
  ["حامل هاتف","phone-stand","electronics",45000,50],
  ["نظارات شمسية","sunglasses","fashion",135000,17],
  ["مرطب بشرة","skin-moisturizer","care",72000,32],
  ["منظم مكتب","desk-organizer","home",59000,28],
  ["سماعة محمولة","portable-speaker","electronics",175000,14],
  ["حقيبة ظهر","backpack","fashion",225000,19],
  ["مرآة تجميل","makeup-mirror","care",105000,12],
  ["مصباح ليلي","night-light","home",78000,21],
  ["كابل شحن","charging-cable","electronics",35000,60]
 ] as const;
 for (const [name,slug,categorySlug,price,stock] of items) {
  const category=await prisma.category.findUniqueOrThrow({where:{slug:categorySlug}});
  await prisma.product.upsert({where:{slug},update:{},create:{name,slug,description:"منتج تجريبي — أضف الوصف والصور الفعلية قبل النشر.",priceSyp:BigInt(price),stock,isActive:false,images:[],categoryId:category.id}});
 }
}
main().finally(async()=>prisma.$disconnect());
