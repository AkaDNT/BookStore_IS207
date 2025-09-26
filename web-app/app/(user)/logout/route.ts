import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function POST() {
  (await cookies()).set("jwtToken", "", {
    maxAge: 0,
    path: "/",
  });

  redirect("/");
}
