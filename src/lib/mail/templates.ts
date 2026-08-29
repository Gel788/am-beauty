const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ambeauty-cosmetica.ru";

export function welcomeEmailText(input: { name: string; email: string; password: string }) {
  const greeting = input.name.trim() ? `Здравствуйте, ${input.name}!` : "Здравствуйте!";
  return `${greeting}

Спасибо за заказ в AM Beauty. Для вас создан личный кабинет.

Вход: ${input.email}
Временный пароль: ${input.password}

Войти: ${siteUrl}/account
Рекомендуем сменить пароль после первого входа: ${siteUrl}/account/forgot-password

С уважением,
команда AM Beauty`;
}

export function passwordResetEmailText(input: { name: string; token: string }) {
  const greeting = input.name.trim() ? `Здравствуйте, ${input.name}!` : "Здравствуйте!";
  const link = `${siteUrl}/account/reset-password?token=${encodeURIComponent(input.token)}`;
  return `${greeting}

Вы запросили восстановление пароля для личного кабинета AM Beauty.

Перейдите по ссылке (действует 1 час):
${link}

Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.

С уважением,
команда AM Beauty`;
}
