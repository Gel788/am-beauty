export async function submitInquiry(payload: {
  type: "contact" | "newsletter";
  email: string;
  name?: string;
  message?: string;
}) {
  const res = await fetch("/api/inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? "Не удалось отправить");
  }
}
