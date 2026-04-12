# Jutro Demo — Standalone vs Micro Frontend (host + remote)

Trzy aplikacje oparte o `@jutro/app-template@10.13.1`, pokazujące dwa wzorce architektoniczne Jutro.

> Three Jutro apps built on `@jutro/app-template@10.13.1`, showing two Jutro architectural patterns.

---

## 🇵🇱 Po polsku

### Trzy aplikacje w tym repo

#### 1. `apps/standalone-demo` — **Standalone App** (port 3000)

Samodzielna aplikacja Jutro. Ma **wszystko swoje**: własny nagłówek, nawigację, stopkę, uwierzytelnianie, tłumaczenia, temat. Deployuje się ją jako jeden artefakt. Użytkownik otwiera URL i dostaje cały produkt.

**Kiedy używać:** jeden produkt, jedna domena biznesowa, jeden zespół. Np. samodzielna aplikacja dla underwritera.

Screeny: [standalone-01-welcome.png](screenshots/standalone-01-welcome.png), [standalone-02-codeless-form.png](screenshots/standalone-02-codeless-form.png), [standalone-03-settings.png](screenshots/standalone-03-settings.png).

#### 2. `apps/mfe-host` — **MFE Host** (port 3001)

Aplikacja-shell (rama). **Dostarcza wspólną ramę** dla wielu produktów: logo, nagłówek, nawigację, stopkę, SSO, temat, język. Sama **nie zawiera logiki biznesowej** — udostępnia tylko punkty integracji, w które ładują się moduły (remote MFE). Host wymusza spójny UX między produktami.

**Kiedy używać:** portal z kilkoma produktami (np. Policy + Billing + Claims w jednym miejscu).

Screen: [mfe-02-host-welcome.png](screenshots/mfe-02-host-welcome.png) — sam host bez osadzonego remote'a.

#### 3. `apps/mfe-remote` — **MFE Remote** (port 3002)

Moduł biznesowy. **Zawiera tylko funkcjonalność** (strony, formularze, logikę domeny). Gdy jest osadzony w hoście — korzysta z jego ramy (nagłówka, SSO, tematu). Gdy otworzysz go sam, ma fallback z własnym shellem (do testów i dev).

**Kiedy używać:** każdy produkt w portalu MFE jest oddzielnym remote. Każdy zespół ma swój remote, swój pipeline, swój release cycle.

Screeny: [mfe-01-remote-standalone.png](screenshots/mfe-01-remote-standalone.png) — remote otwarty samodzielnie; [mfe-03-host-with-remote-embedded.png](screenshots/mfe-03-host-with-remote-embedded.png) — **najważniejszy** — host z osadzonym remote'em (rama hosta + content remote'a w środku).

### Różnice w tabeli

| Aspekt | Standalone | MFE Host | MFE Remote |
|---|---|---|---|
| **Rola** | cały produkt | rama portalu | moduł w portalu |
| **Nagłówek/nawigacja/stopka** | własne | **dostarcza innym** | używa hosta (gdy osadzony) |
| **Uwierzytelnianie (SSO)** | własne (Okta) | centralnie dla wszystkich | dostaje token od hosta |
| **Motyw i język** | własne, lokalne | centralne | dziedziczy z hosta |
| **Logika biznesowa** | tak | minimum | **tak — to jego jedyne zadanie** |
| **Deployment** | osobny artefakt | osobny artefakt | osobny artefakt |
| **Release cycle** | niezależny | niezależny | niezależny |
| **Koszt startu** | niski | średni | średni |
| **Koszt skalowania (dużo produktów)** | wysoki (każdy = full stack) | niski | niski |

### Jak to wygląda w akcji

Otwórz [mfe-03-host-with-remote-embedded.png](screenshots/mfe-03-host-with-remote-embedded.png):
- **Wszystko na zewnątrz** ciemnej przerywanej ramki to **host** (port 3001) — logo Guidewire u góry, nawigacja Welcome/Forms/**Remote module**/Settings, stopka.
- **Wszystko w środku** przerywanej ramki to **remote** (port 3002), załadowany przez iframe z `@jutro/micro-frontends` w trybie `isolated`.
- Dla użytkownika to jedna aplikacja. Technicznie — dwa oddzielne buildy, dwa release cycle, dwa zespoły.

---

## 🇬🇧 In English

### Three apps in this repo

#### 1. `apps/standalone-demo` — **Standalone App** (port 3000)

Self-contained Jutro app. Owns **everything**: its own header, navigation, footer, authentication, translations, theme. Ships as a single artifact. The user opens a URL and gets the whole product.

**When to use:** one product, one business domain, one team. For example a dedicated app for an underwriter.

Screenshots: [standalone-01-welcome.png](screenshots/standalone-01-welcome.png), [standalone-02-codeless-form.png](screenshots/standalone-02-codeless-form.png), [standalone-03-settings.png](screenshots/standalone-03-settings.png).

#### 2. `apps/mfe-host` — **MFE Host** (port 3001)

The shell app. **Provides the common frame** for many products: logo, header, navigation, footer, SSO, theme, language. It **contains no business logic itself** — it only exposes integration points where business modules (remote MFEs) get mounted. The host enforces consistent UX across products.

**When to use:** a portal with several products (e.g. Policy + Billing + Claims in one place).

Screenshot: [mfe-02-host-welcome.png](screenshots/mfe-02-host-welcome.png) — host alone, no remote embedded.

#### 3. `apps/mfe-remote` — **MFE Remote** (port 3002)

A business module. Contains **only the functionality** (pages, forms, domain logic). When embedded in a host — it uses the host's frame (header, SSO, theme). When opened directly, it falls back to its own shell (for dev and testing).

**When to use:** every product in an MFE portal is a separate remote. Each team owns its remote, its pipeline, its release cycle.

Screenshots: [mfe-01-remote-standalone.png](screenshots/mfe-01-remote-standalone.png) — remote opened directly; [mfe-03-host-with-remote-embedded.png](screenshots/mfe-03-host-with-remote-embedded.png) — **the important one** — host with remote embedded (host frame + remote content inside).

### Differences at a glance

| Aspect | Standalone | MFE Host | MFE Remote |
|---|---|---|---|
| **Role** | whole product | portal frame | module in portal |
| **Header/nav/footer** | owns its own | **provides to others** | uses host's (when embedded) |
| **Authentication (SSO)** | owns its own (Okta) | central for all modules | gets token from host |
| **Theme & language** | own, local | central | inherits from host |
| **Business logic** | yes | minimal | **yes — its only job** |
| **Deployment** | separate artifact | separate artifact | separate artifact |
| **Release cycle** | independent | independent | independent |
| **Startup cost** | low | medium | medium |
| **Scaling cost (many products)** | high (each = full stack) | low | low |

### What it looks like in action

Open [mfe-03-host-with-remote-embedded.png](screenshots/mfe-03-host-with-remote-embedded.png):
- **Everything outside** the dark dashed border is the **host** (port 3001) — Guidewire logo at top, nav Welcome/Forms/**Remote module**/Settings, footer.
- **Everything inside** the dashed border is the **remote** (port 3002), loaded via iframe with `@jutro/micro-frontends` in `isolated` mode.
- To the end user it's one app. Technically — two separate builds, two release cycles, two teams.

---

## Uruchomienie / How to run

```bash
# Standalone
cd apps/standalone-demo && PORT=3000 BROWSER=none npm start
# → http://localhost:3000

# MFE (run in two separate terminals)
cd apps/mfe-remote && PORT=3002 BROWSER=none npm start
cd apps/mfe-host   && PORT=3001 BROWSER=none npm start
# → http://localhost:3001/remote  (key view: host with remote embedded)
# → http://localhost:3002         (remote opened standalone)
```

Pełne porównanie techniczne i decyzyjne / Full technical and decision-making comparison: [COMPARISON.md](COMPARISON.md).
