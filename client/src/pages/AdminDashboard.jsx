import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-neutral-900/50 p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
