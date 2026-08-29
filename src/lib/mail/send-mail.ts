import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { passwordResetEmailText, welcomeEmailText } from "@/lib/mail/templates";

type MailPayload = {
  to: string;
  subject: string;
  text: string;
};

const DB_DIR = process.env.ADMIN_DB_DIR
  ? path.resolve(process.env.ADMIN_DB_DIR)
  : path.join(process.cwd(), ".data");

async function appendOutbox(entry: MailPayload) {
  await mkdir(DB_DIR, { recursive: true });
  const line = JSON.stringify({ ...entry, createdAt: new Date().toISOString() }) + "\n";
  await appendFile(path.join(DB_DIR, "mail-outbox.jsonl"), line, "utf-8");
}

function hasSmtpConfig() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendMail(payload: MailPayload) {
  if (hasSmtpConfig()) {
    // SMTP transport подключим при появлении ключей у заказчика.
    console.info(`[mail] SMTP configured but transport pending — outbox: ${payload.to}`);
  }

  await appendOutbox(payload);
  if (process.env.NODE_ENV !== "production") {
    console.info(`[mail:outbox] To: ${payload.to} | ${payload.subject}`);
  }
}

export async function sendWelcomeEmail(input: { email: string; name: string; password: string }) {
  await sendMail({
    to: input.email,
    subject: "Ваш личный кабинет AM Beauty",
    text: welcomeEmailText({ name: input.name, email: input.email, password: input.password }),
  });
}

export async function sendPasswordResetEmail(input: {
  email: string;
  name: string;
  token: string;
}) {
  await sendMail({
    to: input.email,
    subject: "Восстановление пароля AM Beauty",
    text: passwordResetEmailText({ name: input.name, token: input.token }),
  });
}
