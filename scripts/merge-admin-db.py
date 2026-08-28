#!/usr/bin/env python3
"""Слияние admin-db.json: корень + legacy standalone/.data — без потери товаров."""
from __future__ import annotations

import json
import sys
from pathlib import Path


def load(path: Path) -> dict | None:
    if not path.is_file():
        return None
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def product_key(product: dict) -> str:
    return str(product.get("slug") or product.get("id") or "")


def merge_products(primary: list[dict], secondary: list[dict]) -> list[dict]:
    by_slug: dict[str, dict] = {}
    order: list[str] = []

    for product in primary:
        key = product_key(product)
        if not key:
            continue
        by_slug[key] = product
        if key not in order:
            order.append(key)

    for product in secondary:
        key = product_key(product)
        if not key:
            continue
        if key not in by_slug:
            by_slug[key] = product
            order.append(key)

    return [by_slug[key] for key in order]


def merge_db(root: dict, legacy: dict) -> dict:
    merged = dict(root)
    merged["products"] = merge_products(root.get("products", []), legacy.get("products", []))
    merged["orders"] = merge_products(root.get("orders", []), legacy.get("orders", []))
    # categories/site/blog — оставляем root, legacy только дополняет products/orders
    return merged


def main() -> int:
    app_dir = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    root_path = app_dir / ".data" / "admin-db.json"
    legacy_path = app_dir / ".next" / "standalone" / ".data" / "admin-db.json"

    root = load(root_path)
    legacy = load(legacy_path)

    if root is None and legacy is None:
        print("merge-admin-db: no database files")
        return 0

    if root is None:
        root_path.parent.mkdir(parents=True, exist_ok=True)
        with root_path.open("w", encoding="utf-8") as f:
            json.dump(legacy, f, ensure_ascii=False, indent=2)
        print(f"merge-admin-db: restored root from legacy ({len(legacy.get('products', []))} products)")
        return 0

    if legacy is None:
        print(f"merge-admin-db: root only ({len(root.get('products', []))} products)")
        return 0

    before = len(root.get("products", []))
    merged = merge_db(root, legacy)
    after = len(merged.get("products", []))

    root_path.parent.mkdir(parents=True, exist_ok=True)
    with root_path.open("w", encoding="utf-8") as f:
        json.dump(merged, f, ensure_ascii=False, indent=2)

    print(f"merge-admin-db: products {before} -> {after}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
