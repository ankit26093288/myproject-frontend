import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import styles from "./OwnerLayout.module.css";

const OwnerLayout = () => {
  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>🏠 Owner</h2>
        <nav className={styles.nav}>
          <NavLink
            to="/owner/dashboard"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            🏠 Dashboard
          </NavLink>

          <NavLink
            to="/owner/add-pg"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            ➕ Add PG
          </NavLink>

          <NavLink
            to="/owner/manage-listings"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            📋 Manage Listings
          </NavLink>

          <NavLink
            to="/owner/booking-requests"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            📩 Booking Requests
          </NavLink>

          <NavLink
            to="/owner/profile"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            👤 Profile
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default OwnerLayout;

