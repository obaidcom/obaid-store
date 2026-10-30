import "next-auth";
declare module "next-auth" {
  interface User {
    role: "CUSTOMER" | "ADMIN";
  }
  interface Session {
    user: {
      id: string;
      role: "CUSTOMER" | "ADMIN";
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
