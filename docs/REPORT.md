# Common Product and Implementation Report

Version 2 dated 15 November 2026

## Product overview

Common lets people share useful things they already own. A member can lend books, tools, outdoor gear, household items or a workspace and borrow from others through the same account. Owners set the conditions, review requests and confirm returns. The product supports free sharing and hourly usage estimates while keeping the handover history in one place.

The implementation combines a responsive Next.js interface, a Go REST API and persistent PostgreSQL storage. It includes local Docker setup, a disposable test environment, Render configuration, six interface languages and a cited help chat. The application is a working prototype; operational adoption and hosted deployment need separate validation.

## Problem and target users

Useful possessions can sit idle while someone nearby needs temporary access. Informal messages can arrange the initial exchange, but often leave availability, return dates and condition records scattered across conversations. Common records that process from the first request to the confirmed return.

Target users include residents borrowing occasional household tools, students sharing books and electronics, hobbyists exchanging creative gear, groups arranging reusable event supplies and hosts offering workspace. Each listing provides its own location and conditions. The catalogue is general-purpose and does not depend on a single workshop or industry.

Owners may benefit from clearer schedules, recorded condition and reuse of idle possessions. Borrowers may avoid buying something they only need temporarily. These are intended benefits, not measured adoption or environmental outcomes. The project does not claim verified cost or carbon savings.

## Core experience

A member creates a listing with a category, description, location, rules and availability. Zero hourly rate means free to borrow. Specialist qualifications and operator support are optional; everyday listings do not require staff approval to publish.

Other members search the catalogue and request dates. The owner reviews the purpose and either approves, rejects or waitlists the request. The system checks conflicting loans, weekly caps and the resource's access policy before approval. Ordinary members manage their own listings without receiving access to other owners' resources.

Loans may span multiple days, up to seven days within the chosen duration limit. Overnight lending uses 0 to 24 operating hours. Resources with limited operating hours and assisted sessions retain same-day scheduling. Weekly quotas account for time in every calendar week the loan overlaps.

The borrower records condition at collection and return. The owner inspects the return before completing it. Damage creates a hold and incident for human review. Participants can inspect their booking timeline, receive reminders and request extra time. Private condition photographs remain limited to participants and authorised staff.

## Interface design

The interface uses warm neutral surfaces, serif headings, restrained green accents and simple category illustrations. Cards distinguish the resource, location, access state and price. Search, category selection, free-only filtering and personal listings are available from discovery.

Light and dark themes share semantic colour tokens across authentication, discovery, bookings, profiles, management and dialogs. The chosen theme persists and defaults to the device preference for a new visitor. Short entrance and hover transitions respect reduced-motion settings. Layouts adapt for smaller screens; forms retain labelled inputs and visible focus states.

English, Hindi, Marathi, Bengali, Tamil and Telugu are available for interface text. Generated translation of member-written content is optional, labelled and accompanied by its original. Linguistic completeness tests do not replace native-speaker review.

## Technical depth

Next.js exports static assets, which Go serves alongside the REST API from the same origin. PostgreSQL holds all persistent state, including bounded condition images, avoiding dependence on an ephemeral container filesystem. Dependency versions are pinned through the Go module and npm lockfiles.

Allocation decisions use transactional locks and PostgreSQL exclusion constraints. A resource and any assigned operator cannot receive overlapping confirmed bookings. Approval revalidates account state, qualifications, working hours, turnaround time, queue priority and individual or assigned-group quotas.

Authorisation follows resource ownership rather than a special owner role. A member can review an incoming request for their own resource but cannot inspect or alter unrelated private loans. Managers retain community review permissions; administrators additionally manage roles and escalated incidents. Password hashes, revocable HTTP-only sessions and same-origin mutation checks protect authenticated operations.

The help assistant searches a published corpus using PostgreSQL full-text retrieval. Without credentials it returns cited excerpts. With a compatible provider it generates an answer grounded in those excerpts, falling back locally on provider failure. It never operates resources or makes approval decisions.

## Deployment and upgrade

Docker Compose builds the frontend and backend and starts persistent PostgreSQL. Fresh installations use Common service and database names. Existing installations retain their database name, password and volume through configuration. Additive migrations expand duration limits and generalise old category labels without deleting booking history or condition evidence.

The local demonstration includes general resources and fictional accounts. Production disables those accounts and supports administrator bootstrap. The Render Blueprint describes a fresh paid deployment; existing hosted services should keep their existing database identity and connection. Provider credentials and actual Render hosting are external configuration steps.

## Demonstration and presentation

Start with an everyday need: someone wants a tent for a weekend and another person already has one. Sign in as a member, list a tent, switch to another member and request a two-day loan. Return to the creator's account and approve it. Explain how the same account can lend and borrow without being a platform administrator.

Show the complete condition and return process on a booking whose approved start time has arrived. For a future booking, a manager can demonstrate early handover with a recorded reason. Then show one failure case: an overlapping reservation or weekly limit prevents approval. Use the drill kit to demonstrate optional specialist support separately.

Close with the ownership boundary, persistent history and accessible interface. Show dark mode and a regional language. Present technical evidence from the validation record rather than claiming every deployment or production-readiness check has passed.

## Limitations and next steps

The prototype does not arrange delivery, settle payments, validate real identities or guarantee that a listing is suitable for a borrower's purpose. General listing images are category illustrations; uploaded photographs belong to the condition workflow. Location search matches text, with no distance ranking or GPS. Long-term rentals beyond seven days require a future policy extension.

Before a public launch, validate the lending workflow with real users, review translations with native speakers, test accessibility more formally, establish moderation and support practices, and exercise backups and recovery. Actual team contributions and implementation assistance belong in the participant record. Common's value should be assessed through real completed exchanges and user feedback.
