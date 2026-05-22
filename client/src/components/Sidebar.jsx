import { NavLink, useParams } from "react-router-dom";
import { Utensils, LayoutDashboard, Settings, LogOut, Table as TableIcon } from "lucide-react";

export default function Sidebar() {
  const { adminId } = useParams();

  const links = [
    { to: `/admin/${adminId}/menu`, icon: Utensils, label: "Menu Management" },
    { to: `/admin/${adminId}/tables`, icon: TableIcon, label: "Tables" },
  ];

  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-amber-500 flex items-center gap-2">
          <Utensils className="w-6 h-6" />
          Cafe POS
        </h1>
        <p className="text-sm text-neutral-400 mt-1">Admin Portal</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-amber-500/10 text-amber-500 font-medium"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <button className="flex w-full items-center gap-3 px-4 py-3 text-neutral-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
