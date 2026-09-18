export function DesktopNav() {
	return (
		<nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
			<a href="#quickstart" className="hover:text-foreground transition-colors">
				Quick Start
			</a>
			<a href="#how-it-works" className="hover:text-foreground transition-colors">
				How It Works
			</a>
			<a href="#features" className="hover:text-foreground transition-colors">
				Features
			</a>
			<a
				href="https://github.com/Fixotix/LocalReceive"
				target="_blank"
				rel="noopener noreferrer"
				className="hover:text-foreground transition-colors"
			>
				GitHub
			</a>
			<a href="#faq" className="hover:text-foreground transition-colors">
				FAQ
			</a>
		</nav>
	);
}


