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

  // helper chung cho các field yêu cầu ít nhất 2 ký tự
  const requiredMin2 = (label: string) => ({
    required: `${label} is required`,
    validate: (value: string) =>
      value?.trim().length >= 2 || `${label} must be at least 2 characters`,
  });

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
            rules={requiredMin2("Street")}
          />
        </div>

        {/* Building Name */}
        <div className="sm:col-span-2 xl:col-span-1">
          <Input
            name="buildingName"
            label="Building Name"
            control={control}
            rules={requiredMin2("Building name")}
          />
        </div>

        {/* Ward & District */}
        <div>
          <Input
            name="ward"
            label="Ward"
            control={control}
            rules={requiredMin2("Ward")}
          />
        </div>
        <div>
          <Input
            name="district"
            label="District"
            control={control}
            rules={requiredMin2("District")}
          />
        </div>

        {/* City */}
        <div className="sm:col-span-2 xl:col-span-1">
          <Input
            name="city"
            label="City"
            control={control}
            rules={requiredMin2("City")}
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
