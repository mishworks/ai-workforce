# Design Reference — ChatGPT Dots Page

Extracted from `https://chatgpt.com/features/dots/` via Firecrawl.

---

## Colors

| Role | Value |
|---|---|
| Primary accent / channel | `#bac1d3` |
| Coral (display-P3) | `color(display-p3 0.8784 0.1176 0.3529)` ≈ `#E01E5A` |
| Cyan / blue (display-P3) | `color(display-p3 0.2118 0.7725 0.9412)` ≈ `#36C5F0` |
| Yellow (display-P3) | `color(display-p3 0.9255 0.698 0.1804)` ≈ `#ECB22E` |
| Text primary | `var(--text-primary)` |
| Text secondary | `var(--token-text-secondary)` |
| Text tertiary | `var(--token-text-tertiary)` |
| Background elevated | `var(--bg-elevated-secondary)` / `var(--token-bg-elevated-primary)` |
| Card border | `var(--token-border-light)` / `var(--token-border-medium)` |
| Card shadow | `0 4px 16px 0 rgba(0,0,0,0.05)` |
| Color scheme | `light` (forced) |

---

## Typography

| Use | Value |
|---|---|
| Font family | OpenAI custom (likely Söhne or similar sans-serif) |
| Hero headline size | `1.5rem` → `36px` at ≥600px |
| Hero headline leading | `1.2` |
| Hero headline weight | `font-medium` |
| Hero headline tracking | `-0.02em` |
| Body copy | `text-mkt-p2` (~16px) |
| Subheadings | `text-mkt-h3`, `text-mkt-h5` |
| Small body | `text-body-small` |
| Label weight | `font-semibold` |

---

## Buttons

### Primary — "Create your dot"

```
btn btn-primary btn-large
```

- Background: near-black (OpenAI standard primary)
- Size: large (`btn-large`)
- Shape: pill / fully rounded
- Focus ring: `outline: 1.5px solid var(--text-primary)`, `outline-offset: 2.5px`

### Secondary — "See download options"

```
btn btn-secondary btn-large
```

- Style: outlined / ghost
- Same size and pill shape as primary
- Softer visual weight, no fill

### Nav links

```
inline-flex items-center px-2.5 py-1.5 rounded-lg text-mkt-p2
```

- No background fill by default
- Text color: `var(--token-text-secondary)`
- Hover: `text-token-text-primary` + `bg-token-bg-secondary/50`

### Form submit — "Email me the link"

```
btn btn-primary btn-large w-full
```

- Same primary style, full width inside card

---

## Spacing & Shape

| Token | Value |
|---|---|
| Large card radius | `rounded-[36px]` |
| Input radius | `rounded-full` |
| Nav item radius | `rounded-lg` |
| Tab underline radius | `border-radius: 9px / 9px` (elliptical) |
| Input padding | `px-6 py-2.5` |
| Nav padding | `px-2.5 py-1.5` |
| Card shadow | `0 4px 16px 0 rgba(0,0,0,0.05)` |
| Card border | `border border-token-border-light` |
