"use client";

import { useLayoutEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

/** Синхронная регидратация persist-store до взаимодействия пользователя. */
export function StoreHydration() {
  useLayoutEffect(() => {
    const unsubCart = useCartStore.persist.onFinishHydration(() => {
      useCartStore.getState().pruneInvalidItems();
    });

    useCartStore.persist.rehydrate();
    useWishlistStore.persist.rehydrate();

    return unsubCart;
  }, []);

  return null;
}
