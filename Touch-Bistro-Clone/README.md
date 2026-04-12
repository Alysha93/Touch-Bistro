# TouchBistro Clone

A full-stack, tablet-optimized restaurant operating system inspired by TouchBistro, built with Next.js 15 (App Router), Drizzle ORM, and SQLite.

## Live System Demo 🚀
![Full System Walkthrough Video](./public/touch_bistro_app_demo.webp)

## Modules Included

- **Main Register (`/pos`)**: Staff Login via PIN keypad, interactive Floorplan, complex Table Ordering features (seat grouping, quick-add), and complete receipt Checkout with Loyalty integration.
- **Kitchen Display System (`/kds`)**: Independent back-of-house ticketing interface featuring specialized station filtering (Grill vs Expo), item-level strike-offs, ticket bumping, and elapsed-time visualization.
- **Customer Facing Display (`/cfd`)**: A connected tablet interface designed to face the customer that syncs to active Register checkouts in real-time, prompting for on-screen Tips and Signatures.
- **Online Takeout Web App (`/online`)**: A distinct customer-facing menu portal supporting shopping carts and Loyalty point retrieval. Web orders bypass the floorplan entirely, alerting the local POS register via a live badge and injecting the tickets straight into the Kitchen Display queue.


## Application Showcase

### Active Table Session
![Table Order Interface](./public/screenshots/showcase_2.png)

### Kitchen Display Engine
![Red Dark Mode KDS Ticket Array](./public/screenshots/showcase_1.png)

### Kitchen Display Grid View
![White Light Mode KDS Grid](./public/screenshots/showcase_3.png)

### Active Category Filtering
![Menu Spirits Tab Filter](./public/screenshots/showcase_4.png)

### Secure Tip Checkout Modal
![Checkout Logic](./public/screenshots/showcase_5.png)

### Extended System Walkthrough

<details>
<summary><b>Click to expand full interface gallery (24+ HD Screenshots)</b></summary>

![POS Walkthrough](./public/screenshots/gallery/gallery_1.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_2.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_3.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_4.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_5.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_6.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_7.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_8.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_9.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_10.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_11.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_12.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_13.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_14.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_15.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_16.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_17.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_18.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_19.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_20.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_21.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_22.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_23.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_24.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_25.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_26.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_27.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_28.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_29.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_30.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_31.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_32.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_33.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_34.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_35.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_36.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_37.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_38.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_39.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_40.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_41.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_42.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_43.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_44.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_45.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_46.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_47.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_48.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_49.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_50.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_51.png)
![POS Walkthrough](./public/screenshots/gallery/gallery_52.png)

</details>

## Setup

1. `npm install`
2. `npx drizzle-kit push` (to synchronize the SQLite schema)
3. `npm run seed` (to populate Staff PINs, menu items, and prep stations)
4. `npm run dev`

## Schema

The database is built using SQLite and Drizzle ORM. The core schema includes:
- **`prep_stations`**: Kitchen stations (e.g., Grill, Expo).
- **`staff`**: Staff members with roles and secure PINs.
- **`tables`**: Restaurant tables with statuses (`open`, `seated`, `paid`).
- **`menu_categories` & `menu_items`**: Menu catalog with pricing and prep station assignments.
- **`orders` & `order_items`**: Active and past orders, linking tables, staff, and individual item status.
- **`kds_tickets`**: Kitchen Display System tickets for tracking prep times.
- **`loyalty_accounts`**: Customer loyalty tracking via phone number.
- **`menu_modifiers`**: Customizations for menu items.
- **`timeclocks`**: Staff clock-in/out tracking.
- **`reservations`**: Customer table reservations.

## License

This project is licensed under the [MIT License](LICENSE).
