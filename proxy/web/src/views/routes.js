// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
// core components/views for AdminPage layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import AdminUsersPage from "views/AdminUsersPage.js";
import AdminReportsPage from "views/AdminReportsPage.js";

// core components/views for RTL layout

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "대시보드",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "사용자 정보",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Person,
    component: AdminUsersPage,
    layout: "/admin"
  },
  {
    path: "/reports",
    name: "신고내역",
    rtlName: "قائمة الجدول",
    icon: "content_paste",
    component: AdminReportsPage,
    layout: "/admin"
  }
];

export default dashboardRoutes;
