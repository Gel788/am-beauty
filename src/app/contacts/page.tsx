import type { Metadata } from "next";
import { ContactsView } from "@/components/contacts/contacts-view";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Контакты AM Beauty и ответы на частые вопросы.",
};

export default function ContactsPage() {
  return <ContactsView />;
}
