import React from "react";
import AddressForm from "../../new/AddressForm";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/app/(user)/actions/getCurrentUser";

export default async function UpdateAddress({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  const id = params.id;

  if (!id || !user?.addresses) return notFound();

  const address = user.addresses.find((addr) => String(addr.id) === id);

  if (!address) return notFound();

  return <AddressForm address={address} />;
}
