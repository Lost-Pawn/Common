# Common demo guide

## Story

Asha has a tent she uses a few weekends each year. Ravi needs one for a short trip. Common lets Asha list it, review Ravi's dates and record its return, while both can also borrow from other people.

## Walkthrough

1. Open localhost:8080 and choose the Member demo account. Show discovery, free items, categories and dark mode.
2. Choose Add a listing. Enter a tent, Outdoors, its location and return conditions. Leave training empty, price at zero, operating hours at 0 and 24, and duration at 168 hours.
3. Sign out through the sidebar or My profile on mobile. Sign in as `ravi@common.test` with `CommonDemo2026!`.
4. Find the new listing and request two future days. Accept its conditions and explain the trip.
5. Sign in as `asha@common.test`. Open My bookings to see the incoming request and approve it. Show that Asha still has an ordinary member account.
6. For a booking at its approved start, collect it with a before photo and checklist, return with an after photo, then have the owner confirm inspection. For a future-slot demo, a manager can record early check-in with an explicit reason.
7. Show a competing request, a waiting list or an extension conflict. Explain the decision shown by the application.
8. Open the help chat and ask how returns work. Show its citations, then switch interface language.

All demo identities and resources are fictional. Use a clearly labelled test photograph for condition evidence.

## Presentation points

- Problem: useful possessions are idle while others need occasional access.
- Product: one account can lend and borrow, with owner approval and a traceable return.
- Technical depth: permissions by ownership, transactional scheduling, multi-week quotas, persistent images and restart-safe reminders.
- Sustainability: repeated use is observable through completed loans; the app does not invent carbon savings.
- Limits: collection and payments are arranged outside the platform; live hosting and provider configuration need separate verification.

The current GitHub repository remains at Lost-Pawn/Knitwork until its owner renames it. The product name shown throughout the application is Common.
