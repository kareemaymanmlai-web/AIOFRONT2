import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Eye,
  FileText,
  LockKeyhole,
  LogOut,
  Play,
  ShieldCheck,
  UserRound
} from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import { SmartTable } from "../components/SmartTable";
import { StatGrid } from "../components/StatGrid";
import { useAuth } from "../contexts/AuthContext";
import { AppLayout } from "../layouts/AppLayout";

const nav = [
  { id: "home", label: "Home", icon: "home", path: "/end-user/home" },
  { id: "files", label: "Files", icon: "files", path: "/end-user/files" },
  { id: "calendar", label: "Calendar", icon: "calendar", path: "/end-user/calendar" },
  { id: "notifications", label: "Notifications", icon: "notifications", path: "/end-user/notifications" },
  { id: "settings", label: "Settings", icon: "settings", path: "/end-user/settings" }
];

export function EndUserApp({ data, user }) {
  const { page = "home" } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const appUser = { name: user.name, role: "End User", company: user.company };
  const unreadCount = data.notifications.filter((item) => item.unread).length;

  if (!nav.some((item) => item.id === page)) {
    return <Navigate to="/end-user/home" replace />;
  }

  return (
    <AppLayout appTitle="End User" user={appUser} nav={nav}>
      {page === "home" && (
        <>
          <section className="end-user-hero">
            <div className="end-user-identity">
              <div className="end-user-avatar">{user.name.slice(0, 1)}</div>
              <div>
                <span className="end-user-kicker">Secure employee workspace</span>
                <h1>Welcome, {user.name}</h1>
                <p>
                  Access assigned rooms, protected files, calendar reminders, and company updates from {user.company}.
                </p>
              </div>
            </div>
            <div className="end-user-hero-actions">
              <Button onClick={() => navigate("/end-user/files")}><FileText size={16} /> Browse files</Button>
              <Button variant="ghost" onClick={logout}><LogOut size={16} /> Logout</Button>
            </div>
          </section>

          <div className="end-user-access-card">
            <div>
              <LockKeyhole size={22} />
              <strong>Protected access</strong>
              <span>Your files are watermarked and limited to your permitted rooms only.</span>
            </div>
            <Badge tone="success">Active device</Badge>
          </div>

          <PageHeader title="Overview" subtitle="Your latest activity and allowed workspace" />
          <StatGrid items={data.analytics} />

          <div className="quick-actions">
            <QuickAction icon={<FileText size={18} />} label="Open files" value={`${data.files.length} protected items`} />
            <QuickAction icon={<Bell size={18} />} label="Notifications" value={`${unreadCount} unread`} />
            <QuickAction icon={<CalendarDays size={18} />} label="Calendar" value="Next meeting ready" />
            <QuickAction icon={<ShieldCheck size={18} />} label="Security" value="No download policy" />
          </div>

          <div className="grid two">
            <Card title="Assigned room">
              {data.rooms.slice(0, 1).map((room) => (
                <div className="room-row polished-room" key={room.id}>
                  <div className="room-icon" style={{ background: room.color }}><LockKeyhole size={18} /></div>
                  <div>
                    <strong>{room.name}</strong>
                    <span>{room.files} files · {room.type} · read only</span>
                  </div>
                  <Badge tone="success">{room.status}</Badge>
                </div>
              ))}
              <div className="room-note">
                <CheckCircle2 size={16} />
                <span>If you need another room, ask your company admin to invite you.</span>
              </div>
            </Card>

            <Card title="Latest notifications">
              {data.notifications.map((item) => (
                <div className="list-row polished-notification" key={item.id}>
                  <span className={item.unread ? "dot unread" : "dot"} />
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </>
      )}

      {page === "files" && (
        <>
          <PageHeader title="Files" subtitle="All files are protected with watermark and no-download policy">
            <Button><Eye size={16} /> Open viewer</Button>
          </PageHeader>
          <div className="end-user-access-card file-access">
            <div>
              <ShieldCheck size={22} />
              <strong>Viewer only</strong>
              <span>Backend should stream files securely. Download, print, and screen-record actions are shown as blocked states.</span>
            </div>
            <Badge tone="primary">Watermark ready</Badge>
          </div>
          <Card>
            <SmartTable
              rows={data.files}
              searchKeys={["name", "room", "type"]}
              filters={[
                { value: "PDF", label: "PDF", match: (row) => row.type === "PDF" },
                { value: "Video", label: "Video", match: (row) => row.type === "Video" }
              ]}
              columns={[
                { key: "name", label: "File" },
                { key: "type", label: "Type" },
                { key: "size", label: "Size" },
                { key: "date", label: "Date" },
                { key: "protected", label: "Protection", render: () => <Badge tone="danger">No download</Badge> }
              ]}
            />
          </Card>
          <Card title="Protected viewer">
            <div className="viewer">
              <div className="watermark">{user.name} · 01012345678</div>
              <ShieldCheck size={42} />
              <strong>Secure PDF / Video viewer</strong>
              <span>Backend should provide secure stream URLs, signed URLs, and watermark metadata.</span>
              <Button variant="ghost"><Play size={16} /> Preview</Button>
            </div>
          </Card>
        </>
      )}

      {page === "calendar" && (
        <SimplePanel
          title="Calendar"
          rows={["Sales Q3 Planning - tomorrow 2:00 PM", "New employee training - 20 June", "Q2 payroll review - 18 June"]}
        />
      )}

      {page === "notifications" && (
        <SimplePanel title="Notifications" rows={data.notifications.map((item) => `${item.title} - ${item.time}`)} />
      )}

      {page === "settings" && (
        <>
          <PageHeader title="Account settings" subtitle="Your employee profile and security preferences" />
          <div className="grid two">
            <Card title="Profile">
              <div className="profile-summary">
                <div className="end-user-avatar small">{user.name.slice(0, 1)}</div>
                <div>
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                  <span>{user.company}</span>
                </div>
              </div>
            </Card>
            <Card title="Access">
              {["File notifications", "Calendar reminders", "Change password", "Linked device"].map((row) => (
                <div className="settings-row" key={row}>
                  <UserRound size={16} />
                  <strong>{row}</strong>
                  <Badge tone="neutral">Ready</Badge>
                </div>
              ))}
            </Card>
          </div>
        </>
      )}
    </AppLayout>
  );
}

function QuickAction({ icon, label, value }) {
  return (
    <Card className="quick-action-card">
      <div className="quick-action-icon">{icon}</div>
      <strong>{label}</strong>
      <span>{value}</span>
    </Card>
  );
}

function SimplePanel({ title, rows }) {
  return (
    <>
      <PageHeader title={title} />
      <Card>
        {rows.map((row) => (
          <div className="list-row polished-notification" key={row}>
            <span className="dot unread" />
            <strong>{row}</strong>
          </div>
        ))}
      </Card>
    </>
  );
}
