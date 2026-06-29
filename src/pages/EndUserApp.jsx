import { Eye, LogOut, Play, ShieldCheck } from "lucide-react";
import { Navigate, useParams } from "react-router-dom";
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
  const { logout } = useAuth();
  const appUser = { name: user.name, role: "End User", company: user.company };

  if (!nav.some((item) => item.id === page)) {
    return <Navigate to="/end-user/home" replace />;
  }

  return (
    <AppLayout appTitle="End User" user={appUser} nav={nav}>
      {page === "home" && (
        <>
          <PageHeader title={`Welcome, ${user.name}`} subtitle="You can access HR & policies room only">
            <Button variant="ghost" onClick={logout}><LogOut size={16} /> Logout</Button>
          </PageHeader>
          <StatGrid items={data.analytics} />
          <div className="grid two">
            <Card title="My room">
              {data.rooms.slice(0, 1).map((room) => (
                <div className="room-row" key={room.id}>
                  <div className="room-icon" style={{ background: room.color }}>HR</div>
                  <div>
                    <strong>{room.name}</strong>
                    <span>{room.files} files · {room.type}</span>
                  </div>
                  <Badge tone="success">{room.status}</Badge>
                </div>
              ))}
            </Card>
            <Card title="Latest notifications">
              {data.notifications.map((item) => (
                <div className="list-row" key={item.id}>
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
              <strong>PDF / Video viewer placeholder</strong>
              <span>Backend should provide secure stream URLs, signed URLs, and watermark metadata.</span>
              <Button variant="ghost"><Play size={16} /> Preview</Button>
            </div>
          </Card>
        </>
      )}

      {page === "calendar" && <SimplePanel title="Calendar" rows={["Sales Q3 Planning - tomorrow 2:00 PM", "New employee training - 20 June", "Q2 payroll review - 18 June"]} />}
      {page === "notifications" && <SimplePanel title="Notifications" rows={data.notifications.map((item) => `${item.title} - ${item.time}`)} />}
      {page === "settings" && <SimplePanel title="Settings" rows={["File notifications", "Calendar reminders", "Change password", "Linked device"]} />}
    </AppLayout>
  );
}

function SimplePanel({ title, rows }) {
  return (
    <>
      <PageHeader title={title} />
      <Card>
        {rows.map((row) => <div className="list-row" key={row}><span className="dot unread" /><strong>{row}</strong></div>)}
      </Card>
    </>
  );
}
