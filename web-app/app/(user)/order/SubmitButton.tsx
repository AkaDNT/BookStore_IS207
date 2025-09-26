"use client";

import { useFormStatus } from "react-dom";
import { Button, Spinner } from "flowbite-react";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-rose-600 text-white py-2 rounded-xl hover:bg-rose-700 transition disabled:bg-gray-400"
    >
      {pending ? (
        <>
          <Spinner size="sm" />
          <span className="ml-2">Processing...</span>
        </>
      ) : (
        "Place Order"
      )}
    </Button>
  );
}
