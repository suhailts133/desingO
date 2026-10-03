import NotificationBell from "../../features/notification/components/NotificationBell";
import ThemeToggle from "../common/ToggleTheme";


export default function SidebarTopbar() {
  return (
    <header className="flex items-center justify-end gap-3 border-b border-surface-border bg-bg-raised px-6 py-3">
      <ThemeToggle />
      <NotificationBell />
    </header>
  );
}
