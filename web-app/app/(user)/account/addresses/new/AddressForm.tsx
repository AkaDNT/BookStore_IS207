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
  } = useForm({ mode: "onTouched" });

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
      } else if (address && address.id) {
        res = await updateAddress(data, address.id);
      }
      if (res?.error) throw res.error;
      router.push(`/account/addresses`);
    } catch (error: any) {
      toast.error(error.status + " " + error.message);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-3 sm:px-4">
      <form
        className="
          grid grid-cols-1 gap-4 mt-3 min-w-0
          sm:grid-cols-2
          lg:grid-cols-2
          xl:grid-cols-3
        "
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {/* Street: luôn full hàng */}
        <div className="sm:col-span-2 xl:col-span-3">
          <Input
            name="street"
            label="Street"
            control={control}
            rules={{ required: "Street is required" }}
          />
        </div>

        {/* Building Name */}
        <div className="sm:col-span-2 xl:col-span-1">
          <Input
            name="buildingName"
            label="Building Name"
            control={control}
            rules={{ required: "Building name is required" }}
          />
        </div>

        {/* Ward & District */}
        <div>
          <Input
            name="ward"
            label="Ward"
            control={control}
            rules={{ required: "Ward is required" }}
          />
        </div>
        <div>
          <Input
            name="district"
            label="District"
            control={control}
            rules={{ required: "District is required" }}
          />
        </div>

        {/* City */}
        <div className="sm:col-span-2 xl:col-span-1">
          <Input
            name="city"
            label="City"
            control={control}
            rules={{ required: "City is required" }}
          />
        </div>

        {/* Actions */}
        <div className="col-span-1 sm:col-span-2 xl:col-span-3 mt-2">
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <Button
              color="alternative"
              onClick={() => router.push("/account/addresses")}
              type="button"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              outline
              color="green"
              type="submit"
              disabled={!isValid || !isDirty}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              {isSubmitting && <Spinner size="sm" />}
              <span>{isSubmitting ? "Saving..." : "Submit"}</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
