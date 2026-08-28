import { revalidatePath } from "next/cache";

/** Сброс кеша витрины после правок в админке */
export function revalidateStorefront() {
  revalidatePath("/", "layout");
  revalidatePath("/catalog");
  revalidatePath("/products", "layout");
  revalidatePath("/account");
}
