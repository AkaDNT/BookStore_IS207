"use client";

import React, { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Button, Spinner } from "flowbite-react";
import toast from "react-hot-toast";
import Input from "@/app/components/ui/Input";
import { addAddress, updateAddress } from "@/app/(user)/actions/addressAction";
import { UserAddress } from "@/app/(user)/models/Address";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  address?: UserAddress & { id?: number };
};

export default function AddressForm({ address }: Props) {
  const {
    control,
    handleSubmit,
    setFocus,
    reset,
    formState: { isSubmitting, isDirty, isValid },
  } = useForm({
    mode: "onTouched",
  });

  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (address) {
      const { street, buildingName, city, district, ward } = address;
      reset({ street, buildingName, city, district, ward });
    }
    setFocus("street");
  }, [setFocus, address, reset]);

  async function onSubmit(data: FieldValues) {
    try {
      let res;
      if (pathName === "/account/addresses/new") {
        res = await addAddress(data);
      } else {
        if (address && address.id) {
          res = await updateAddress(data, address.id);
        }
      }
      if (res?.error) throw res.error;

      router.push(`/account/addresses`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.status + " " + error.message);
    }
  }

  return (
    <form
      className="flex flex-col mt-3 gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        name="street"
        label="Street"
        control={control}
        rules={{ required: "Street is required" }}
      />
      <Input
        name="buildingName"
        label="Building Name"
        control={control}
        rules={{ required: "Building name is required" }}
      />
      <Input
        name="ward"
        label="Ward"
        control={control}
        rules={{ required: "Ward is required" }}
      />
      <Input
        name="district"
        label="District"
        control={control}
        rules={{ required: "District is required" }}
      />
      <Input
        name="city"
        label="City"
        control={control}
        rules={{ required: "City is required" }}
      />

      <div className="flex justify-between mt-4">
        <Button
          color="alternative"
          onClick={() => router.push("/account/addresses")}
          type="button"
        >
          Cancel
        </Button>
        <Button
          outline
          color="green"
          type="submit"
          disabled={!isValid || !isDirty}
        >
          {isSubmitting && <Spinner size="sm" />}
          Submit
        </Button>
      </div>
    </form>
  );
}
