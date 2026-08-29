import type { Metadata } from "next";
import { ForgotPasswordView } from "@/components/account/forgot-password-view";

export const metadata: Metadata = {
  title: "Восстановление пароля",
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
