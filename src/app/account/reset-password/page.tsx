import type { Metadata } from "next";
import { ResetPasswordView } from "@/components/account/reset-password-view";

export const metadata: Metadata = {
  title: "Новый пароль",
  robots: { index: false },
};

export default function ResetPasswordPage() {
  return <ResetPasswordView />;
}
