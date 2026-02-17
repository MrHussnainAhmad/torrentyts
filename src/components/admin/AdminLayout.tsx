import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    PlusCircle,
    Library,
    Settings,
    LogOut,
    Menu,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";


const sidebarItems = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "All Media",
        href: "/admin/media",
        icon: Library,
    },
    {
        title: "Add Media",
        href: "/admin/media/new",
        icon: PlusCircle,
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-dark-bg border-r border-dark-border transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="h-16 flex items-center justify-center border-b border-dark-border">
                    <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                        Admin Panel
                    </span>
                </div>

                <nav className="p-4 space-y-2">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = router.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                    isActive
                                        ? "bg-primary-500/10 text-primary-400"
                                        : "text-slate-400 hover:bg-dark-surface hover:text-white"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-4 left-4 right-4">
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center w-full gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="h-16 flex items-center px-4 border-b border-dark-border bg-dark-bg md:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-slate-400 hover:text-white"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
