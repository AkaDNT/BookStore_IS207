"use client";

import React, { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Button, Spinner } from "flowbite-react";
import toast from "react-hot-toast";
import Input from "@/app/components/ui/Input";
import { usePathname, useRouter } from "next/navigation";
import { Book } from "@/app/(user)/models/Book";
import { addBook, updateBook } from "@/app/(user)/actions/bookAction";

type Props = {
  book?: Book & { id?: number };
};

export default function BookForm({ book }: Props) {
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
    if (book) {
      const {
        title,
        author,
        description,
        category,
        price,
        publisher,
        publicationDate,
        language,
        readingAge,
        pages,
        dimension,
        quantity,
        discount,
      } = book;

      reset({
        title,
        author,
        description,
        category,
        price,
        publisher,
        publicationDate,
        language,
        readingAge,
        pages,
        dimension,
        quantity,
        discount,
      });
    }

    setFocus("title");
  }, [setFocus, book, reset]);

  async function onSubmit(data: FieldValues) {
    try {
      let res;
      if (pathName === "/admin/manage-books/new") {
        res = await addBook(data);
      } else {
        if (book && book.id) {
          res = await updateBook(data, book.id);
        }
      }
      if (res?.error) throw res.error;

      router.push(`/admin/manage-books`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.status + " " + error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-3">
      {/* Grid: 2 columns on desktop, 1 on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          <Input
            name="title"
            label="Title"
            control={control}
            rules={{ required: "Title is required" }}
          />
          <Input
            name="author"
            label="Author"
            control={control}
            rules={{ required: "Author is required" }}
          />
          <Input
            name="category"
            label="Category"
            control={control}
            rules={{ required: "Category is required" }}
          />
          <Input
            name="price"
            label="Price"
            type="number"
            control={control}
            rules={{ required: "Price is required", min: 0 }}
          />
          <Input
            name="publicationDate"
            label="Publication Date"
            type="date"
            control={control}
            rules={{ required: "Publication date is required" }}
          />
          <Input
            name="readingAge"
            label="Reading Age"
            type="number"
            control={control}
            rules={{ required: "Reading age is required", min: 0 }}
          />
          <Input
            name="quantity"
            label="Quantity"
            type="number"
            control={control}
            rules={{ required: "Quantity is required", min: 0 }}
          />
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-4">
          <Input
            name="description"
            label="Description"
            control={control}
            rules={{ required: "Description is required" }}
          />
          <Input
            name="publisher"
            label="Publisher"
            control={control}
            rules={{ required: "Publisher is required" }}
          />
          <Input
            name="language"
            label="Language"
            control={control}
            rules={{ required: "Language is required" }}
          />
          <Input
            name="pages"
            label="Pages"
            type="number"
            control={control}
            rules={{ required: "Pages is required", min: 1 }}
          />
          <Input
            name="dimension"
            label="Dimension"
            control={control}
            rules={{ required: "Dimension is required" }}
          />
          <Input
            name="discount"
            label="Discount"
            type="number"
            control={control}
            rules={{ required: "Discount is required", min: 0 }}
          />
        </div>
      </div>

      {/* Submit / Cancel row */}
      <div className="flex justify-between mt-6">
        <Button
          color="alternative"
          onClick={() => router.push("/admin/manage-books")}
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
