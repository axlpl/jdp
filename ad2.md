# Ad 2 — Native capabilities: Standalone vs Micro Frontend

> **Pytanie / Question:** Please prepare screenshots/demo of the native capabilities for the standalone and micro front end apps.

---

## 🇵🇱 Po polsku

### Krótka odpowiedź

**Graficzne "native capabilities" są IDENTYCZNE** dla standalone i MFE. Obie ścieżki używają tego samego pakietu bazowego `@jutro/app-template` i tej samej biblioteki `@jutro/components` + `@jutro/floorplan` + theme + forms.

**Różnica nie jest wizualna, tylko architektoniczna** — chodzi o to, kto dostarcza ramę (shell).

### Co dostajesz out-of-the-box w obu przypadkach (to samo)

- Shell aplikacji (`@jutro/floorplan`) — header, nawigacja (top lub sidebar), footer, avatar z menu, notyfikacje, help popover, selektor języka, app switcher
- Biblioteka komponentów (`@jutro/components`) — Card, Grid, Flex, Button, Modal, Toast, QuickView, ErrorBoundary, Loader
- Codeless Forms — formularze generowane z metadanych UI (date picker, currency, dropdown, button group, walidacja)
- Wizardy (`@jutro/wizard-next`)
- Settings — język, regional format, przełącznik theme, placement nawigacji
- i18n (`@jutro/locale` + `@jutro/translations`) — 5 locale gotowych, pseudo-translacje, `useTranslator()`
- Theme (`@jutro/theme`) — design tokens, przełączanie w runtime
- Auth (`@jutro/auth`) — Okta OIDC
- Routing (`@jutro/router`) — React Router 5
- Walidacja formularzy (`@jutro/validation`)
- Logger + Datadog + Google Analytics (opcjonalnie)
- Tooling: webpack 5, ESLint, Prettier, Stylelint, testy Jest

### Różnica — kto dostarcza shell

| Wariant | Kto rysuje header/nav/footer | Kto trzyma auth/theme/język | Screen |
|---|---|---|---|
| **Standalone** | apka sama | apka sama | [standalone-01-welcome.png](screenshots/standalone-01-welcome.png) |
| **MFE Remote — otwarty samodzielnie** | apka sama (fallback) | apka sama (fallback) | [mfe-01-remote-standalone.png](screenshots/mfe-01-remote-standalone.png) |
| **MFE Remote — osadzony w hoście** | **host** | **host** (remote dostaje przez integrację) | [mfe-03-host-with-remote-embedded.png](screenshots/mfe-03-host-with-remote-embedded.png) |

### Co pokazują screeny

- [standalone-01-welcome.png](screenshots/standalone-01-welcome.png) — standalone, strona powitalna: pełny shell (header Guidewire, nav Welcome/Forms/Settings, footer).
- [standalone-02-codeless-form.png](screenshots/standalone-02-codeless-form.png) — standalone, Codeless Form: formularz generowany z metadanych. Widać date picker, currency input, dropdown, button group, walidację required.
- [standalone-03-settings.png](screenshots/standalone-03-settings.png) — standalone, Settings: Language & Regional Format, Theme, Navigation Placement, About.
- [mfe-01-remote-standalone.png](screenshots/mfe-01-remote-standalone.png) — MFE remote otwarty samodzielnie (port 3002): ma własny shell — dokładnie tak jak standalone.
- [mfe-02-host-welcome.png](screenshots/mfe-02-host-welcome.png) — MFE host (port 3001): taki sam shell jak standalone, plus dodatkowy item w nawigacji "Remote module".
- [mfe-03-host-with-remote-embedded.png](screenshots/mfe-03-host-with-remote-embedded.png) — **kluczowy screen**: host pokazuje route `/remote`, w przerywanej ramce osadzony jest remote. Rama (header/nav/footer) = host, content w ramce = remote.

### Odpowiedź dla klienta (jedno zdanie)

> Graficzne możliwości są takie same — to ten sam design system Jutro. Różnica polega na tym, że w modelu MFE remote oddaje kontrolę nad ramą (header, SSO, theme, język) hostowi, dzięki czemu kilka produktów w portalu wygląda spójnie i ma jedno logowanie. W standalone każda aplikacja rządzi się sama.

---

## 🇬🇧 In English

### Short answer

**Native visual capabilities are IDENTICAL** for standalone and MFE. Both paths use the same base package `@jutro/app-template` and the same library stack — `@jutro/components` + `@jutro/floorplan` + theme + forms.

**The difference is not visual, it's architectural** — it's about who provides the shell.

### What you get out-of-the-box in both cases (the same)

- App shell (`@jutro/floorplan`) — header, navigation (top or sidebar), footer, avatar menu, notifications, help popover, language selector, app switcher
- Component library (`@jutro/components`) — Card, Grid, Flex, Button, Modal, Toast, QuickView, ErrorBoundary, Loader
- Codeless Forms — metadata-driven forms (date picker, currency, dropdown, button group, validation)
- Wizards (`@jutro/wizard-next`)
- Settings — language, regional format, theme switcher, nav placement
- i18n (`@jutro/locale` + `@jutro/translations`) — 5 locales ready, pseudo-translations, `useTranslator()`
- Theme (`@jutro/theme`) — design tokens, runtime switching
- Auth (`@jutro/auth`) — Okta OIDC
- Routing (`@jutro/router`) — React Router 5
- Form validation (`@jutro/validation`)
- Logger + Datadog + Google Analytics (optional)
- Tooling: webpack 5, ESLint, Prettier, Stylelint, Jest tests

### The difference — who provides the shell

| Variant | Who renders header/nav/footer | Who owns auth/theme/language | Screenshot |
|---|---|---|---|
| **Standalone** | the app itself | the app itself | [standalone-01-welcome.png](screenshots/standalone-01-welcome.png) |
| **MFE Remote — opened standalone** | the app itself (fallback) | the app itself (fallback) | [mfe-01-remote-standalone.png](screenshots/mfe-01-remote-standalone.png) |
| **MFE Remote — embedded in host** | **the host** | **the host** (passed to remote via integration) | [mfe-03-host-with-remote-embedded.png](screenshots/mfe-03-host-with-remote-embedded.png) |

### What the screenshots show

- [standalone-01-welcome.png](screenshots/standalone-01-welcome.png) — standalone, welcome page: full shell (Guidewire header, Welcome/Forms/Settings nav, footer).
- [standalone-02-codeless-form.png](screenshots/standalone-02-codeless-form.png) — standalone, Codeless Form: metadata-driven form. Shows date picker, currency input, dropdown, button group, required validation.
- [standalone-03-settings.png](screenshots/standalone-03-settings.png) — standalone, Settings: Language & Regional Format, Theme, Navigation Placement, About.
- [mfe-01-remote-standalone.png](screenshots/mfe-01-remote-standalone.png) — MFE remote opened standalone (port 3002): has its own shell — same as standalone.
- [mfe-02-host-welcome.png](screenshots/mfe-02-host-welcome.png) — MFE host (port 3001): same shell as standalone, plus extra nav item "Remote module".
- [mfe-03-host-with-remote-embedded.png](screenshots/mfe-03-host-with-remote-embedded.png) — **key screenshot**: host shows route `/remote`, remote is embedded inside the dashed frame. The frame (header/nav/footer) = host, the content inside the frame = remote.

### Answer for the client (one sentence)

> Native visual capabilities are the same — it's the same Jutro design system. The difference is that in the MFE model the remote hands control over the frame (header, SSO, theme, language) to the host, so multiple products in a portal look consistent and share a single sign-on. In standalone every app is on its own.
