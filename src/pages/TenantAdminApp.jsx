import { Building2, CloudUpload, Plus, UserPlus } from "lucide-react";
import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { FormField } from "../components/FormField";
import { Modal } from "../components/Modal";
import { PageHeader } from "../components/PageHeader";
import { SmartTable } from "../components/SmartTable";
import { StatGrid } from "../components/StatGrid";
import { useToast } from "../contexts/ToastContext";
import { AppLayout } from "../layouts/AppLayout";
import { api } from "../services/api";

const nav = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", path: "/tenant-admin/dashboard" },
  { id: "rooms", label: "Rooms", icon: "rooms", path: "/tenant-admin/rooms" },
  { id: "files", label: "Files", icon: "files", path: "/tenant-admin/files" },
  { id: "members", label: "Members", icon: "members", path: "/tenant-admin/members" },
  { id: "analytics", label: "Analytics", icon: "analytics", path: "/tenant-admin/analytics" },
  { id: "security", label: "Security", icon: "security", path: "/tenant-admin/security" },
  { id: "Subscription", label: "Subscription", icon: "subscription", path: "/tenant-admin/subscription" }
];

export function TenantAdminApp({ data, user }) {
  const { page = "dashboard" } = useParams();
  const appUser = { name: user.name, role: "Tenant Admin", company: user.company };

  if (!nav.some((item) => item.id.toLowerCase() === page.toLowerCase())) {
    return <Navigate to="/tenant-admin/dashboard" replace />;
  }

  return (
    <AppLayout appTitle="Tenant Admin" user={appUser} nav={nav}>
      {page === "dashboard" && <Dashboard data={data} />}
      {page === "rooms" && <RoomsPage rooms={data.rooms} />}
      {page === "files" && <FilesPage files={data.files} />}
      {page === "members" && <MembersPage members={data.members} />}
      {page === "analytics" && <Report title="Analytics" lines={["File views: 1.2K", "Active today: 34", "Notification open rate: 82%"]} />}
      {page === "security" && <Report title="Security" lines={["One Device Policy enabled", "Watermark enabled", "3 security alerts this week"]} />}
      {page === "subscription" && <Report title="Subscription" lines={["Growth plan", "Ends on 3 July 2025", "5 / 10 rooms", "48 / 500 users"]} />}
    </AppLayout>
  );
}

function Dashboard({ data }) {
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <>
      <PageHeader title="Welcome, Ahmed" subtitle="TechCorp Egypt content and team management">
        <Button onClick={() => setInviteOpen(true)}><UserPlus size={16} /> Invite member</Button>
      </PageHeader>
      <StatGrid items={data.analytics} />
      <div className="grid two">
        <RoomCards rooms={data.rooms} />
        <Card title="Recent activity">
          {["Mohamed viewed attendance policy", "Sara joined Sales Team", "New-device login attempt", "New file uploaded"].map((item) => (
            <div className="list-row" key={item}><span className="dot unread" /><strong>{item}</strong></div>
          ))}
        </Card>
      </div>
      <InviteMemberModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </>
  );
}

function RoomsPage({ rooms }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <PageHeader title="Rooms" subtitle="Manage rooms and permissions">
        <Button onClick={() => setOpen(true)}><Plus size={16} /> New room</Button>
      </PageHeader>
      <RoomCards rooms={rooms} />
      <CreateRoomModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function FilesPage({ files }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <PageHeader title="Files" subtitle="Upload and manage protected content">
        <Button onClick={() => setOpen(true)}><CloudUpload size={16} /> Upload file</Button>
      </PageHeader>
      <Card>
        <SmartTable
          rows={files}
          searchKeys={["name", "room", "type"]}
          filters={[
            { value: "PDF", label: "PDF", match: (row) => row.type === "PDF" },
            { value: "Video", label: "Video", match: (row) => row.type === "Video" },
            { value: "Excel", label: "Excel", match: (row) => row.type === "Excel" }
          ]}
          columns={[
            { key: "name", label: "File" },
            { key: "room", label: "Room" },
            { key: "type", label: "Type" },
            { key: "views", label: "Views" },
            { key: "protected", label: "Protection", render: () => <Badge tone="danger">Protected</Badge> }
          ]}
        />
      </Card>
      <UploadFileModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function MembersPage({ members }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <PageHeader title="Members" subtitle="Invitations, subscriptions, and access">
        <Button onClick={() => setOpen(true)}><UserPlus size={16} /> Invite</Button>
      </PageHeader>
      <Card>
        <SmartTable
          rows={members}
          searchKeys={["name", "email", "room", "status"]}
          filters={[
            { value: "active", label: "Active", match: (row) => row.status === "نشط" },
            { value: "review", label: "Review", match: (row) => row.status === "مراجعة" }
          ]}
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "room", label: "Room" },
            { key: "expiresAt", label: "Expires" },
            { key: "status", label: "Status", badge: (row) => row.status === "نشط" ? "success" : row.status === "مراجعة" ? "warning" : "danger" }
          ]}
        />
      </Card>
      <InviteMemberModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function RoomCards({ rooms }) {
  return (
    <div className="cards-grid">
      {rooms.map((room) => (
        <Card key={room.id}>
          <div className="room-admin-card">
            <div className="room-icon" style={{ background: room.color }}><Building2 size={20} /></div>
            <div>
              <h3>{room.name}</h3>
              <p>{room.members} members · {room.files} files · {room.type}</p>
            </div>
            <Badge tone={room.status === "خاص" ? "warning" : "success"}>{room.status}</Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}

function CreateRoomModal({ open, onClose }) {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", type: "قراءة فقط" });

  const submit = async (event) => {
    event.preventDefault();
    await api.createRoom(form);
    showToast("Room creation request is ready for backend integration");
    onClose();
  };

  return (
    <Modal title="Create room" open={open} onClose={onClose} footer={<Button form="create-room-form">Save</Button>}>
      <form id="create-room-form" className="form-grid" onSubmit={submit}>
        <FormField label="Room name"><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></FormField>
        <FormField label="Permission">
          <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
            <option>قراءة فقط</option>
            <option>رفع + قراءة</option>
          </select>
        </FormField>
      </form>
    </Modal>
  );
}

function InviteMemberModal({ open, onClose }) {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", room: "HR & السياسات" });

  const submit = async (event) => {
    event.preventDefault();
    await api.inviteMember(form);
    showToast("Invitation endpoint payload is ready");
    onClose();
  };

  return (
    <Modal title="Invite member" open={open} onClose={onClose} footer={<Button form="invite-member-form">Send invite</Button>}>
      <form id="invite-member-form" className="form-grid" onSubmit={submit}>
        <FormField label="Name"><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></FormField>
        <FormField label="Email"><input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></FormField>
        <FormField label="Room"><input required value={form.room} onChange={(event) => setForm({ ...form, room: event.target.value })} /></FormField>
      </form>
    </Modal>
  );
}

function UploadFileModal({ open, onClose }) {
  const { showToast } = useToast();

  const submit = (event) => {
    event.preventDefault();
    showToast("File upload form is ready. Backend should return signed upload URL or storage key.");
    onClose();
  };

  return (
    <Modal title="Upload file" open={open} onClose={onClose} footer={<Button form="upload-file-form">Upload</Button>}>
      <form id="upload-file-form" className="form-grid" onSubmit={submit}>
        <FormField label="File"><input type="file" required /></FormField>
        <FormField label="Room"><input defaultValue="HR & السياسات" required /></FormField>
        <FormField label="Protection"><select defaultValue="watermark"><option value="watermark">Watermark + no download</option><option value="view">View only</option></select></FormField>
      </form>
    </Modal>
  );
}

function Report({ title, lines }) {
  return (
    <>
      <PageHeader title={title} />
      <Card>
        {lines.map((line) => <div className="list-row" key={line}><span className="dot unread" /><strong>{line}</strong></div>)}
      </Card>
    </>
  );
}
