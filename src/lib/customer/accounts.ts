import { randomUUID } from "node:crypto";
import { readDb, updateDb } from "@/lib/admin/db";
import type { CustomerAccount } from "@/lib/admin/types";
import {
  generateTempPassword,
  hashPassword,
  hashResetToken,
  resetTokenExpiresAt,
  verifyPassword,
} from "@/lib/customer/auth";
import { sendPasswordResetEmail, sendWelcomeEmail } from "@/lib/mail/send-mail";
import { normalizePhone } from "@/lib/phone";

export type CustomerPublic = {
  id: string;
  email: string;
  phone: string;
  name: string;
};

function toPublic(customer: CustomerAccount): CustomerPublic {
  return {
    id: customer.id,
    email: customer.email,
    phone: customer.phone,
    name: customer.name,
  };
}

export async function findCustomerByEmail(email: string) {
  const db = await readDb();
  return db.customers.find((c) => c.email === email.trim().toLowerCase()) ?? null;
}

export async function getCustomerPublic(email: string) {
  const customer = await findCustomerByEmail(email);
  return customer ? toPublic(customer) : null;
}

export async function authenticateCustomer(email: string, password: string) {
  const customer = await findCustomerByEmail(email);
  if (!customer) return null;
  if (!verifyPassword(password, customer.passwordHash)) return null;
  return toPublic(customer);
}

export async function ensureCustomerFromOrder(input: {
  name: string;
  email: string;
  phone: string;
}) {
  const email = input.email.trim().toLowerCase();
  const phone = normalizePhone(input.phone);
  const name = input.name.trim();
  const now = new Date().toISOString();

  let isNew = false;
  let plainPassword: string | null = null;
  let customer: CustomerAccount | null = null;

  await updateDb((db) => {
    const existing = db.customers.find((c) => c.email === email);
    if (existing) {
      existing.name = name || existing.name;
      existing.phone = phone || existing.phone;
      existing.updatedAt = now;
      customer = existing;
      return;
    }

    plainPassword = generateTempPassword();
    const created: CustomerAccount = {
      id: `cust-${Date.now().toString(36)}`,
      email,
      phone,
      name,
      passwordHash: hashPassword(plainPassword),
      createdAt: now,
      updatedAt: now,
    };
    db.customers.push(created);
    customer = created;
    isNew = true;
  });

  if (!customer) {
    throw new Error("Failed to upsert customer");
  }

  if (isNew && plainPassword) {
    await sendWelcomeEmail({ email, name, password: plainPassword });
  }

  return { customer: toPublic(customer), isNew };
}

export async function updateCustomerProfile(
  currentEmail: string,
  input: { name?: string; phone?: string; email?: string },
):
  | { ok: true; customer: CustomerPublic; emailChanged: boolean }
  | { ok: false; error: string } {
  const normalizedCurrent = currentEmail.trim().toLowerCase();
  const name = input.name?.trim();
  const phone = input.phone ? normalizePhone(input.phone) : undefined;
  const nextEmail = input.email?.trim().toLowerCase();

  if (name !== undefined && !name) {
    return { ok: false, error: "Укажите имя" };
  }
  if (phone !== undefined && phone.length < 10) {
    return { ok: false, error: "Укажите корректный телефон" };
  }
  if (nextEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
    return { ok: false, error: "Укажите корректный email" };
  }
  if (nextEmail && nextEmail !== normalizedCurrent) {
    const taken = await findCustomerByEmail(nextEmail);
    if (taken) {
      return { ok: false, error: "Этот email уже используется" };
    }
  }

  const now = new Date().toISOString();
  let customer: CustomerAccount | null = null;
  const emailChanged = Boolean(nextEmail && nextEmail !== normalizedCurrent);
  const targetEmail = nextEmail ?? normalizedCurrent;

  try {
    await updateDb((db) => {
      if (!Array.isArray(db.customers)) {
        db.customers = [];
      }

      let account = db.customers.find((c) => c.email === normalizedCurrent);
      if (!account) {
        account = {
          id: `cust-${Date.now().toString(36)}`,
          email: normalizedCurrent,
          phone: phone ?? "",
          name: name ?? "",
          passwordHash: "",
          createdAt: now,
          updatedAt: now,
        };
        db.customers.push(account);
      }

      if (name) account.name = name;
      if (phone) account.phone = phone;
      if (emailChanged && nextEmail) account.email = nextEmail;
      account.updatedAt = now;

      for (const order of db.orders) {
        if (order.customerEmail.toLowerCase() !== normalizedCurrent) continue;
        if (name) order.customerName = name;
        if (phone) order.customerPhone = input.phone?.trim() ?? order.customerPhone;
        if (emailChanged && nextEmail) order.customerEmail = nextEmail;
      }

      customer = account;
    });
  } catch {
    return { ok: false, error: "Не удалось сохранить профиль" };
  }

  if (!customer) {
    return { ok: false, error: "Аккаунт не найден" };
  }

  const publicCustomer = toPublic({
    ...customer,
    email: targetEmail,
    name: name ?? customer.name,
    phone: phone ?? customer.phone,
  });

  return { ok: true, customer: publicCustomer, emailChanged };
}

export async function requestPasswordReset(email: string) {
  const normalized = email.trim().toLowerCase();
  const token = randomUUID().replace(/-/g, "") + randomUUID().replace(/-/g, "");
  const tokenHash = hashResetToken(token);
  const expiresAt = resetTokenExpiresAt();

  let customerName = "";
  let found = false;

  await updateDb((db) => {
    const customer = db.customers.find((c) => c.email === normalized);
    if (!customer) return;
    found = true;
    customerName = customer.name;
    customer.resetTokenHash = tokenHash;
    customer.resetExpiresAt = expiresAt;
    customer.updatedAt = new Date().toISOString();
  });

  if (found) {
    await sendPasswordResetEmail({ email: normalized, name: customerName, token });
  }

  return { ok: true as const };
}

export async function resetPasswordWithToken(token: string, password: string) {
  if (password.length < 8) {
    return { ok: false as const, error: "Пароль должен быть не короче 8 символов" };
  }

  const tokenHash = hashResetToken(token);
  const now = Date.now();
  let updated = false;

  await updateDb((db) => {
    const customer = db.customers.find(
      (c) =>
        c.resetTokenHash === tokenHash &&
        c.resetExpiresAt &&
        Date.parse(c.resetExpiresAt) > now,
    );
    if (!customer) return;
    customer.passwordHash = hashPassword(password);
    customer.resetTokenHash = undefined;
    customer.resetExpiresAt = undefined;
    customer.updatedAt = new Date().toISOString();
    updated = true;
  });

  if (!updated) {
    return { ok: false as const, error: "Ссылка недействительна или устарела" };
  }

  return { ok: true as const };
}
