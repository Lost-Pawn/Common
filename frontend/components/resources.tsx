"use client";
import { useCallback, useEffect, useState } from "react";
import {
  api,
  estimateFee,
  canManage,
  indianDate,
  isStaff,
  localISO,
  nextDate,
} from "@/lib/api";
import { Resource, User } from "@/lib/types";
import {
  Empty,
  ErrorBox,
  Field,
  Icon,
  ResourceArt,
  CollectionScene,
  Modal,
  Status,
  TextContent,
  useUI,
} from "./ui";

export default function Resources({
  user,
  resources,
  members,
  onChange,
  onBooked,
}: {
  user: User;
  resources: Resource[];
  members: User[];
  onChange: () => Promise<void>;
  onBooked: () => void;
}) {
  const { t, locale, notify } = useUI();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [mine, setMine] = useState(false);
  const [free, setFree] = useState(false);
  const categories = [
    "tools",
    "electronics",
    "outdoors",
    "books",
    "home",
    "spaces",
    "creative",
    "other",
  ];
  const [returnDate, setReturnDate] = useState(nextDate());
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<Resource | null>(null);
  const [creating, setCreating] = useState(false);
  const [occupied, setOccupied] = useState<
    { starts_at: string; ends_at: string; status: string }[]
  >([]);
  const [error, setError] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  const [date, setDate] = useState(nextDate());
  const [start, setStart] = useState("10:00");
  const [end, setEnd] = useState("11:00");
  const close = useCallback(() => {
    setSelected(null);
    setCreating(false);
    setError(null);
  }, []);
  useEffect(() => {
    setOccupied([]);
    if (selected)
      api<typeof occupied>(`/resources/${selected.id}/availability`)
        .then(setOccupied)
        .catch(setError);
  }, [selected]);
  const filtered = resources.filter(
    (r) =>
      (category === "all" || r.category === category) &&
      (!ready || !r.maintenance) &&
      (!mine || r.owner_id === user.id) &&
      (!free || r.hourly_rate === 0) &&
      (r.name + " " + r.location + " " + r.description)
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  async function book(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      await api("/bookings", "POST", {
        resource_id: selected.id,
        borrower_id: Number(f.get("borrower") || user.id),
        starts_at: localISO(date, start),
        ends_at: localISO(returnDate, end),
        purpose: f.get("purpose"),
        assisted: f.get("assisted") === "on",
        accepted: f.get("accepted") === "on",
      });
      await onChange();
      close();
      notify(t("saved"));
      onBooked();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }
  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    const body: Record<string, unknown> = {};
    for (const [k, v] of f.entries())
      body[k] = [
        "hourly_rate",
        "deposit",
        "max_hours",
        "weekly_hours",
        "open_hour",
        "close_hour",
        "buffer_minutes",
      ].includes(k)
        ? Number(v)
        : v;
    try {
      await api("/resources", "POST", body);
      await onChange();
      close();
      notify(t("saved"));
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <section className="hero">
        <div>
          <div className="eyebrow">{t("shared_centre")}</div>
          <h1>{t("welcome")}</h1>
          <p>{t("intro")}</p>
          <span className="hero-note">
            <Icon name="check" size={16} />
            {t("review_needed")}
          </span>
        </div>
        <CollectionScene />
      </section>
      <div className="section-title">
        <h2>{t("explore")}</h2>
        {
          <button className="primary" onClick={() => setCreating(true)}>
            <Icon name="plus" />
            {t("add_resource")}
          </button>
        }
      </div>
      <div className="filters">
        <label className="search">
          <Icon name="search" />
          <input
            aria-label={t("search")}
            placeholder={t("search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <div className="tabs">
          {["all", ...categories].map((c) => (
            <button
              key={c}
              className={category === c ? "selected" : ""}
              onClick={() => setCategory(c)}
            >
              {t(c)}
            </button>
          ))}
        </div>
        <label className="check-inline">
          <input
            type="checkbox"
            checked={ready}
            onChange={(e) => setReady(e.target.checked)}
          />
          {t("available")}
        </label>
      </div>
      <div className="catalog-tools">
        <span className="result-count">
          {filtered.length} {t("listings")}
        </span>
        <label className="check-inline">
          <input
            type="checkbox"
            checked={mine}
            onChange={(e) => setMine(e.target.checked)}
          />
          {t("my_listings")}
        </label>
        <label className="check-inline">
          <input
            type="checkbox"
            checked={free}
            onChange={(e) => setFree(e.target.checked)}
          />
          {t("free_only")}
        </label>
      </div>
      <div className="resource-grid">
        {filtered.map((r) => (
          <article className="resource-card" key={r.id}>
            <div className={"resource-art " + r.category}>
              <span className="art-label">{t(r.category)}</span>
              <ResourceArt category={r.category} />
            </div>
            <div className="resource-body">
              <Status value={r.maintenance ? "maintenance" : "available"} />
              <h3>{r.name}</h3>
              <p className="location">
                <Icon name="pin" size={14} />
                {r.location}
              </p>
              <div className="resource-meta">
                <span>
                  <Icon name="clock" size={16} />
                  {r.max_hours >= 24 && r.max_hours % 24 === 0 ? (
                    <>
                      {r.max_hours / 24} {t("days")}
                    </>
                  ) : (
                    <>
                      {r.max_hours} {t("hours")}
                    </>
                  )}
                </span>
                <span>
                  {r.operator_policy === "required"
                    ? t("operator_required")
                    : t(r.training ? "training" : "everyday")}
                </span>
              </div>
              <div className="card-bottom">
                <span className="price">
                  {r.hourly_rate === 0 ? (
                    t("free")
                  ) : (
                    <>
                      ₹{r.hourly_rate}
                      <small> / {t("hour")}</small>
                    </>
                  )}
                </span>
                <button
                  className="text-button"
                  onClick={() => {
                    setSelected(r);
                    setError(null);
                  }}
                >
                  {t("view")}
                  <Icon name="arrow" size={16} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && <div className="empty">{t("no_results")}</div>}
      {selected && (
        <Modal title={selected.name} onClose={close}>
          <div className="detail-art resource-art">
            <ResourceArt category={selected.category} />
          </div>
          <div className="detail-intro">
            <p className="eyebrow">
              {t("shared_by")} {selected.owner_name}
            </p>
            <Status
              value={selected.maintenance ? "maintenance" : "available"}
            />
            <TextContent text={selected.description} />
            <p className="muted">{selected.location}</p>
          </div>
          <div className="facts">
            <div>
              {t("opening")}
              <strong>
                {selected.open_hour}:00–{selected.close_hour}:00 IST
              </strong>
            </div>
            <div>
              {t("weekly")}
              <strong>
                {selected.weekly_hours} {t("hours")}
              </strong>
            </div>
            <div>
              {t("session_limit")}
              <strong>
                {selected.max_hours} {t("hours")}
              </strong>
            </div>
            <div>
              {t("deposit")}
              <strong>₹{selected.deposit}</strong>
            </div>
          </div>
          <h3>{t("rules")}</h3>
          <TextContent text={selected.rules} />
          <div className="notice">
            <h3>{t("eligibility")}</h3>
            <p>
              {t(
                selected.training || selected.operator_policy !== "none"
                  ? user.verified
                    ? "verified"
                    : "unverified"
                  : "open_access",
              )}
            </p>
            <p>
              {t("training")}: {selected.training || t("none")}{" "}
              {selected.training &&
              user.qualifications.includes(selected.training)
                ? "✓"
                : ""}
            </p>
            {selected.operator_policy === "required" && (
              <p>{t("operator_required")}</p>
            )}
          </div>
          <h3>{t("occupied")}</h3>
          {occupied.length ? (
            <ul className="schedule">
              {occupied.map((o, i) => (
                <li key={i}>
                  {indianDate(o.starts_at, locale)} —{" "}
                  {indianDate(o.ends_at, locale)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">{t("empty")}</p>
          )}
          {!selected.maintenance && (
            <form onSubmit={book} className="form">
              <h3>{t("request")}</h3>
              {["manager", "admin"].includes(user.role) && (
                <Field label={t("member_for")}>
                  <select name="borrower">
                    <option value={user.id}>{t("self")}</option>
                    {members
                      .filter((m) => m.role === "borrower")
                      .map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                  </select>
                </Field>
              )}
              <div className="form-grid">
                <Field label={t("date")}>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      if (returnDate < e.target.value)
                        setReturnDate(e.target.value);
                    }}
                    min={selected.available_from}
                    max={selected.available_to}
                  />
                </Field>
                <Field label={t("start")}>
                  <input
                    type="time"
                    required
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                  />
                </Field>
                <Field label={t("return_date")}>
                  <input
                    type="date"
                    required
                    value={returnDate}
                    min={date}
                    max={selected.available_to}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </Field>
                <Field label={t("end")}>
                  <input
                    type="time"
                    required
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                  />
                </Field>
              </div>
              <small>{t("timezone")}</small>
              <Field label={t("purpose")}>
                <textarea
                  name="purpose"
                  required
                  minLength={5}
                  maxLength={1000}
                />
              </Field>
              {selected.operator_policy !== "none" && (
                <label className="check-inline">
                  <input
                    type="checkbox"
                    name="assisted"
                    defaultChecked={
                      selected.operator_policy === "required" ||
                      Boolean(
                        selected.training &&
                        !user.qualifications.includes(selected.training),
                      )
                    }
                  />
                  {t("assistance")}
                </label>
              )}
              <label className="check-inline">
                <input type="checkbox" name="accepted" required />
                {t("accept")}
              </label>
              <div className="estimate">
                {t("estimate")}{" "}
                <strong>
                  ₹
                  {estimateFee(
                    date,
                    start,
                    end,
                    selected.hourly_rate,
                    returnDate,
                  )}
                </strong>
              </div>
              <ErrorBox error={error} />
              <button className="primary full" disabled={busy}>
                {t(busy ? "loading" : "request")}
                <Icon name="arrow" />
              </button>
            </form>
          )}
          {canManage(user.role, user.id, selected.owner_id) && (
            <form
              className="form"
              onSubmit={async (e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                setBusy(true);
                try {
                  await api(`/resources/${selected.id}`, "PATCH", {
                    maintenance: !selected.maintenance,
                    reason: f.get("reason"),
                  });
                  await onChange();
                  close();
                  notify(t("saved"));
                } catch (err) {
                  setError(err);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <Field label={t("reason")}>
                <textarea name="reason" required minLength={5} />
              </Field>
              <button className="secondary" disabled={busy}>
                {t(selected.maintenance ? "release" : "pause")}
              </button>
              <ErrorBox error={error} />
            </form>
          )}
        </Modal>
      )}
      {creating && (
        <Modal title={t("add_resource")} onClose={close}>
          <form className="form" onSubmit={create}>
            <Field label={t("name")}>
              <input name="name" required minLength={3} maxLength={120} />
            </Field>
            <Field label={t("category")}>
              <select name="category">
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {t(c)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("description")}>
              <textarea name="description" required maxLength={2000} />
            </Field>
            <Field label={t("location")}>
              <input name="location" required />
            </Field>
            <Field label={t("rules")}>
              <textarea name="rules" required maxLength={2000} />
            </Field>
            <details className="advanced-settings">
              <summary>{t("specialist_settings")}</summary>
              <div className="form-grid">
                <Field label={t("training")}>
                  <input name="training" />
                </Field>
                <Field label={t("assistance")}>
                  <select name="operator_policy">
                    {["none", "optional", "required"].map((v) => (
                      <option key={v} value={v}>
                        {t(v)}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </details>
            <p className="muted">{t("loan_hint")}</p>
            <div className="form-grid">
              {[
                ["hourly_rate", "hourly_rate", 0],
                ["deposit", "deposit", 0],
                ["max_hours", "session_limit", 168],
                ["weekly_hours", "weekly", 168],
                ["open_hour", "start", 0],
                ["close_hour", "end", 24],
                ["buffer_minutes", "buffer", 30],
              ].map(([name, key, val]) => (
                <Field key={name} label={t(String(key))}>
                  <input
                    type="number"
                    name={String(name)}
                    defaultValue={val}
                    required
                    min={
                      ["max_hours", "weekly_hours", "close_hour"].includes(
                        String(name),
                      )
                        ? 1
                        : 0
                    }
                    max={
                      ["max_hours", "weekly_hours"].includes(String(name))
                        ? 168
                        : name === "open_hour"
                          ? 23
                          : name === "close_hour"
                            ? 24
                            : name === "buffer_minutes"
                              ? 180
                              : undefined
                    }
                  />
                </Field>
              ))}
            </div>
            <div className="form-grid">
              <Field label={t("from")}>
                <input
                  type="date"
                  name="available_from"
                  defaultValue={nextDate()}
                  required
                />
              </Field>
              <Field label={t("to")}>
                <input
                  type="date"
                  name="available_to"
                  defaultValue="2028-12-31"
                  required
                />
              </Field>
            </div>
            <ErrorBox error={error} />
            <button className="primary" disabled={busy}>
              {t(busy ? "loading" : "add_resource")}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
