# Diagrams — Jutro Standalone vs MFE (auth flows + architecture)

Diagramy w formacie **Mermaid**. Renderują się natywnie w:
- GitHub (README, Issues, PR)
- VS Code (z podglądem Markdown)
- IntelliJ IDEA / WebStorm
- Notion, Obsidian, Confluence (z pluginem)
- **Lucid Chart** — Menu → Import → Mermaid → wklej kod
- draw.io / diagrams.net — Extras → Edit Diagram → paste Mermaid

> Mermaid diagrams. They render natively in GitHub / VS Code / Notion / Obsidian. To open in **Lucid Chart**: Menu → Import → Mermaid → paste the code block.

---

## 1. Standalone — architektura / architecture

```mermaid
flowchart LR
    User([User browser])
    App["Standalone App<br/>React + Jutro<br/>:3000"]
    Okta[("Okta<br/>IdP")]
    Backend[("App Backend<br/>e.g. GW Cloud APIs")]

    User -->|opens URL| App
    App -->|"OIDC login<br/>Authorization Code + PKCE"| Okta
    Okta -->|"access_token + id_token"| App
    App -->|"Authorization: Bearer token"| Backend

    style App fill:#b3e0ff,stroke:#0066aa
    style Okta fill:#ffd9b3,stroke:#c67a00
    style Backend fill:#d9f5d9,stroke:#2d862d
```

**Insight:** brak pośrednika Jutro — aplikacja rozmawia z Oktą i backendem bezpośrednio.

---

## 2. MFE (shared / moduleFederation) — architektura / architecture

```mermaid
flowchart LR
    User([User browser])

    subgraph Host["MFE Host shell :3001"]
        direction TB
        Shell["Header / Nav / Footer<br/>+ OIDC Client<br/>+ AuthTokenStorage"]
        Remote["MFE Remote module<br/>Pages + Forms<br/>Business logic"]
        Shell -.->|"React Context:<br/>idToken, accessToken, userInfo"| Remote
    end

    Okta[("Okta IdP")]
    BackendA[("Backend A<br/>e.g. Policy APIs")]

    User -->|opens URL| Shell
    Shell -->|OIDC login| Okta
    Okta -->|tokens| Shell
    Remote -->|"Authorization: Bearer token"| BackendA

    style Shell fill:#b3e0ff,stroke:#0066aa
    style Remote fill:#fff7b3,stroke:#cca300
    style Okta fill:#ffd9b3,stroke:#c67a00
    style BackendA fill:#d9f5d9,stroke:#2d862d
```

**Insight:** tylko host rozmawia z Oktą. Remote **nigdy** nie woła Okty bezpośrednio. Remote używa tokenu z contextu, wołając swój backend.

---

## 3. MFE (isolated / iframe popup) — architektura / architecture

```mermaid
flowchart LR
    User([User browser])

    subgraph Host["MFE Host :3001"]
        Shell["Shell<br/>Header / Nav / Footer"]
        subgraph Iframe["iframe :3002"]
            Remote["MFE Remote<br/>Pages + Forms"]
            SessStg[("sessionStorage<br/>oidc.jutro-app-oidc")]
            Remote --> SessStg
        end
        Popup["Popup window<br/>host origin :3001<br/>OIDC Client"]
    end

    Okta[("Okta IdP")]
    BackendA[("Backend A")]

    User -->|opens URL| Shell
    Remote -->|"needs token<br/>window.open"| Popup
    Popup -->|OIDC redirect| Okta
    Okta -->|tokens| Popup
    Popup -.->|"postMessage<br/>JUTRO_POPUP_TOKEN_RESPONSE"| Remote
    Remote -->|"Authorization: Bearer token"| BackendA

    style Shell fill:#b3e0ff,stroke:#0066aa
    style Remote fill:#fff7b3,stroke:#cca300
    style Popup fill:#e6ccff,stroke:#663399
    style Okta fill:#ffd9b3,stroke:#c67a00
    style BackendA fill:#d9f5d9,stroke:#2d862d
```

**Insight:** iframe nie może wołać Okty (cross-origin). Popup na origin hosta robi OIDC i oddaje token przez `postMessage`. Token ląduje w `sessionStorage` wewnątrz iframe'a.

---

## 4. Standalone — login flow (sequence)

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant App as Standalone App
    participant OIDC as OIDC Client (Okta SDK or AXA)
    participant Okta as Okta IdP
    participant BE as App Backend

    U->>App: open /
    App->>App: useAuth not authenticated
    U->>App: click Login
    App->>OIDC: login()
    OIDC->>Okta: redirect to /authorize with PKCE challenge
    Okta->>U: login form
    U->>Okta: credentials
    Okta->>App: redirect /auth/callback?code=...
    App->>OIDC: restoreSession()
    OIDC->>Okta: POST /token (code + verifier)
    Okta-->>OIDC: access_token + id_token
    OIDC-->>App: TOKENS_ACQUIRED event
    App->>App: AuthTokenStorage.set(tokens)
    App->>Okta: GET /userinfo
    Okta-->>App: userInfo (sub, email, groups, ...)
    U->>App: navigate to /some-page
    App->>BE: fetch with Authorization Bearer token
    BE-->>App: data
```

---

## 5. MFE (shared mode) — login flow (sequence)

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant Host as MFE Host
    participant Remote as MFE Remote
    participant OIDC as OIDC Client in host
    participant Okta as Okta IdP
    participant BE as Backend A

    U->>Host: open /
    Host->>OIDC: login()
    OIDC->>Okta: OIDC flow
    Okta-->>OIDC: tokens
    OIDC-->>Host: TOKENS_ACQUIRED
    Host->>Host: AuthTokenStorage.set(tokens)

    U->>Host: navigate to /remote
    Host->>Remote: mount MicroFrontend with props.jutro.auth = AuthData
    Remote->>Remote: AuthProviderStatic uses passed tokens
    Remote->>BE: fetch with Bearer token
    BE-->>Remote: data

    Note over Remote,Okta: Remote NEVER calls Okta in shared/moduleFederation mode
```

---

## 6. MFE (iframe popup) — login flow (sequence)

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant Host as MFE Host :3001
    participant Iframe as iframe Remote :3002
    participant Popup as Popup :3001 (host origin)
    participant Okta as Okta IdP

    U->>Host: open /remote
    Host->>Iframe: loads iframe src=:3002
    Iframe->>Iframe: AuthProvider detects iframe + iframeAuthFlow popup
    Iframe->>Popup: window.open(host-origin URL)
    Popup->>Okta: OIDC redirect
    Okta->>Popup: login form
    U->>Okta: credentials
    Okta-->>Popup: tokens
    Popup->>Iframe: postMessage JUTRO_POPUP_TOKEN_RESPONSE with tokens
    Popup->>Popup: window.close()
    Iframe->>Iframe: sessionStorage.set oidc.jutro-app-oidc with tokens
    Iframe->>Iframe: useAuth authenticated
    Iframe->>Iframe: render pages
```

---

## 7. Token / metadata storage (decision tree)

```mermaid
flowchart TD
    Start[Where does the token live?]
    Start --> Q1{Which auth client?}

    Q1 -->|Okta native SDK| M1["in-memory only<br/>tokenManager storage memory"]
    Q1 -->|AXA OIDC default| Q2{Service Worker available<br/>and not disabled?}
    Q1 -->|BFF experimental| B1["Tokens on backend<br/>front-end has no token"]

    Q2 -->|Yes| SW["Service Worker storage<br/>survives refresh"]
    Q2 -->|No| SS1["sessionStorage<br/>key: oidc.jutro-app-oidc"]

    Q1 -->|MFE iframe popup| SS2["sessionStorage in iframe<br/>key: oidc.jutro-app-oidc"]
    Q1 -->|MFE shared/modfed| CTX["React Context from host<br/>host holds real tokens"]

    style M1 fill:#b3e0ff
    style SW fill:#d9f5d9
    style SS1 fill:#fff7b3
    style SS2 fill:#fff7b3
    style B1 fill:#e6ccff
    style CTX fill:#ffd9ec
```

---

## 8. Persony / role — odpowiedzialności / responsibilities

```mermaid
flowchart LR
    Okta[("Okta / IdP<br/><br/>Source of truth:<br/>which user<br/>is in which group")]
    Jutro["Jutro Front-End<br/><br/>useAuth().userInfo.groups<br/><br/>Can hide/show UI<br/>UX only NOT security"]
    Backend[("Application Backend<br/><br/>Enforces permissions<br/>on every request.<br/>Reads groups from token<br/>decides allow/deny.")]

    Okta -->|"groups claim<br/>in ID token"| Jutro
    Jutro -->|"Bearer token<br/>with groups inside"| Backend

    style Okta fill:#ffd9b3,stroke:#c67a00
    style Jutro fill:#b3e0ff,stroke:#0066aa
    style Backend fill:#d9f5d9,stroke:#2d862d
```

**Krytyczne / Critical:** Jutro nie robi autoryzacji. Ukrywanie UI na bazie `groups` to wyłącznie UX. Real security = backend.

---

## 9. Standalone vs MFE Host vs MFE Remote — kto za co odpowiada

```mermaid
flowchart TB
    subgraph Standalone["Standalone App"]
        SA_Shell["Shell: header/nav/footer"]
        SA_Auth["Auth: full OIDC"]
        SA_Biz["Business logic:<br/>pages forms domain"]
        SA_BE["Calls its own backend"]
    end

    subgraph MFEHost["MFE Host shell"]
        H_Shell["Shell: header/nav/footer"]
        H_Auth["Auth: full OIDC"]
        H_Plug["Mount points for remotes"]
    end

    subgraph MFERemote["MFE Remote module"]
        R_Biz["Business logic:<br/>pages forms domain"]
        R_AuthStatic["Auth: reads token<br/>from host context"]
        R_BE["Calls its own backend"]
    end

    MFEHost -.->|"provides shell<br/>provides token<br/>provides theme/locale"| MFERemote

    style Standalone fill:#e6f5ff,stroke:#0066aa
    style MFEHost fill:#fff9e6,stroke:#cca300
    style MFERemote fill:#f0e6ff,stroke:#663399
```

**Reguła kciuka / Rule of thumb:**
- **Standalone** = jeden produkt, wszystko w jednym
- **MFE Host** = rama dla wielu produktów, ale bez domain logic
- **MFE Remote** = domain logic, bez ramy

---

## Jak zaimportować do Lucid Chart / How to import to Lucid Chart

1. W Lucid → **File** → **Import Diagram** → wybierz **Mermaid**
2. Skopiuj dowolny blok ` ```mermaid ` z tego pliku (tylko zawartość, bez znaczników ` ``` `)
3. Wklej do okna importu → Lucid wyrenderuje i możesz edytować ręcznie

**Alternatywa dla innych narzędzi:**
- **draw.io / diagrams.net:** Extras → Edit Diagram → wklej Mermaid (od wersji 20.x)
- **GitHub:** wklej blok ` ```mermaid ` do README — renderuje się natywnie
- **Obsidian / Notion / Confluence:** natywne wsparcie Mermaid
