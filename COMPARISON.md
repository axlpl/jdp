# Jutro: Standalone App vs Micro Frontend — porównanie dla klienta

Wersja Jutro użyta w demo: **10.13.1**. Node: **22.13.1**. Template: `@jutro/app-template@10.13.1`.

## TL;DR dla decyzji klienta

| Kryterium | Standalone App | Micro Frontend (MFE) |
|---|---|---|
| Pojedynczy produkt, jedna domena | ✅ polecany | przerost |
| Wiele niezależnych produktów w jednym portalu | brak ramki łączącej | ✅ polecany |
| Zespoły autonomiczne, własne release cykle | każdy zespół = własny produkt | ✅ każdy MFE releasowany niezależnie |
| SSO i spójny UX między modułami | każdy robi swoje | ✅ shell hostuje i dostarcza |
| Koszt początkowy | niski | wyższy (host + remote + kontrakt integracji) |
| Koszt utrzymania wielu produktów | rośnie liniowo (każdy = pełny stack) | niższy (remote to sama logika biznesowa) |
| Izolacja błędów | naturalna (oddzielne aplikacje) | ErrorBoundary hosta łapie awarię MFE |
| Wersjonowanie UI | niezależne dla każdego produktu | host wymusza wersję Jutro / design system |

**Reguła kciuka:** jeden produkt → standalone. Portal z wieloma produktami (policy + billing + claims) → MFE z jednym shellem hostującym.

---

## Co Jutro daje out-of-the-box (obie ścieżki)

Template `@jutro/app-template` (bazowy pakiet dla obu wariantów) zawiera:

**Shell aplikacji (z `@jutro/floorplan`)**
- Top bar: logo, tytuł, avatar z menu, powiadomienia, help popover, selektor języka, app switcher
- Nawigacja: top bar / lewy sidebar (przełączalna w Settings)
- Content area: kilka layoutów (`default`, `canvas`, własne floorplany per-route)
- Footer z linkami prawnymi (Privacy / Legal / Contact)
- Konfiguracja deklaratywna przez `floorplan.default`, `floorplan.welcome`, `floorplan.settings`

**Komponenty UI (`@jutro/components`)**
- Card, Grid, Flex, Image, Link, Button, ErrorBoundary, Loader
- Modal (`ModalNextProvider`), Toast (`ToastProvider`), QuickView

**Strony demo w boilerplate**
- Welcome — landing z linkami do Storybooka / Slacka / dokumentacji
- Forms → Codeless Form — formularz generowany z metadanych UI (date picker, currency input, dropdown, button group, sekcje, walidacja)
- Settings — język/regional format, przełącznik theme, placement nawigacji, sekcja About

**Routing (`@jutro/router`)**
- React Router 5 z rozszerzeniami Jutro
- Zagnieżdżone trasy, redirects, `exact`, `showOnNavBar`

**i18n (`@jutro/locale` + `@jutro/translations`)**
- Preferowany język/locale w localStorage (`G11nLocalStorageStore`)
- `useTranslator()` + pliki `.messages.js` per komponent
- 5 gotowych locale w templatce: `en-US`, `es-ES`, `es-MX`, `de-DE`, `pl`; 5 języków
- Pseudo-translacje (SHERLOCK) do testów i18n
- `jutro generate:i18n` ekstraktuje wiadomości z kodu

**Theme (`@jutro/theme` + `@jutro/theme-styles`)**
- Design tokens, `ThemeProvider`, przełączanie w runtime
- `jutro generate:themes` z SCSS do CSS

**Auth (`@jutro/auth`)**
- Okta OIDC out-of-the-box (konfigurowalne issuer/scope/clientId/redirect)
- `PassiveRenewAuthCallbacks` — odświeżanie tokenu w tle
- Komenda `jutro-cli add-ons add-auth` dodaje auth do istniejącej aplikacji

**Forms & walidacja**
- `@jutro/validation` — walidacja formularzy
- `@jutro/wizard-next` — wizardy wielokrokowe
- UI Metadata — formularze z JSON-a (CodelessForm)

**Obserwacja & logging**
- `@jutro/logger` — ustrukturyzowany logger
- `@jutro/datadog-logger` — integracja Datadog (opcjonalnie z create-app)
- Google Analytics (opcjonalnie z create-app)

**Tooling**
- `@jutro/cli-platform` — `jutro app:start`, `app:build`, `app:tests` (webpack 5)
- `@jutro/cli-internal` — `jutro generate:page/component/form/wizard/themes/i18n/buildInfo`
- `@jutro/cli-internal` — `jutro update` / `migrate` / `validate`
- ESLint, Prettier, Stylelint, HTML-validate, commitlint, husky presety

---

## Co dodaje Micro Frontend (pakiet `@jutro/micro-frontends`)

Nad tym co jest w standalone, MFE dokłada **kontrakt integracji shell ↔ remote**. Po stronie hosta:

```jsx
import { MicroFrontend } from '@jutro/micro-frontends';

<MicroFrontend
    src="remoteDemo@http://localhost:3002"
    jutro={{
        mode: 'isolated',              // iframe; alternatywy: 'shared', 'moduleFederation'
        integrateJutro: true,          // wymiana kontekstu Jutro
        integrateAuth: true,           // host daje remote'owi token SSO
        integrateTheme: true,          // wspólny theme
        integrateG11n: true,           // wspólny język/locale
        integrateToast: true,          // remote może pokazywać toasty w shellu hosta
        integrateModal: true,          // remote może otwierać modale w shellu hosta
        integrateRouter: false,        // opcjonalnie: shared routing
        integrateQuickView: true,
        integrateActions: true,        // np. reload()
    }}
/>
```

Po stronie remote:

```js
// mfe-remote/src/startApp.js
import { start as mfeStart } from '@jutro/micro-frontends';
import { start as standaloneStart } from '@jutro/app';

const isRunningInsideIframe = () => window.top !== window.self;

export const startApp = () => {
    const launchProps = { rootId: 'root', ... };
    if (isRunningInsideIframe()) mfeStart(Jutro, launchProps);
    else standaloneStart(Jutro, launchProps);
};
```

**Tryby osadzania:**

- `isolated` (iframe) — remote w osobnym kontekście, bezpieczne, łatwe do wdrożenia, kosztem trochę większego overheadu (osobny bundle Jutro w iframe). Komunikacja przez `postMessage` (pod maską).
- `shared` — remote renderuje się w tym samym drzewie React co host, dzieli instancję Jutro / React / biblioteki. Niższy overhead, wymaga zgodnych wersji.
- `moduleFederation` — webpack 5 Module Federation; remote publikuje manifest i entrypoint, host pobiera chunks na żądanie. Najbardziej "natywne" dla webpacka, ale wymaga konfiguracji buildu.

W tym demo użyty jest tryb **`isolated`** (najprostszy do wdrożenia).

---

## Co pokazują screeny

### Standalone

- [`screenshots/standalone-01-welcome.png`](screenshots/standalone-01-welcome.png) — welcome page z własnym headerem, nawigacją Welcome/Forms/Settings, brandingiem Jutro.
- [`screenshots/standalone-02-codeless-form.png`](screenshots/standalone-02-codeless-form.png) — Codeless Form: formularz metadata-driven (date picker, currency, button group, dropdown, walidacja required). Header z language selectorem, help icon, notifications, avatar.
- [`screenshots/standalone-03-settings.png`](screenshots/standalone-03-settings.png) — Settings: Language & Regional Format, Theme, Navigation Placement, About. Footer z legalem.

### Micro Frontend

- [`screenshots/mfe-01-remote-standalone.png`](screenshots/mfe-01-remote-standalone.png) — remote (port 3002) załadowany **bezpośrednio**: ma własny shell (pomarańczowe tło to odróżniające brandowanie w demo). Taki stan gdy ktoś otworzy remote osobno, np. w trybie dev.
- [`screenshots/mfe-02-host-welcome.png`](screenshots/mfe-02-host-welcome.png) — host (port 3001), welcome page. W nawigacji widać dodatkowy item **"Remote module"**. Branding hosta (standardowy Jutro).
- [`screenshots/mfe-03-host-with-remote-embedded.png`](screenshots/mfe-03-host-with-remote-embedded.png) — kluczowy: host wyświetla route `/remote`, w przerywanej ramce osadzony jest remote z localhost:3002 przez iframe. Header/nav/footer to host, content w ramce to remote.

---

## Struktura repo po demo

```
jdp/
├── .npmrc                          # creds do Artifactory (@jutro, @digitalsdk)
├── apps/
│   ├── standalone-demo/            # port 3000 — samodzielna apka
│   ├── mfe-host/                   # port 3001 — shell + <MicroFrontend>
│   └── mfe-remote/                 # port 3002 — apka jako remote
├── screenshots/                    # 6 PNG-ów do prezentacji
└── COMPARISON.md                   # ten dokument
```

## Jak uruchomić ponownie

```bash
# standalone
cd apps/standalone-demo && PORT=3000 BROWSER=none npm start

# MFE (dwa terminale)
cd apps/mfe-remote && PORT=3002 BROWSER=none npm start
cd apps/mfe-host   && PORT=3001 BROWSER=none npm start
```

Otwórz: http://localhost:3000 (standalone), http://localhost:3001/remote (MFE w akcji), http://localhost:3002 (remote samodzielny).

## Otwarte pytania do klienta

1. **Portal vs pojedynczy produkt** — czy planujecie >1 produkt Jutro w jednym portalu? Jeśli nie → standalone.
2. **Shared design system** — czy wszystkie produkty mają dzielić ten sam layout, theme, auth? To kandydat na MFE z hostem dostarczającym shell.
3. **Cykle release'ów** — czy zespoły potrzebują deployować moduły niezależnie? MFE daje niezależność; standalone wymusza wspólny release pipeline.
4. **Guidewire Cloud context** — czy docelowo jesteście w ramach Guidewire Cloud Portal? Wtedy host już istnieje (Guidewire go dostarcza), wasze produkty będą MFE dokładanym jako remote.
