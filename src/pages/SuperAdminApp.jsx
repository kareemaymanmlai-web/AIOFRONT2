import { Download, Plus } from "lucide-react";
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
  { id: "dashboard", label: "Dashboard", icon: "dashboard", path: "/super-admin/dashboard" },
  { id: "tenants", label: "Tenants", icon: "rooms", path: "/super-admin/tenants" },
  { id: "revenue", label: "Revenue", icon: "analytics", path: "/super-admin/revenue" },
  { id: "subscriptions", label: "Subscriptions", icon: "subscription", path: "/super-admin/subscriptions" },
  { id: "pricing", label: "Pricing", icon: "settings", path: "/super-admin/pricing" },
  { id: "activity", label: "Activity", icon: "locked", path: "/super-admin/activity" }
];

export function SuperAdminApp({ data, user }) {
  const { page = "dashboard" } = useParams();
  const appUser = { name: user.name, role: "Super Admin", company: user.company };

  if (!nav.some((item) => item.id === page)) {
    return <Navigate to="/super-admin/dashboard" replace />;
  }

  return (
    <AppLayout appTitle="Super Admin" user={appUser} nav={nav}>
      {page === "dashboard" && <Dashboard data={data} />}
      {page === "tenants" && <TenantsPage tenants={data.tenants} />}
      {page === "revenue" && <Report title="Revenue" lines={["Monthly revenue: 18,400 EGP", "Growth: 9,600 EGP", "Pro: 5,000 EGP", "Starter: 3,800 EGP"]} />}
      {page === "subscriptions" && <SubscriptionsPage tenants={data.tenants} />}
      {page === "pricing" && <Pricing />}
      {page === "activity" && <Report title="Activity" lines={["TechCorp renewed subscription", "Elite Academy changed plan", "Language Institute needs renewal"]} />}
    </AppLayout>
  );
}

function Dashboard({ data }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <PageHeader title="Platform dashboard" subtitle="Manage customers, revenue, and subscriptions">
        <Button onClick={() => setOpen(true)}><Plus size={16} /> New tenant</Button>
      </PageHeader>
      <StatGrid items={data.analytics} />
      <div className="grid two">
        <TenantsTable tenants={data.tenants.slice(0, 4)} />
        <Card title="Important alerts">
          {["5 tenants expire within 7 days", "3 failed payment attempts", "New tenant needs review"].map((item) => (
            <div className="list-row" key={item}><span className="dot unread" /><strong>{item}</strong></div>
          ))}
        </Card>
      </div>
      <CreateTenantModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function TenantsPage({ tenants }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <PageHeader title="Tenants" subtitle="Companies and academies">
        <Button onClick={() => setOpen(true)}><Plus size={16} /> New tenant</Button>
      </PageHeader>
      <TenantsTable tenants={tenants} />
      <CreateTenantModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function SubscriptionsPage({ tenants }) {
  return (
    <>
      <PageHeader title="Subscriptions" subtitle="Renewals and expiration tracking">
        <Button variant="ghost"><Download size={16} /> Export CSV</Button>
      </PageHeader>
      <TenantsTable tenants={tenants} />
    </>
  );
}

function TenantsTable({ tenants }) {
  return (
    <Card title="Tenants">
      <SmartTable
        rows={tenants}
        searchKeys={["name", "plan", "status"]}
        filters={[
          { value: "Growth", label: "Growth", match: (row) => row.plan === "Growth" },
          { value: "Pro", label: "Pro", match: (row) => row.plan === "Pro" },
          { value: "expiring", label: "Expiring", match: (row) => row.status === "ينتهي قريب" }
        ]}
        columns={[
          { key: "name", label: "Tenant" },
          { key: "plan", label: "Plan" },
          { key: "users", label: "Users" },
          { key: "files", label: "Files" },
          { key: "revenue", label: "Revenue" },
          { key: "expiresAt", label: "Expires" },
          { key: "status", label: "Status", badge: (row) => row.status === "نشط" ? "success" : "warning" }
        ]}
      />
    </Card>
  );
}

function CreateTenantModal({ open, onClose }) {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", adminEmail: "", plan: "Growth" });

  const submit = async (event) => {
    event.preventDefault();
    await api.createTenant(form);
    showToast("Tenant creation payload is ready for backend");
    onClose();
  };

  return (
    <Modal title="Create tenant" open={open} onClose={onClose} footer={<Button form="create-tenant-form">Create</Button>}>
      <form id="create-tenant-form" className="form-grid" onSubmit={submit}>
        <FormField label="Tenant name"><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></FormField>
        <FormField label="Admin email"><input type="email" required value={form.adminEmail} onChange={(event) => setForm({ ...form, adminEmail: event.target.value })} /></FormField>
        <FormField label="Plan">
          <select value={form.plan} onChange={(event) => setForm({ ...form, plan: event.target.value })}>
            <option>Starter</option>
            <option>Growth</option>
            <option>Pro</option>
          </select>
        </FormField>
      </form>
    </Modal>
  );
}

function Pricing() {
  const plans = [
    ["Starter", "500", "One room · 100 users · PDF + video"],
    ["Growth", "1,200", "10 rooms · 500 users · Analytics"],
    ["Pro", "2,500", "Unlimited · White Label · Payments"]
  ];

  return (
    <>
      <PageHeader title="Pricing" />
      <div className="cards-grid">
        {plans.map(([name, price, features]) => (
          <Card key={name}>
            <div className="plan-card">
              <Badge tone={name === "Growth" ? "primary" : "neutral"}>{name}</Badge>
              <strong>{price} EGP / month</strong>
              <p>{features}</p>
              <Button variant={name === "Growth" ? "primary" : "ghost"}>Edit plan</Button>
            </div>
          </Card>
        ))}
      </div>
    </>
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
