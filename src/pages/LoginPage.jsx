import { LogIn } from "lucide-react";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { FormField } from "../components/FormField";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export function LoginPage() {
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRole = new URLSearchParams(location.search).get("role") || "tenant-admin";
  const [form, setForm] = useState({ email: "admin@subpay.test", password: "12345678", role: selectedRole });
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={location.state?.from || `/${user.role}`} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const nextUser = await login(form);
      showToast("تم تسجيل الدخول بنجاح");
      navigate(location.state?.from || `/${nextUser.role}`, { replace: true });
    } catch (error) {
      showToast(error.message || "فشل تسجيل الدخول", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <Card className="login-card">
        <div className="login-brand">
          <div className="brand-mark">AI</div>
          <div>
            <h1>AIOFRONT</h1>
            <p>تسجيل دخول جاهز للربط مع backend auth endpoint.</p>
          </div>
        </div>
        <form className="form-grid" onSubmit={submit}>
          <FormField label="نوع الحساب">
            <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
              <option value="end-user">End User</option>
              <option value="tenant-admin">Tenant Admin</option>
              <option value="super-admin">Super Admin</option>
            </select>
          </FormField>
          <FormField label="البريد الإلكتروني">
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </FormField>
          <FormField label="كلمة المرور">
            <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} minLength={6} required />
          </FormField>
          <Button className="full-width" disabled={loading}>
            <LogIn size={16} />
            {loading ? "جاري الدخول..." : "دخول"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
