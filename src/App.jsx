import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Loading } from "./components/Loading";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import { EndUserApp } from "./pages/EndUserApp";
import { LoginPage } from "./pages/LoginPage";
import { RolePicker } from "./pages/RolePicker";
import { SuperAdminApp } from "./pages/SuperAdminApp";
import { TenantAdminApp } from "./pages/TenantAdminApp";
import { api } from "./services/api";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<LandingRedirect />} />
      <Route element={<ProtectedRoute allowedRoles={["end-user"]} />}>
        <Route path="/end-user" element={<Navigate to="/end-user/home" replace />} />
        <Route path="/end-user/:page" element={<DataGate app="endUser" />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["tenant-admin"]} />}>
        <Route path="/tenant-admin" element={<Navigate to="/tenant-admin/dashboard" replace />} />
        <Route path="/tenant-admin/:page" element={<DataGate app="tenant" />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["super-admin"]} />}>
        <Route path="/super-admin" element={<Navigate to="/super-admin/dashboard" replace />} />
        <Route path="/super-admin/:page" element={<DataGate app="platform" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function LandingRedirect() {
  const { user } = useAuth();
  if (user) return <Navigate to={`/${user.role}`} replace />;
  return <RolePicker roles={[
    { id: "end-user", label: "End User", subtitle: "Employee account", company: "TechCorp Egypt" },
    { id: "tenant-admin", label: "Tenant Admin", subtitle: "Company admin", company: "TechCorp Egypt" },
    { id: "super-admin", label: "Super Admin", subtitle: "Platform admin", company: "Sub Pay Platform" }
  ]} onSelect={(role) => window.location.assign(`/login?role=${role}`)} />;
}

function DataGate({ app }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.getRooms(),
      api.getFiles(),
      api.getMembers(),
      api.getTenants(),
      api.getNotifications(),
      api.getAnalytics("endUser"),
      api.getAnalytics("tenant"),
      api.getAnalytics("platform")
    ]).then(([rooms, files, members, tenants, notifications, endAnalytics, tenantAnalytics, platformAnalytics]) => {
      if (!mounted) return;
      setData({ rooms, files, members, tenants, notifications, endAnalytics, tenantAnalytics, platformAnalytics });
    });
    return () => {
      mounted = false;
    };
  }, []);

  const appData = useMemo(() => {
    if (!data) return null;
    return {
      endUser: { rooms: data.rooms, files: data.files, notifications: data.notifications, analytics: data.endAnalytics },
      tenant: { rooms: data.rooms, files: data.files, members: data.members, notifications: data.notifications, analytics: data.tenantAnalytics },
      platform: { tenants: data.tenants, analytics: data.platformAnalytics }
    };
  }, [data]);

  if (!appData) return <Loading />;
  if (app === "endUser") return <EndUserApp data={appData.endUser} user={user} />;
  if (app === "tenant") return <TenantAdminApp data={appData.tenant} user={user} />;
  return <SuperAdminApp data={appData.platform} user={user} />;
}
