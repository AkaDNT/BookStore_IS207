import React from "react";
import UpdateProfileForm from "./UpdateProfileForm";
import { getCurrentUser } from "@/app/(user)/actions/getCurrentUser";

export default async function UpdateMe() {
  const user = await getCurrentUser();
  return <UpdateProfileForm user={user}></UpdateProfileForm>;
}
