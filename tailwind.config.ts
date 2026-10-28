import type { Config } from "tailwindcss";
const config: Config = {
 content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
 theme: { extend: { fontFamily: { sans: ["Arial","Tahoma","sans-serif"] }, colors: { brand: {50:"#eff6ff",100:"#dbeafe",500:"#2874e8",600:"#1558c0",700:"#17479a",950:"#0b1834"} }, boxShadow: { soft:"0 14px 44px rgba(17,61,130,.09)" } } },
 plugins: []
};
export default config;
