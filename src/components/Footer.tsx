const Footer = () => {
    return (
        <footer className="sticky bottom-0 z-40 bg-dark border-t border-primary/30 py-2 px-4 text-center text-xs text-gray-400">
            <div className="container mx-auto flex justify-between items-center">
                <span>© {new Date().getFullYear()} AgroTech Dashboard</span>
                <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Sistema en línea</span>
                </div>
            </div>
        </footer>
    )
}

export default Footer

