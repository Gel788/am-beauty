import { NextResponse } from "next/server";
import { updateDb } from "@/lib/admin/db";
import type { AdminInquiry } from "@/lib/admin/types";

export const dynamic = "force-dynamic";

type InquiryBody = {
  type?: AdminInquiry["type"];
  name?: string;
  email?: string;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InquiryBody;
    const type = body.type === "newsletter" ? "newsletter" : "contact";
    const email = body.email?.trim().toLowerCase() ?? "";
    const name = body.name?.trim() ?? "";
    const message = body.message?.trim() ?? "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Укажите корректный email" }, { status: 400 });
    }
    if (type === "contact" && !message) {
      return NextResponse.json({ error: "Введите сообщение" }, { status: 400 });
    }

    const inquiry: AdminInquiry = {
      id: `inq-${Date.now()}`,
      type,
      email,
      name: name || undefined,
      message: message || undefined,
      createdAt: new Date().toISOString(),
    };

    await updateDb((db) => {
      db.inquiries.unshift(inquiry);
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Не удалось сохранить обращение" }, { status: 500 });
  }
}
