import React from "react";
import AddressForm from "../../new/AddressForm";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/app/(user)/actions/getCurrentUser";

type Params = { id: string };

export default async function UpdateAddress(
  { params }: { params: Promise<Params> } // 👈 params là Promise
) {
  const { id } = await params; // 👈 phải await
  const user = await getCurrentUser();

  if (!id || !user?.addresses) return notFound();

  const address = user.addresses.find((addr) => String(addr.id) === id);
  if (!address) return notFound();

  return <AddressForm address={address} />;
}
