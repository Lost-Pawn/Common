"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Locale, translate } from "@/lib/i18n";
import { api, APIError } from "@/lib/api";
export const UIContext = createContext<{
  locale: Locale;
  t: (key: string) => string;
  translation: boolean;
  notify: (s: string) => void;
}>({ locale: "en", t: (k) => k, translation: false, notify: () => {} });
export const useUI = () => useContext(UIContext);
export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    explore: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),
    bookings: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M7 3v4m10-4v4M3 11h18m-14 5h4" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3h.01" />
      </>
    ),
    notifications: (
      <>
        <path d="M5 17h14l-2-4V9a5 5 0 0 0-10 0v4zM10 21h4" />
      </>
    ),
    profile: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 22v-3a8 8 0 0 1 16 0v3" />
      </>
    ),
    centre: (
      <>
        <path d="M3 21V8l9-5 9 5v13M8 21v-7h8v7M7 9h.01M12 9h.01M17 9h.01" />
      </>
    ),
    members: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M2 21v-4a7 7 0 0 1 14 0v4M17 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5" />
      </>
    ),
    operators: (
      <>
        <path d="m14 6 4-3 3 3-3 4-4-1-9 12-3-3L14 9z" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2" />
      </>
    ),
    moon: <path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z" />,
    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    search: (
      <>
        <circle cx="10" cy="10" r="6" />
        <path d="m15 15 6 6" />
      </>
    ),
    check: <path d="m5 12 4 4L20 5" />,
    logout: (
      <>
        <path d="M10 4H4v16h6m4-13 5 5-5 5m-6-5h11" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    plus: <path d="M12 4v16M4 12h16" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 2" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.explore}
    </svg>
  );
}
export function ResourceArt({ category }: { category: string }) {
  const artwork: Record<string, React.ReactNode> = {
    tools: (
      <>
        <path
          d="M82 60h132l15 20-15 28h-65l-8 45h-39l13-63H82z"
          fill="var(--object)"
        />
        <path d="M82 62H57v28h25m172-20h-25v22h25l23-11zM157 62v45m10-37h35m-35 10h30M107 153h40v13H92v-13z" />
        <path d="m114 116 28 4" />
      </>
    ),
    creative: (
      <>
        <rect
          x="64"
          y="62"
          width="192"
          height="105"
          rx="16"
          fill="var(--object)"
        />
        <path d="m111 62 12-21h66l12 21M77 87h28m126-13h11" />
        <circle cx="163" cy="114" r="43" fill="var(--drawing)" />
        <circle cx="163" cy="114" r="31" />
        <circle cx="163" cy="114" r="18" fill="var(--object)" />
        <path d="M78 147h22" />
      </>
    ),
    outdoors: (
      <>
        <path d="m49 165 87-126h54l85 126z" fill="var(--object)" />
        <path
          d="m136 39 63 126H49M136 39v126m0-82-41 82h83z"
          fill="var(--drawing)"
        />
        <path d="M136 83v82M40 171h244M76 109l-33 54m194-54 43 54" />
        <path d="M229 39v23m-11-11h22" strokeWidth="2" />
      </>
    ),
    books: (
      <>
        <path d="m70 70 50-16 29 105-50 16z" fill="var(--object)" />
        <path
          d="m80 91 48-15m-33 69 46-15M160 55h35v115h-35z"
          fill="var(--drawing)"
        />
        <path
          d="M160 75h35m-35 75h35m15-98 32-7 25 120-32 7z"
          fill="var(--object)"
        />
        <path d="m216 76 32-7m-16 77 32-7M57 178h224" />
      </>
    ),
    electronics: (
      <>
        <path d="M71 73h172l18 25v61H57V98z" fill="var(--object)" />
        <path d="M57 98h204M81 119h57m-57 10h57m-57 10h57m-65 21v9m169-9v9" />
        <circle cx="206" cy="127" r="23" fill="var(--drawing)" />
        <circle cx="206" cy="127" r="13" />
        <path d="M93 84h60m-15-46 5 10m-27-4 3 10" strokeWidth="2" />
      </>
    ),
    spaces: (
      <>
        <path d="M45 89h229v17H45z" fill="var(--object)" />
        <path d="M65 107v66m187-66v66M94 106v47m129-47v47" />
        <path d="M115 89V56h64v33" fill="var(--drawing)" />
        <path d="M110 89h76m37-3V61m0 8-15-12m15 3 13-12" />
        <path d="M201 74h24v14h-24z" fill="var(--object)" />
      </>
    ),
    home: (
      <>
        <ellipse cx="159" cy="145" rx="90" ry="24" fill="var(--object)" />
        <ellipse cx="159" cy="134" rx="90" ry="24" fill="var(--drawing)" />
        <ellipse cx="159" cy="123" rx="90" ry="24" fill="var(--object)" />
        <ellipse cx="159" cy="123" rx="58" ry="13" />
        <path d="M106 73c0 27 13 32 30 32s30-5 30-32z" fill="var(--drawing)" />
        <path d="M166 76c29-12 23 30-6 22M199 47v52m-8-50v14h16V49" />
      </>
    ),
    other: (
      <>
        <path d="m72 80 88-37 87 37v80l-87 30-88-30z" fill="var(--object)" />
        <path
          d="m72 80 88 32 87-32m-87 32v78M115 60l89 34v31l-29 10v-30z"
          fill="var(--drawing)"
        />
      </>
    ),
  };
  return (
    <svg
      className="resource-illustration"
      viewBox="0 0 320 220"
      aria-hidden="true"
    >
      <ellipse
        cx="160"
        cy="187"
        rx="109"
        ry="10"
        fill="currentColor"
        opacity=".06"
      />
      <g
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      >
        {artwork[category] || artwork.other}
      </g>
    </svg>
  );
}
export function CollectionScene() {
  const { t } = useUI();
  return (
    <div className="collection-scene" aria-hidden="true">
      <div className="scene-orbit" />
      <div className="scene-card scene-books">
        <ResourceArt category="books" />
        <span>{t("books")}</span>
      </div>
      <div className="scene-card scene-camera">
        <ResourceArt category="creative" />
        <span>{t("creative")}</span>
      </div>
      <div className="scene-note">
        <Icon name="arrow" size={18} />
        {t("good_things")}
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
export function Status({ value }: { value: string }) {
  const { t } = useUI();
  return (
    <span className={"status status-" + value}>
      <i />
      {t(value)}
    </span>
  );
}
export function Empty() {
  const { t } = useUI();
  return (
    <div className="empty">
      <Icon name="bookings" size={30} />
      <p>{t("empty")}</p>
    </div>
  );
}
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { t } = useUI();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const els = ref.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href]",
        );
        if (!els?.length) return;
        const first = els[0],
          last = els[els.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [onClose]);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        ref={ref}
      >
        <div className="modal-heading">
          <h2 id="modal-title">{title}</h2>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label={t("close")}
          >
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
export function TextContent({ text }: { text: string }) {
  const { locale, t, translation, notify } = useUI();
  const [translated, setTranslated] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => setTranslated(""), [locale, text]);
  return (
    <div className="user-content">
      <p className="preserve">{translated || text}</p>
      {locale !== "en" && text && (
        <>
          {translated ? (
            <small>
              {t("translated")}{" "}
              <button className="text-button" onClick={() => setTranslated("")}>
                {t("original")}
              </button>
            </small>
          ) : translation ? (
            <button
              className="text-button"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  const r = await api<{ text: string }>("/translate", "POST", {
                    text,
                    locale,
                  });
                  setTranslated(r.text);
                } catch {
                  notify(t("error"));
                } finally {
                  setBusy(false);
                }
              }}
            >
              {t(busy ? "loading" : "translate")}
            </button>
          ) : (
            <small className="muted">{t("no_api")}</small>
          )}
        </>
      )}
    </div>
  );
}
export function ErrorBox({ error }: { error: unknown }) {
  const { locale, t } = useUI();
  if (!error) return null;
  return (
    <div className="error" role="alert">
      {locale === "en" && error instanceof Error ? error.message : t("error")}
      {locale !== "en" && error instanceof APIError && (
        <details>
          <summary>{t("original")}</summary>
          {error.message}
        </details>
      )}
    </div>
  );
}
