"use client"

import { Bell, Menu, LogOut } from "lucide-react"

interface HeaderProps {
    toggleSidebar: () => void
    onLogout: () => void
}

const Header = ({ toggleSidebar, onLogout }: HeaderProps) => {
    return (
        <header className="sticky top-0 z-50 bg-dark border-b border-primary/30 shadow-md">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button className="p-1 rounded-full hover:bg-primary/20 transition-colors" onClick={toggleSidebar}>
                            <Menu className="h-6 w-6 text-primary" />
                        </button>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            AgroTech Dashboard
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="p-1 rounded-full hover:bg-primary/20 transition-colors relative">

                        </button>

                        <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-primary/30 flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">A</span>
                            </div>
                            <span className="hidden md:inline-block text-sm font-medium">Admin</span>
                        </div>

                        <button
                            onClick={onLogout}
                            className="p-1 rounded-full hover:bg-primary/20 transition-colors"
                            title="Cerrar sesión"
                        >
                            <LogOut className="h-5 w-5 text-primary" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header

