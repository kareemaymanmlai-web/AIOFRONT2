import {
  BarChart3,
  Bell,
  Building2,
  Calendar,
  CreditCard,
  Files,
  Home,
  LayoutDashboard,
  Lock,
  Settings,
  Shield,
  Users
} from "lucide-react";
import { NavLink } from "react-router-dom";

const icons = {
  dashboard: LayoutDashboard,
  home: Home,
  rooms: Building2,
  files: Files,
  members: Users,
  notifications: Bell,
  calendar: Calendar,
  analytics: BarChart3,
  security: Shield,
  subscription: CreditCard,
  settings: Settings,
  locked: Lock
};

export function AppLayout({ appTitle, user, nav, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-mark">{appTitle.slice(0, 2).toUpperCase()}</div>
          <div>
            <strong>{appTitle}</strong>
            <span>{user.company}</span>
          </div>
        </div>
        <div className="user-card">
          <div className="avatar">{user.name.slice(0, 1)}</div>
          <div>
            <strong>{user.name}</strong>
            <span>{user.role}</span>
          </div>
        </div>
        <nav className="nav-list">
          {nav.map((item) => {
            const Icon = icons[item.icon] || icons.dashboard;
            return (
              <NavLink
                className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                key={item.id}
                to={item.path}
                end
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="main-panel">
        <header className="topbar">
          <div>
            <strong>{appTitle}</strong>
            <span>جاهز للربط مع الباك إند</span>
          </div>
          <button className="icon-btn" aria-label="notifications">
            <Bell size={18} />
          </button>
        </header>
        <div className="content-area">{children}</div>
      </main>
    </div>
  );
}
