"use client";
import React, { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Button, Spinner } from "flowbite-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CurrentUser } from "@/app/(user)/actions/getCurrentUser";
import Input from "@/app/components/ui/Input";
import { updateMe } from "@/app/(user)/actions/userAction";

type Props = {
  user: CurrentUser | null;
};

export default function UpdateProfileForm({ user }: Props) {
  const {
    control,
    handleSubmit,
    setFocus,
    reset,
    formState: { isSubmitting, isDirty, isValid },
  } = useForm({
    mode: "onTouched",
  });
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const { userName, email, phoneNumber } = user;
      reset({ userName, email, phoneNumber });
    }
    setFocus("make");
  }, [setFocus, user, reset]);

  async function onSubmit(data: FieldValues) {
    try {
      let res;
      console.log(data);
      if (user) {
        res = await updateMe(data);
      }
      if (res.error) {
        throw res.error;
      }
      router.push(`/account/profile`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.status + " " + error.message);
    }
  }

  return (
    <form className="flex flex-col mt-3" onSubmit={handleSubmit(onSubmit)}>
      <Input name="userName" label="User name" control={control}></Input>
      <Input name="email" label="Email" control={control}></Input>
      <Input name="phoneNumber" label="Phone number" control={control}></Input>
      <div className="flex justify-between">
        <Button
          color={"alternative"}
          onClick={() => router.push("/account/profile")}
        >
          Cancle
        </Button>
        <Button
          outline
          color={"green"}
          type="submit"
          disabled={!isValid || !isDirty}
        >
          {isSubmitting && <Spinner size="sm"></Spinner>}
          Submit
        </Button>
      </div>
    </form>
  );
}
