# Ad 1 — Authentication & Authorization in Jutro (Standalone + MFE)

> **Pytanie / Question:** Where is the authentication / authorization occur for Standalone Astro apps? For different personas how would the authentication/authorization work? Where is the meta data for them being stored?

Wszystkie informacje poniżej zostały zweryfikowane w kodzie źródłowym pakietów **`@jutro/auth@10.13.1`** i **`@jutro/micro-frontends@10.13.1`** zainstalowanych w tym projekcie. Cytaty plików i linii — patrz sekcja "Źródła" na końcu.

> All information below was verified against source of **`@jutro/auth@10.13.1`** and **`@jutro/micro-frontends@10.13.1`** installed in this project. File and line citations — see "Sources" at the end.

---

## Diagramy / Diagrams

### Standalone — auth flow

```
┌───────────────────┐                          ┌───────────┐
│   Browser         │                          │   Okta    │
│  Standalone App   │                          │   (IdP)   │
│  (port 3000)      │                          └─────┬─────┘
│                   │                                │
│  useAuth().login()│                                │
│        │          │                                │
│        ▼          │                                │
│  OIDC Client ─────┼──► redirect + PKCE ────────────►
│  (Okta SDK or     │                                │
│   AXA OIDC)       │◄── redirect back with code ────┤
│        │          │                                │
│        ▼          │                                │
│  /auth/callback ──┼──► exchange code for tokens ───►
│        │          │                                │
│        ▼          │◄── access_token + id_token ────┤
│  AuthTokenStorage │                                │
│  (in-memory +     │                                │
│   SW/sessionStg)  │      ┌──────────────┐          │
│        │          │      │  App Backend │          │
│        ▼          │      │ (e.g. GW     │          │
│  Pages/Forms ─────┼──────► Cloud APIs)  │          │
│                   │ Authorization:      │          │
│                   │ Bearer <token>      │          │
└───────────────────┘      └──────────────┘          │
```

**Kto z kim rozmawia / Who talks to whom:**
- Browser ↔ Okta: login + token exchange (OIDC Authorization Code + PKCE).
- Browser ↔ App Backend: requesty biznesowe z nagłówkiem `Authorization: Bearer <token>`.
- **Żadnego backendu Jutro pośrodku** / No Jutro backend in the middle.

### MFE — auth flow (tryb `shared` / `moduleFederation`)

```
┌────────────────────────────────────────────┐            ┌───────────┐
│  Browser                                   │            │   Okta    │
│                                            │            │   (IdP)   │
│  ┌──────────────────────────────────────┐  │            └─────┬─────┘
│  │  MFE Host (shell)  port 3001         │  │                  │
│  │  ──────────────────                  │  │                  │
│  │  • OIDC Client (real)                │◄─┼── tokens ────────┤
│  │  • AuthTokenStorage                  │  │                  │
│  │  • useAuth() → real tokens           │  │                  │
│  │                                      │  │                  │
│  │    passes {idToken, accessToken,     │  │                  │
│  │     userInfo} via React Context      │  │                  │
│  │        │                             │  │                  │
│  │        ▼                             │  │                  │
│  │  ┌────────────────────────────────┐  │  │                  │
│  │  │ MFE Remote (module)            │  │  │                  │
│  │  │ ─────────────────              │  │  │                  │
│  │  │ • AuthProviderStatic           │  │  │                  │
│  │  │   (no real OIDC client!)       │  │  │                  │
│  │  │ • useAuth() reads from context │  │  │                  │
│  │  │ • Pages, forms, domain logic   │──┼──┼── Bearer <token> ┼──► Backend
│  │  └────────────────────────────────┘  │  │                  │    (GW Cloud
│  └──────────────────────────────────────┘  │                  │     APIs)
└────────────────────────────────────────────┘                  │
```

**Kluczowe / Key:**
- Tylko **host** rozmawia z Oktą / Only **host** talks to Okta.
- Remote dostaje token w Reactowym context'cie / Remote receives token via React Context.
- Remote używa tokenu sam, robiąc requesty do swojego backendu / Remote uses token directly to call its own backend.

### MFE — auth flow (tryb `isolated` / iframe popup)

```
┌──────────────────────────────────────────────┐            ┌───────────┐
│  Browser                                     │            │   Okta    │
│                                              │            │   (IdP)   │
│  ┌────────────────────────────────────────┐  │            └─────┬─────┘
│  │  MFE Host (shell)  port 3001           │  │                  │
│  │                                        │  │                  │
│  │  ┌──────────────────────────────────┐  │  │                  │
│  │  │ <iframe src="http://:3002">      │  │  │                  │
│  │  │                                  │  │  │                  │
│  │  │  MFE Remote (inside iframe)      │  │  │                  │
│  │  │                                  │  │  │                  │
│  │  │  needs token → opens popup ─────►┼──┼──┼──┐               │
│  │  │                                  │  │  │  │               │
│  │  │  ◄──── postMessage ─────────────┐│  │  │  │               │
│  │  │  {event:'JUTRO_POPUP_TOKEN_RES',││  │  │  │               │
│  │  │   tokens:{accessToken, idToken}}││  │  │  │               │
│  │  │                                 ││  │  │  │               │
│  │  │  stores in sessionStorage:      ││  │  │  │               │
│  │  │  "oidc.jutro-app-oidc"          ││  │  │  │               │
│  │  └─────────────────────────────────┘│  │  │  │               │
│  │                                     │  │  │  │               │
│  │  ┌──────────────────────────────────┘  │  │  │               │
│  │  │ popup window  (host origin, :3001)  │  │  │               │
│  │  │                                     │◄─┼──┘               │
│  │  │  OIDC Client (real) ────────────────┼──┼─ redirect ──────►│
│  │  │                                     │  │                  │
│  │  │                      tokens ◄───────┼──┼──────────────────┤
│  │  └─────────────────────────────────────┘  │                  │
│  └────────────────────────────────────────┘  │                  │
└──────────────────────────────────────────────┘                  │
```

**Kluczowe / Key:**
- Iframe (remote) **nie może wołać Okty bezpośrednio** (cross-origin w sandboxie) / Iframe cannot call Okta directly (cross-origin in sandbox).
- Popup otwierany na **origin hosta** robi pełny OIDC flow / Popup opened at **host origin** performs full OIDC flow.
- Token wraca do iframe'a przez `window.postMessage` / Token returns to iframe via `window.postMessage`.
- W iframe: `sessionStorage["oidc.jutro-app-oidc"]` / In iframe: `sessionStorage["oidc.jutro-app-oidc"]`.
- **Luka / Gap:** brak automatycznego refresh tokenu w tym trybie / no automatic token refresh in this mode.

### Gdzie trzymany jest token — ściąga / Where the token lives — cheat sheet

```
┌─────────────────────────┬──────────────────────────────────────────┐
│ Scenariusz / Scenario   │ Storage                                  │
├─────────────────────────┼──────────────────────────────────────────┤
│ Standalone + Okta SDK   │ in-memory (tokenManager storage:'memory')│
│ Standalone + AXA OIDC   │ Service Worker  OR  sessionStorage       │
│                         │ ("oidc.jutro-app-oidc")                  │
│ Standalone + BFF (exp.) │ on backend; front-end has no token       │
│ MFE shared/modfed       │ host's memory (same as standalone)       │
│                         │ remote reads via React Context           │
│ MFE iframe popup        │ sessionStorage in iframe origin          │
│                         │ ("oidc.jutro-app-oidc")                  │
│ User info (profile)     │ NEVER persisted, always refetched from   │
│                         │ OIDC userinfo_endpoint                   │
└─────────────────────────┴──────────────────────────────────────────┘
```

### Persony / Personas — gdzie co mieszka / who owns what

```
┌────────────────┐   group claim    ┌──────────────┐   Bearer token   ┌─────────────┐
│  Okta (IdP)    │─────────────────►│  Jutro app   │─────────────────►│   Backend   │
│                │   in ID token    │  (front-end) │   with groups    │ (authoritat-│
│  Source of     │                  │              │   claim          │ ive enforcer│
│  truth for     │                  │  Only does   │                  │ of perms)   │
│  who is in     │                  │  "is logged  │                  │             │
│  which group   │                  │  in?" check. │                  │ Decides     │
│                │                  │              │                  │ what user   │
│                │                  │  App code    │                  │ can do with │
│                │                  │  may hide    │                  │ data.       │
│                │                  │  UI based on │                  │             │
│                │                  │  groups — it │                  │             │
│                │                  │  is only UX, │                  │             │
│                │                  │  not securi- │                  │             │
│                │                  │  ty.         │                  │             │
└────────────────┘                  └──────────────┘                  └─────────────┘
```

**Najważniejsze / Most important:** pokazywanie/ukrywanie UI na podstawie `groups` **to tylko UX**, nie bezpieczeństwo. Prawdziwa kontrola uprawnień jest na backendzie. Jutro nie ma wbudowanej warstwy RBAC/ABAC.

> Hiding/showing UI based on `groups` is **only UX**, not security. Real permission enforcement is on the backend. Jutro has no built-in RBAC/ABAC layer.

---

## 🇵🇱 Po polsku

### 1. Stack technologiczny auth (zweryfikowany)

Jutro używa **dwóch klientów OIDC** i wybiera jeden w runtime:

- **`@okta/okta-auth-js@7.8.1`** — natywny SDK Okty. Włączany gdy `JUTRO_AUTH_USE_NATIVE_OKTA_CLIENT=true`.
- **`@axa-fr/oidc-client@7.25.4`** — ogólny klient OIDC (domyślny, gdy Okta native nie jest włączona).
- **`BffAuthClient`** (eksperymentalny) — Backend-For-Frontend, włączany `JUTRO_AUTH_USE_BFF_CLIENT_EXPERIMENTAL=true`.

Kolejność wyboru (od góry): BFF → Okta native → AXA OIDC (fallback). To jest w `@jutro/auth/useAuthClient.js` linie 4-14.

Jutro **nie pisze własnego klienta OIDC** — jest warstwą integracji nad tymi bibliotekami.

### 2. Gdzie zachodzi autentykacja w standalone

Flow startu aplikacji i logowania:

1. `src/index.js` → `startApp.js` → `@jutro/app/start.js` linia 48: `start()` renderuje `ApplicationRoot`.
2. `ApplicationRoot` owija drzewo w `AuthRoute` (`@jutro/app/internal/ApplicationRoot.js` linie 35-48).
3. `AuthRoute` (`@jutro/app/routing/AuthRoute.js` linie 23-38) startuje `AuthProvider` z `@jutro/auth`.
4. `AuthProvider` (`@jutro/auth/AuthProvider.js` linie 1-50):
   - `useAuthClient()` tworzy instancję klienta OIDC (Okta lub AXA).
   - Rejestruje listenery stanu (`oidc.registerStateListeners()`, linia 32).
   - Wrap: `OidcRoutes` → `OidcSession` → aplikacja użytkownika.
   - Stan auth w reducerze: `tokens`, `oidcUser`, `isLoginPending`, `isLogoutPending`, `error` (linie 18-22).
5. Użytkownik wywołuje `login()` z `useAuth()` → klient OIDC robi redirect do issuera (Okta).
6. Powrót z Okty na ścieżkę z `JUTRO_AUTH_REDIRECT_PATH` (domyślnie `/auth/callback`).
7. `OidcRoutes` wykrywa callback, `OidcSession` robi `oidc.restoreSession()` (`OidcSession.js` linia 13).
8. Klient emituje event `token_acquired` → reducer dispatcha `TOKENS_ACQUIRED`.

**Kluczowe:** auth odbywa się **po stronie przeglądarki**. Jutro **nie ma własnego backendu auth** (poza eksperymentalnym BFF). To standardowy OIDC Authorization Code Flow z PKCE, prowadzony przez klienta w przeglądarce, end-to-end z Oktą.

### 3. Gdzie są trzymane tokeny i metadane (dokładnie)

**Access token i ID token:**
- **Głównie in-memory** w obiekcie `AuthTokenStorage` (`@jutro/auth/storage/AuthTokenStorage.js` linia 1). Obiekt w pamięci JS: `{accessToken, idToken}`.
- Hook `useAuthStorage` aktualizuje go przez `setToken('accessToken', ...)` i `setToken('idToken', ...)` (linie 11-13).

**Fallback persystencji zależy od klienta:**

| Klient | Gdzie trzymany token na persyst | Plik referencyjny |
|---|---|---|
| Okta native | `tokenManager` z `storage: 'memory'` (w RAMie) | `getOktaConfiguration.js:9` |
| AXA OIDC | **Service Worker** (jeśli dostępny) LUB **`sessionStorage`** pod kluczem np. `oidc.jutro-app-oidc` | `getOidcConfiguration.js:30-31` |
| BFF | Tokeny trzymane przez backend, nie przez front-end | `BffAuthClient.js` |

Service worker jest wyłączony na HTTPS localhost chyba że włączysz `JUTRO_AUTH_HTTPS_LOCALHOST_SERVICE_WORKER=true`.

**Co dzieje się po F5 (refresh strony):**
- In-memory tokeny znikają.
- Aplikacja ponownie sprawdza sesję OIDC — jeśli service worker / sessionStorage ma tokeny, lub jeśli cookie sesji Okty (`end_session_endpoint`) jest ważne, klient OIDC tiche ponownie je pobiera.
- User info (`oidcUser`) **nie jest persystowane** — zawsze jest refetchowane przez `oidc.getUserInfo()` po starcie.

**Metadane użytkownika (profil):**
- Pobierane przez `oidc.getUserInfo()` z OIDC endpointu `userinfo_endpoint`.
- Typ `OidcUserInfo` w `types.d.ts` linie 37-66: m.in. `sub`, `email`, `name`, `groups`, custom claims.
- Trzymane w stanie reducera `oidcUser` — **tylko w pamięci**.
- Dostęp: `const { userInfo } = useAuth()`.

### 4. Persony / role — to NIE jest koncept Jutro

**Jutro nie ma wbudowanej warstwy autoryzacji.** To jest najważniejsza rzecz do zakomunikowania klientowi.

Co Jutro daje:
- `AuthRoute` sprawdza **tylko** `isAuthenticated` (zalogowany / niezalogowany) — `@jutro/auth/routing/AuthRoute.js` linia 15.
- `useAuth().userInfo.groups` — tablica grup z claim `groups` w ID tokenie (standardowy OIDC claim).

Czego Jutro **NIE ma**:
- ❌ `hasPermission('...')` — brak
- ❌ `withRole('admin')` HOC — brak
- ❌ `<SecureRoute roles={['...']}>` — brak
- ❌ Rejestru ról / matrix permissions — brak
- ❌ Feature flags per-rola out-of-the-box — brak

**Gdzie "mieszkają" persony i role:**
1. **Okta** (lub inny Identity Provider) — jest źródłem prawdy, wystawia claim `groups` w ID tokenie.
2. **Backend aplikacji** — egzekwuje uprawnienia na endpointach (autoryzacja).
3. **Kod aplikacji front-end** — implementuje swoje własne gates:
   ```js
   const { userInfo } = useAuth();
   if (userInfo?.groups?.includes('admin')) { /* pokaz pannel admina */ }
   ```

Jeśli klient chce "persony" jako koncept biznesowy (underwriter / claim adjuster / agent), **musi to zaimplementować samodzielnie** na bazie claim `groups` lub custom claim w ID tokenie. Guidewire Cloud może dostarczać własną warstwę personas, ale to **poza** Jutro — wymaga weryfikacji w dokumentacji Guidewire Cloud.

### 5. Konfiguracja — zmienne środowiskowe

Wymagane (w `.env` lub build env):

| Zmienna | Znaczenie |
|---|---|
| `JUTRO_AUTH_ISSUER` | URL issuera OIDC (np. `https://your-org.okta.com`) |
| `JUTRO_AUTH_CLIENT_ID` | Client ID zarejestrowany w Okta |
| `JUTRO_AUTH_REDIRECT_PATH` | Ścieżka callback (domyślnie `/auth/callback`) |
| `JUTRO_AUTH_SCOPE` | Scope'y oddzielone spacją (np. `openid profile email offline_access`) |

Opcjonalne:

| Zmienna | Znaczenie |
|---|---|
| `JUTRO_AUTH_ENABLED` | Włącz/wyłącz auth (domyślnie `false`) |
| `JUTRO_AUTH_USE_NATIVE_OKTA_CLIENT` | Użyj natywnego SDK Okty zamiast AXA OIDC |
| `JUTRO_AUTH_USE_PASSIVE_TOKEN_RENEWALS` | Włącz tichy refresh tokenu |
| `JUTRO_AUTH_LOGOUT_REDIRECT_PATH` | Ścieżka po wylogowaniu (domyślnie `/logout`) |
| `JUTRO_AUTH_USE_BFF_CLIENT_EXPERIMENTAL` | Tryb BFF (eksperymentalny) |
| `JUTRO_AUTH_HTTPS_LOCALHOST_SERVICE_WORKER` | Pozwól na service worker na HTTPS localhost |

Komenda `jutro-cli add-ons add-auth` wstawia te wartości do plików aplikacji (widać w `@jutro/cli`).

### 6. MFE — kto autentykuje?

**Shell (host) autentykuje. Remote tokenu nie pobiera sam** (gdy jest osadzony).

Typy z `micro-frontends/types.d.ts`:
- `AuthIntegrationType = AuthData | Partial<PassiveRenewAuthCallbacks>` (linia 95)
- `JutroShellMfeInterface.integrateAuth: boolean` (linia 158)
- `iframeAuthFlow?: 'redirect' | 'popup'` (linia 131)

**Tryb shared / moduleFederation:**
- Host woła Oktę, trzyma tokeny.
- Host przekazuje do remote'a przez context `{idToken, accessToken, userInfo}` lub callbacki (`getIsAuthenticated`, `getAccessToken`, `getIdToken`, `getUserInfo`) — `shellSide/integration/authIntegration.js` linie 22-35.
- Remote używa `AuthProviderStatic` (nie pełnego `AuthProvider`) z już gotowymi tokenami — `microFrontendSide/auth/MicroFrontendAuthProvider.js` linie 7-38.
- Remote **nigdy nie woła Okty bezpośrednio** w tym trybie.

**Tryb isolated (iframe) — dwie opcje:**

a) **`iframeAuthFlow: 'redirect'`** — remote próbuje robić własny OIDC redirect. W praktyce zwykle pada na cross-origin (iframe sandbox).

b) **`iframeAuthFlow: 'popup'`** (domyślny dla iframe):
- Shell otwiera popup na własnym origin, tam robi auth z Oktą.
- Popup wysyła token z powrotem do iframe'a przez `window.postMessage({event:'JUTRO_POPUP_TOKEN_RESPONSE', tokens:{...}})` — `IframePopupAuthProvider.js` linia 93.
- Iframe zapisuje token w `sessionStorage` pod kluczem `oidc.jutro-app-oidc`.

**Ważne ograniczenie zweryfikowane w kodzie:** w trybie iframe popup, shell nie ma automatycznego mechanizmu odświeżania tokenu w remote. Refresh może wymagać dodatkowego wyzwalacza (sygnał `JUTRO_LOGIN_CALLBACK_FINISHED` lub manualny trigger). To jest **luka**, którą warto zweryfikować z zespołem Guidewire, jeśli planujecie długie sesje w MFE.

### 7. Krótka odpowiedź dla klienta

> **Gdzie zachodzi auth?** W przeglądarce użytkownika, standardowym flow OIDC (Authorization Code + PKCE), bezpośrednio między aplikacją a Oktą (lub innym IdP przez AXA OIDC client). Jutro nie ma własnego backendu auth (poza eksperymentalnym BFF).
>
> **Jak działa dla różnych person?** Jutro rozróżnia tylko "zalogowany vs niezalogowany". Persony/role przychodzą z Okty jako claim `groups` w ID tokenie, ale **egzekwowanie uprawnień to odpowiedzialność kodu aplikacji** — Jutro nie ma wbudowanej warstwy RBAC/ABAC. Jeśli klient chce persony jako feature platformy, trzeba to zbudować nad claimami z Okty lub użyć komponentów z warstwy Guidewire Cloud (do zweryfikowania w ich dokumentacji).
>
> **Gdzie trzymane są metadane?** Tokeny głównie in-memory (obiekt `AuthTokenStorage`). Persyst zależy od klienta: Okta SDK trzyma w pamięci, AXA OIDC używa service workera lub `sessionStorage` (klucz `oidc.jutro-app-oidc`). User info refetchowane z OIDC userinfo endpointu po każdym starcie — nie persystowane lokalnie. Po F5 token odzyskiwany jest z service workera / sessionStorage / cookie sesji u IdP. W MFE popup flow token ląduje w iframe'ie przez `postMessage` i też jest zapisywany w `sessionStorage`.

---

## 🇬🇧 In English

### 1. Auth technology stack (verified)

Jutro uses **two OIDC clients** and picks one at runtime:

- **`@okta/okta-auth-js@7.8.1`** — native Okta SDK. Used when `JUTRO_AUTH_USE_NATIVE_OKTA_CLIENT=true`.
- **`@axa-fr/oidc-client@7.25.4`** — generic OIDC client (default when Okta native not enabled).
- **`BffAuthClient`** (experimental) — Backend-For-Frontend, enabled via `JUTRO_AUTH_USE_BFF_CLIENT_EXPERIMENTAL=true`.

Selection order (top-down): BFF → Okta native → AXA OIDC (fallback). See `@jutro/auth/useAuthClient.js` lines 4-14.

Jutro **does not implement its own OIDC client** — it's an integration layer over those libraries.

### 2. Where authentication happens in standalone

App boot and login flow:

1. `src/index.js` → `startApp.js` → `@jutro/app/start.js` line 48: `start()` renders `ApplicationRoot`.
2. `ApplicationRoot` wraps the tree in `AuthRoute` (`@jutro/app/internal/ApplicationRoot.js` lines 35-48).
3. `AuthRoute` (`@jutro/app/routing/AuthRoute.js` lines 23-38) starts `AuthProvider` from `@jutro/auth`.
4. `AuthProvider` (`@jutro/auth/AuthProvider.js` lines 1-50):
   - `useAuthClient()` instantiates an OIDC client (Okta or AXA).
   - Registers state listeners (`oidc.registerStateListeners()`, line 32).
   - Wrap: `OidcRoutes` → `OidcSession` → user's app.
   - Auth state in reducer: `tokens`, `oidcUser`, `isLoginPending`, `isLogoutPending`, `error` (lines 18-22).
5. User calls `login()` from `useAuth()` → OIDC client redirects to issuer (Okta).
6. Redirect back to `JUTRO_AUTH_REDIRECT_PATH` (default `/auth/callback`).
7. `OidcRoutes` detects callback, `OidcSession` calls `oidc.restoreSession()` (`OidcSession.js` line 13).
8. Client emits `token_acquired` → reducer dispatches `TOKENS_ACQUIRED`.

**Key point:** auth happens **in the user's browser**. Jutro **has no own auth backend** (aside from the experimental BFF). It's a standard OIDC Authorization Code Flow with PKCE, conducted by a browser client directly against Okta.

### 3. Where tokens and metadata live (exact locations)

**Access token and ID token:**
- **Primarily in-memory** in an `AuthTokenStorage` object (`@jutro/auth/storage/AuthTokenStorage.js` line 1). A plain JS object: `{accessToken, idToken}`.
- The `useAuthStorage` hook updates it via `setToken('accessToken', ...)` and `setToken('idToken', ...)` (lines 11-13).

**Persistence fallback depends on the client:**

| Client | Persistence store | Reference file |
|---|---|---|
| Okta native | `tokenManager` with `storage: 'memory'` (in RAM) | `getOktaConfiguration.js:9` |
| AXA OIDC | **Service Worker** (if available) OR **`sessionStorage`** under key like `oidc.jutro-app-oidc` | `getOidcConfiguration.js:30-31` |
| BFF | Tokens held by backend, not front-end | `BffAuthClient.js` |

Service worker is disabled on HTTPS localhost unless you set `JUTRO_AUTH_HTTPS_LOCALHOST_SERVICE_WORKER=true`.

**What happens after a page refresh:**
- In-memory tokens are gone.
- App re-checks OIDC session — if service worker / sessionStorage has tokens, or if Okta session cookie is valid, the OIDC client silently restores them.
- User info (`oidcUser`) is **not persisted** — always refetched via `oidc.getUserInfo()` on boot.

**User metadata (profile):**
- Fetched via `oidc.getUserInfo()` from the OIDC `userinfo_endpoint`.
- `OidcUserInfo` type in `types.d.ts` lines 37-66: `sub`, `email`, `name`, `groups`, custom claims.
- Stored in reducer state `oidcUser` — **in-memory only**.
- Access: `const { userInfo } = useAuth()`.

### 4. Personas / roles — NOT a Jutro concept

**Jutro has no built-in authorization layer.** This is the most important thing to communicate to the client.

What Jutro provides:
- `AuthRoute` checks **only** `isAuthenticated` (logged in / not) — `@jutro/auth/routing/AuthRoute.js` line 15.
- `useAuth().userInfo.groups` — an array of groups from the `groups` claim in the ID token (standard OIDC claim).

What Jutro **does NOT provide**:
- ❌ `hasPermission('...')` — none
- ❌ `withRole('admin')` HOC — none
- ❌ `<SecureRoute roles={['...']}>` — none
- ❌ Role/permission matrix registry — none
- ❌ Role-based feature flags out of the box — none

**Where personas and roles actually live:**
1. **Okta** (or other Identity Provider) — source of truth, issues `groups` claim in the ID token.
2. **Application backend** — enforces permissions on endpoints (authorization).
3. **Front-end app code** — implements its own gates:
   ```js
   const { userInfo } = useAuth();
   if (userInfo?.groups?.includes('admin')) { /* show admin panel */ }
   ```

If the client wants "personas" as a business concept (underwriter / claim adjuster / agent), **they must implement it themselves** on top of the `groups` claim or custom claims in the ID token. Guidewire Cloud may provide its own personas layer, but that's **outside** Jutro — needs verification in Guidewire Cloud docs.

### 5. Configuration — environment variables

Required (in `.env` or build env):

| Variable | Meaning |
|---|---|
| `JUTRO_AUTH_ISSUER` | OIDC issuer URL (e.g. `https://your-org.okta.com`) |
| `JUTRO_AUTH_CLIENT_ID` | Client ID registered in Okta |
| `JUTRO_AUTH_REDIRECT_PATH` | Callback path (default `/auth/callback`) |
| `JUTRO_AUTH_SCOPE` | Space-separated scopes (e.g. `openid profile email offline_access`) |

Optional:

| Variable | Meaning |
|---|---|
| `JUTRO_AUTH_ENABLED` | Enable/disable auth (default `false`) |
| `JUTRO_AUTH_USE_NATIVE_OKTA_CLIENT` | Use native Okta SDK instead of AXA OIDC |
| `JUTRO_AUTH_USE_PASSIVE_TOKEN_RENEWALS` | Enable silent token refresh |
| `JUTRO_AUTH_LOGOUT_REDIRECT_PATH` | Path after logout (default `/logout`) |
| `JUTRO_AUTH_USE_BFF_CLIENT_EXPERIMENTAL` | BFF mode (experimental) |
| `JUTRO_AUTH_HTTPS_LOCALHOST_SERVICE_WORKER` | Allow service worker on HTTPS localhost |

The `jutro-cli add-ons add-auth` command writes these values into the application files (see `@jutro/cli`).

### 6. MFE — who authenticates?

**Shell (host) authenticates. Remote does not acquire the token itself** (when embedded).

Types from `micro-frontends/types.d.ts`:
- `AuthIntegrationType = AuthData | Partial<PassiveRenewAuthCallbacks>` (line 95)
- `JutroShellMfeInterface.integrateAuth: boolean` (line 158)
- `iframeAuthFlow?: 'redirect' | 'popup'` (line 131)

**Shared / moduleFederation mode:**
- Host calls Okta, holds tokens.
- Host passes `{idToken, accessToken, userInfo}` or callbacks (`getIsAuthenticated`, `getAccessToken`, `getIdToken`, `getUserInfo`) to the remote via context — `shellSide/integration/authIntegration.js` lines 22-35.
- Remote uses `AuthProviderStatic` (not the full `AuthProvider`) with pre-populated tokens — `microFrontendSide/auth/MicroFrontendAuthProvider.js` lines 7-38.
- Remote **never calls Okta directly** in this mode.

**Isolated (iframe) mode — two options:**

a) **`iframeAuthFlow: 'redirect'`** — remote attempts its own OIDC redirect. In practice usually blocked by cross-origin (iframe sandbox).

b) **`iframeAuthFlow: 'popup'`** (default for iframe):
- Shell opens a popup at its own origin, performs auth with Okta there.
- Popup posts the token back to the iframe via `window.postMessage({event:'JUTRO_POPUP_TOKEN_RESPONSE', tokens:{...}})` — `IframePopupAuthProvider.js` line 93.
- Iframe stores the token in `sessionStorage` under key `oidc.jutro-app-oidc`.

**Important limitation verified in code:** in iframe popup mode, the shell has no automatic mechanism to refresh the token inside the remote. Refresh may require an explicit trigger (a `JUTRO_LOGIN_CALLBACK_FINISHED` signal or a manual call). This is a **gap** worth verifying with the Guidewire team if you plan long sessions in MFE.

### 7. One-paragraph answer for the client

> **Where does auth happen?** In the user's browser, standard OIDC flow (Authorization Code + PKCE), directly between the app and Okta (or another IdP via AXA OIDC client). Jutro has no dedicated auth backend (aside from the experimental BFF).
>
> **How does it work for different personas?** Jutro only distinguishes "logged in vs. not logged in". Personas/roles come from Okta as a `groups` claim in the ID token, but **permission enforcement is the application's responsibility** — Jutro has no built-in RBAC/ABAC layer. If the client wants personas as a platform feature, it has to be built on top of Okta claims, or use components from Guidewire Cloud (to be verified in their documentation).
>
> **Where is the metadata stored?** Tokens primarily in-memory (the `AuthTokenStorage` object). Persistence depends on the client: the Okta SDK keeps them in memory, AXA OIDC uses a service worker or `sessionStorage` (key `oidc.jutro-app-oidc`). User info is refetched from the OIDC userinfo endpoint on every boot — not persisted locally. After a refresh, the token is restored from service worker / sessionStorage / IdP session cookie. In MFE popup flow, the token lands in the iframe via `postMessage` and is likewise stored in `sessionStorage`.

---

## Źródła / Sources

Wszystkie ścieżki względne do `/Users/krystianmaslo/projects/jdp`.

- `apps/standalone-demo/node_modules/@jutro/auth/package.json` — zależności auth
- `apps/standalone-demo/node_modules/@jutro/auth/AuthProvider.js` — inicjalizacja auth
- `apps/standalone-demo/node_modules/@jutro/auth/useAuthClient.js` — wybór klienta (Okta/AXA/BFF)
- `apps/standalone-demo/node_modules/@jutro/auth/storage/AuthTokenStorage.js` — przechowywanie tokenów
- `apps/standalone-demo/node_modules/@jutro/auth/useAuthStorage.js` — hook do storage
- `apps/standalone-demo/node_modules/@jutro/auth/clients/okta/OktaAuthClient.js` — klient Okty
- `apps/standalone-demo/node_modules/@jutro/auth/clients/okta/getOktaConfiguration.js` — config Okty
- `apps/standalone-demo/node_modules/@jutro/auth/clients/generic/GenericAuthClient.js` — klient AXA OIDC
- `apps/standalone-demo/node_modules/@jutro/auth/clients/generic/getOidcConfiguration.js` — config AXA OIDC
- `apps/standalone-demo/node_modules/@jutro/auth/routing/AuthRoute.js` — guard zalogowany/niezalogowany
- `apps/standalone-demo/node_modules/@jutro/app/internal/ApplicationRoot.js` — gdzie auth wchodzi w drzewo
- `apps/standalone-demo/node_modules/@jutro/app/routing/AuthRoute.js` — integracja auth z routingiem
- `apps/mfe-host/node_modules/@jutro/micro-frontends/types.d.ts` — typy integracji MFE
- `apps/mfe-host/node_modules/@jutro/micro-frontends/microFrontendSide/auth/MicroFrontendAuthProvider.js` — provider MFE po stronie remote
- `apps/mfe-host/node_modules/@jutro/micro-frontends/microFrontendSide/iframeIntegration/IframePopupAuthProvider.js` — iframe popup flow
- `apps/mfe-host/node_modules/@jutro/micro-frontends/shellSide/integration/authIntegration.js` — integracja po stronie shell

## Luki do zweryfikowania / Gaps to verify

Rzeczy, których **nie dało się potwierdzić z samego kodu** i wymagają weryfikacji w dokumentacji Guidewire albo z ich zespołem:

1. Czy **Guidewire Cloud Portal** dostarcza własną warstwę person/ról **ponad** Jutro.
2. Jak dokładnie działa **rotacja refresh tokenu** w AXA OIDC — kod deleguje do biblioteki.
3. Strategia **odświeżania tokenu w MFE iframe popup mode** — kod nie pokazuje automatyki, możliwe że wymaga manualnego triggera.
4. Szczegóły **BFF mode** (`JUTRO_AUTH_USE_BFF_CLIENT_EXPERIMENTAL`) — oznaczony jako eksperymentalny.
5. Czy **session cookie Okty** jest unieważniane natychmiast przy logout, czy jest grace period.
