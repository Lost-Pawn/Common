# Common Software Requirements Specification

Version 2 dated 15 November 2026

## Product and scope

Common is a community resource-sharing application. Individuals and groups can list useful items and spaces, request temporary access, approve loans and record returns. The catalogue covers tools, electronics, outdoor gear, books, household items, creative resources, spaces and other useful things. Listings can be free or carry an hourly rate. The application coordinates sharing; collection and any payment are arranged with the owner.

The same member can lend and borrow. A privileged owner role is not required to publish a listing or review requests for that listing. Managers handle specialist verification and community support; administrators additionally manage roles, suspended accounts and escalated disputes.

## Discovery and listing

FR01 Accounts shall use hashed passwords and revocable server sessions. Public registration creates an ordinary unverified member and cannot assign privileged roles. A neighbourhood or group is optional. Suspended accounts cannot use authenticated endpoints.

FR02 Any active signed-in member shall publish a resource with a name, category, description, location, conditions, rate, deposit, availability window, operating hours, loan duration cap, weekly cap and turnaround interval. The creator becomes its owner. Members can pause or release their own resources with an inspection reason; another member cannot manage them.

FR03 Members shall search names, descriptions and locations, filter categories, show free resources and isolate their own listings. Cards shall show category, operational state, maximum duration and hourly rate or free status. Category illustrations are decorative representations, not photographs of a particular listing.

FR04 A resource detail view shall show its owner, conditions, access requirements and reserved intervals. Availability does not imply automatic approval. Descriptions and condition evidence remain attributable to the member who provided them.

## Requests and allocation

FR05 A request shall contain the resource, borrower, start and return dates and times, purpose, accepted conditions and optional assistance. Managers may record a request on another member's behalf. Only the owner or community staff can approve, reject or waitlist it.

FR06 Ordinary resources shall allow unverified active members to borrow with owner approval. Resources requiring training or operator support shall retain membership verification, manager-approved qualifications and any required qualified operator. Members cannot grant themselves specialist credentials.

FR07 Loans shall last at least fifteen minutes and no more than the listing cap, up to 168 hours. Overnight loans require operating hours of 0 through 24. Session-only resources and operators retain same-day working-hour checks. Both collection and return must fall within the listing's availability dates.

FR08 Approval and extension shall recheck maintenance, eligibility, resource conflicts, operator conflicts, availability, turnaround time and weekly quotas in a transaction. Database exclusion constraints shall prevent overlapping confirmed allocations. Quotas shall count only hours overlapping each calendar week, including loans spanning two weeks. Staff-assigned group quotas remain available.

FR09 Earlier eligible waiting requests shall receive priority. Owners or managers may record a reason to override queue order but cannot override access or scheduling constraints. Cancellation shall notify waiting members without automatically approving another request.

## Handover and accountability

FR10 Borrowers or authorised reviewers shall record check-in with a condition note, checklist and a bounded JPEG, PNG or WebP image. Collection is permitted near the approved start; an early staff handover requires an explicit reason. Changed eligibility is rechecked before handover.

FR11 Return shall collect a final note, condition photograph and damage declaration. The booking remains return pending until the owner or manager confirms inspection. Damage places the resource on hold. Incident resolution and release require recorded human decisions.

FR12 Members shall request extensions and report damage, delay, conflict or other incidents. Approval shall recheck allocation before changing the end time. Participants can escalate a dispute for administrator review. The application does not determine liability or transfer money.

FR13 Booking participants and staff shall see the relevant timeline and private condition evidence. Unrelated members cannot read another loan's photographs or details. Material actions shall create immutable audit events. Notifications and deduplicated reminders shall persist across restarts.

## Interface and help

FR14 The interface shall provide responsive navigation, classic light and dark themes, a persisted theme preference, readable type, visible keyboard focus and labelled controls. New users shall receive their system theme until they select a preference. Motion shall respect reduced-motion settings. Listing creation shall expose specialist access settings as optional.

FR15 English, Hindi, Marathi, Bengali, Tamil and Telugu dictionaries shall cover all interface keys. The chosen language shall persist. Optional user-content translation shall preserve the original text and label generated translations. Native-speaker review remains a release activity.

FR16 The help chat shall retrieve published guidance and show citations without requiring an external model. Configured compatible model credentials enable generated answers with local fallback. The help assistant cannot alter bookings, grant access or adjudicate disputes.

## Architecture and deployment

The frontend uses Next.js, React and TypeScript with static export. Go serves a same-origin REST API and the exported assets. PostgreSQL stores accounts, resources, bookings, operators, condition images, notifications, help passages and audit events. SQL is parameterised, photos have bounded type and size, and real secrets remain outside Git.

Docker Compose shall build and run the app with persistent PostgreSQL and fictional demo accounts. A separate disposable test composition shall exercise integration tests. Production disables demo seeding. Render configuration shall support persistent storage, HTTPS cookies, administrator bootstrap and a readiness endpoint. Existing installations shall upgrade through migrations and retain their original database connection and volume.

## Acceptance criteria

AT01 A newly registered member can list an ordinary resource, receive another member's request and approve it without acquiring an owner or staff role. An unrelated member cannot approve the request or pause that resource.

AT02 A multi-day loan checks both availability endpoints and every overlapping week's quota. Competing approvals cannot double-book a resource or operator. Restricted resources continue to enforce qualification and verification checks.

AT03 The complete request, approval, photo check-in, photo return and owner confirmation lifecycle persists across application restarts. Damage and unresolved incidents prevent premature resource release.

AT04 All six dictionaries pass completeness checks. Production assets compile, Go tests and integration tests pass, and the Docker app starts with a healthy database. Browser review covers the new listing path, filters, themes and responsive layout.

AT05 The README, demo guide, API reference, report, environment examples and exported documents describe Common consistently. The validation record distinguishes tested local behaviour from untested external services.

## Release boundaries

The release does not include delivery, a payment gateway, identity-document verification, automatic damage assessment, live hardware controls or guaranteed geographic proximity. Search uses listed locations rather than GPS. Listing illustrations are category-based; condition photos are uploaded during handover. Render hosting, real provider integration and field validation require their own deployment and user testing.
