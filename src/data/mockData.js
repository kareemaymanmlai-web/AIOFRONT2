export const roles = [
  { id: "end-user", label: "End User", subtitle: "موظف داخل شركة", company: "TechCorp Egypt" },
  { id: "tenant-admin", label: "Tenant Admin", subtitle: "مسؤول شركة", company: "TechCorp Egypt" },
  { id: "super-admin", label: "Super Admin", subtitle: "إدارة المنصة", company: "Sub Pay Platform" }
];

export const rooms = [
  { id: 1, name: "HR & السياسات", type: "قراءة فقط", members: 12, files: 18, status: "نشطة", color: "#4F46E5" },
  { id: 2, name: "Sales Team", type: "رفع + قراءة", members: 8, files: 34, status: "نشطة", color: "#06B6D4" },
  { id: 3, name: "Engineering", type: "رفع + قراءة", members: 6, files: 56, status: "نشطة", color: "#F59E0B" },
  { id: 4, name: "Finance - سري", type: "قراءة فقط", members: 4, files: 29, status: "خاص", color: "#10B981" }
];

export const files = [
  { id: 1, name: "سياسة الحضور والانصراف 2025.pdf", room: "HR & السياسات", type: "PDF", size: "2.4 MB", views: 12, protected: true, date: "10 يونيو 2025" },
  { id: 2, name: "هيكل الرواتب Q2 2025.xlsx", room: "Finance - سري", type: "Excel", size: "1.1 MB", views: 4, protected: true, date: "5 يونيو 2025" },
  { id: 3, name: "نماذج عقود التوظيف.docx", room: "HR & السياسات", type: "Word", size: "856 KB", views: 12, protected: true, date: "1 يونيو 2025" },
  { id: 4, name: "تدريب الموظفين الجدد.mp4", room: "HR & السياسات", type: "Video", size: "245 MB", views: 6, protected: true, date: "28 مايو 2025" }
];

export const members = [
  { id: 1, name: "محمد أحمد علي", email: "m.ali@techcorp.eg", role: "موظف", room: "HR & السياسات", status: "نشط", expiresAt: "3 يوليو 2025" },
  { id: 2, name: "سارة محمود", email: "s.mahmoud@techcorp.eg", role: "موظف", room: "Sales Team", status: "نشط", expiresAt: "15 يوليو 2025" },
  { id: 3, name: "نور إبراهيم", email: "n.ibrahim@techcorp.eg", role: "موظف", room: "HR & السياسات", status: "مراجعة", expiresAt: "17 يونيو 2025" },
  { id: 4, name: "خالد سمير", email: "k.samir@techcorp.eg", role: "موظف", room: "Engineering", status: "غير نشط", expiresAt: "19 يونيو 2025" }
];

export const tenants = [
  { id: 1, name: "TechCorp Egypt", plan: "Growth", users: 48, rooms: 5, files: 142, revenue: "1,200", status: "نشط", expiresAt: "3 يوليو 2025" },
  { id: 2, name: "أكاديمية النخبة", plan: "Pro", users: 120, rooms: 3, files: 89, revenue: "2,500", status: "نشط", expiresAt: "15 يوليو 2025" },
  { id: 3, name: "معهد اللغات", plan: "Starter", users: 200, rooms: 2, files: 34, revenue: "500", status: "ينتهي قريب", expiresAt: "17 يونيو 2025" },
  { id: 4, name: "Smart Finance", plan: "Growth", users: 31, rooms: 4, files: 57, revenue: "1,200", status: "نشط", expiresAt: "22 يوليو 2025" }
];

export const notifications = [
  { id: 1, title: "ملف جديد: سياسة الحضور 2025", body: "تم إضافة ملف جديد في روم HR & السياسات", unread: true, time: "منذ 30 دقيقة" },
  { id: 2, title: "تذكير: اجتماع غداً", body: "اجتماع Sales Q3 Planning الساعة 2:00 مساءً", unread: true, time: "منذ ساعة" },
  { id: 3, title: "محاولة دخول من جهاز مختلف", body: "نور إبراهيم حاولت الدخول من جهاز جديد", unread: true, time: "منذ 3 ساعات" }
];

export const analytics = {
  platform: [
    { label: "Tenants", value: 14, tone: "primary" },
    { label: "Monthly Revenue", value: "18.4K", tone: "success" },
    { label: "Expiring Soon", value: 5, tone: "warning" },
    { label: "Security Alerts", value: 3, tone: "danger" }
  ],
  tenant: [
    { label: "الموظفين", value: 48, tone: "primary" },
    { label: "الرومات", value: 5, tone: "info" },
    { label: "الملفات", value: 142, tone: "success" },
    { label: "تنتهي قريب", value: 2, tone: "warning" }
  ],
  endUser: [
    { label: "الرومات المتاحة", value: 1, tone: "primary" },
    { label: "ملفات مقروءة", value: 7, tone: "success" },
    { label: "إشعارات جديدة", value: 3, tone: "warning" }
  ]
};
