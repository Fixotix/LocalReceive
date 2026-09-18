import { GithubIcon } from "@/components/icons/github-icon";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon, HeartIcon } from "lucide-react";

const navLinks = [
	{ href: "#send", label: "Send Files" },
	{ href: "#devices", label: "Devices" },
	{ href: "https://github.com/Fixotix/LocalReceive", label: "GitHub (Open Source)", external: true },
	{ href: "https://razorpay.me/@prepsnap", label: "Donate", external: true },
	{ href: "#faq", label: "FAQ" },
];

export function Footer() {
	return (
		<footer className="w-full border-t border-border/70 bg-background/50 backdrop-blur-xs transition-colors pb-[max(2rem,env(safe-area-inset-bottom,2rem))]">
			<div className="mx-auto max-w-5xl px-4 md:px-6 py-8 flex flex-col gap-6">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						<Logo className="h-5" />
					</div>
					<div className="flex items-center gap-2">
						<Button asChild size="sm" variant="outline" className="h-8 text-xs gap-1.5 font-medium border-border">
							<a href="https://github.com/Fixotix/LocalReceive" target="_blank" rel="noopener noreferrer">
								<GithubIcon className="size-3.5 fill-current" />
								<span>GitHub</span>
							</a>
						</Button>
						<Button asChild size="sm" className="h-8 text-xs gap-1.5 font-bold bg-accent text-black hover:bg-accent/90 shadow-xs">
							<a href="https://razorpay.me/@prepsnap" target="_blank" rel="noopener noreferrer">
								<HeartIcon className="size-3.5 fill-black/20" />
								<span>Donate ↗</span>
							</a>
						</Button>
					</div>
				</div>

				<nav>
					<ul className="flex flex-wrap gap-4 font-medium text-muted-foreground text-sm md:gap-7">
						{navLinks.map((link) => (
							<li key={link.label}>
								<a
									className="hover:text-foreground transition-colors inline-flex items-center gap-1"
									href={link.href}
									target={link.external ? "_blank" : undefined}
									rel={link.external ? "noopener noreferrer" : undefined}
								>
									<span>{link.label}</span>
									{link.external && <ArrowUpRightIcon className="size-3" />}
								</a>
							</li>
						))}
					</ul>
				</nav>

				<div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/50 pt-5 text-muted-foreground text-xs">
					<p>&copy; {new Date().getFullYear()} LocalReceive — Fast, Air-Gapped LAN Peer-to-Peer AirDrop.</p>

					<p className="inline-flex items-center gap-1.5">
						<span className="inline-block size-1.5 rounded-full bg-emerald-500 animate-pulse" />
						<span>Direct Local Network Transfers • Zero Internet Bandwidth</span>
					</p>
				</div>
			</div>
		</footer>
	);
}
