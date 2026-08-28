import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default function AdminLoginPage() {
  return (
    <div className="fixed inset-0 z-[200] flex min-h-screen items-center justify-center bg-black px-6">
      <div className="w-full max-w-md border border-white/10 bg-[#111] p-8 text-white md:p-10">
        <p className="text-[10px] tracking-[0.32em] text-gold uppercase">AM Beauty</p>
        <h1 className="mt-3 font-display text-3xl font-light tracking-wide">Admin</h1>
        <p className="mt-2 text-sm text-white/50">Вход в панель управления магазином</p>
        <div className="mt-8">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
