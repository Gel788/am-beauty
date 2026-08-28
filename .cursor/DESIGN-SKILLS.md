# Design Skills — установка

Источники: [cursor.directory](https://cursor.directory), [skills-hub.ai](https://skills-hub.ai), [cursor-designer](https://github.com/spencergoldade/cursor-designer)

## Уже установлено глобально

### Cursor Rules (`~/.cursor/rules/`)
- `cursor-designer/` — 17 правил UX/UI/IA/a11y из spencergoldade/cursor-designer
- `cursor-directory-uiux-design.mdc` — UI/UX best practices с cursor.directory
- `design-skills-stack.mdc` — мастер-правило: порядок применения skills

### Agent Skills (`~/.cursor/skills/`)
- vibe-to-ui, ui-ux-pro-max, ui-design-brain, transitions-dev
- frontend-design, web-design-guidelines, vercel-react-view-transitions
- design-an-interface

## Доустановить вручную (если CLI заблокирован)

### skills-hub.ai — Design System Builder
```bash
npx @skills-hub-ai/cli install anthropic-frontend-design --target cursor
npx @skills-hub-ai/cli install alirezarezvani-ui-design-system --target cursor
npx @skills-hub-ai/cli install design-audit --target cursor
npx @skills-hub-ai/cli install design-polish --target cursor
npx @skills-hub-ai/cli install design-animate --target cursor
npx @skills-hub-ai/cli install design-to-code --target cursor
```

### skills.sh — популярные design skills
```bash
npx skills add leonxlnx/taste-skill@design-taste-frontend -g -y -a cursor
npx skills add pbakaus/impeccable@frontend-design -g -y -a cursor
npx skills add anthropics/skills@frontend-design -g -y -a cursor
```

### cursor.directory
Правило UI/UX уже в `~/.cursor/rules/cursor-directory-uiux-design.mdc`.
Другие плагины: https://cursor.directory/plugins — кнопка «Add to Cursor» или копировать в `~/.cursor/rules/`.

## После установки
Перезапусти Cursor или открой новый Agent chat — skills подхватятся автоматически.
