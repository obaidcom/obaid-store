import { auth } from "@/auth";
import ProfileDashboard from "./profile-dashboard";

export const metadata = { title: "حسابي" };

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;
  return (
    <ProfileDashboard
      user={{
        name: user?.name ?? "",
        email: user?.email ?? "",
        image: user?.image ?? "",
        signedIn: Boolean(user),
      }}
    />
  );
}
