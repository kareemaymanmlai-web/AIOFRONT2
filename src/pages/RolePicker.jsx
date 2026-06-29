import { ArrowLeft } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

export function RolePicker({ roles, onSelect }) {
  return (
    <main className="role-page">
      <section className="role-hero">
        <div>
          <p className="eyebrow">AIOFRONT</p>
          <h1>واجهات Sub Pay جاهزة كتطبيق React منظم</h1>
          <p>
            اختار نوع الحساب لتجربة الواجهة. البيانات الحالية mock، والربط الحقيقي يتم من `src/services/api.js`.
          </p>
        </div>
      </section>
      <section className="role-grid">
        {roles.map((role) => (
          <Card key={role.id}>
            <div className="role-card">
              <div>
                <h2>{role.label}</h2>
                <p>{role.subtitle}</p>
                <span>{role.company}</span>
              </div>
              <Button onClick={() => onSelect(role.id)}>
                فتح الواجهة
                <ArrowLeft size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </section>
    </main>
  );
}
