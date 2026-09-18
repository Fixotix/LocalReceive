import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "@/components/ui/button";
import { Portal, PortalBackdrop } from "@/components/portal";
import { productLinks, platformLinks, resourceLinks } from "@/components/nav-links";
import { LinkItem } from "@/components/sheard";
import { XIcon, MenuIcon, QrCodeIcon, MessageSquareIcon, HistoryIcon, HeartIcon, DownloadIcon, StarIcon } from "lucide-react";
import { GithubIcon } from "@/components/icons/github-icon";
import { SpringToggle } from "@/components/SpringToggle";

interface MobileNavProps {
	autoAccept?: boolean;
	onToggleAutoAccept?: () => void;
	onOpenQR?: () => void;
	onOpenTextShare?: () => void;
	onOpenDrawer?: () => void;
}

export function MobileNav({
	autoAccept = false,
	onToggleAutoAccept,
	onOpenQR,
	onOpenTextShare,
	onOpenDrawer,
}: MobileNavProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<div className="md:hidden flex items-center gap-2">
			{onOpenQR && (
				<Button
					size="icon"
					variant="outline"
					className="h-9 w-9 border-accent/40 bg-accent/10 text-accent"
					onClick={onOpenQR}
					title="Scan QR"
				>
					<QrCodeIcon className="size-4" />
				</Button>
			)}

			<Button
				aria-controls="mobile-menu"
				aria-expanded={open}
				aria-label="Toggle menu"
				className="h-9 w-9"
				onClick={() => setOpen(!open)}
				size="icon"
				variant="outline"
			>
				<div
					className={cn(
						"transition-all",
						open ? "scale-100 opacity-100" : "scale-0 opacity-0"
					)}
				>
					<XIcon className="size-4" />
				</div>
				<div
					className={cn(
						"absolute transition-all",
						open ? "scale-0 opacity-0" : "scale-100 opacity-100"
					)}
				>
					<MenuIcon className="size-4" />
				</div>
			</Button>

			{open && (
				<Portal className="top-14">
					<PortalBackdrop onClick={() => setOpen(false)} />
					<div
						className={cn(
							"size-full overflow-y-auto p-4 bg-background/95 backdrop-blur-md border-b border-border space-y-5",
							"data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in"
						)}
						data-slot={open ? "open" : "closed"}
					>
						{/* Quick Action Tools */}
						<div className="rounded-xl border border-border bg-card p-3 space-y-3">
							<span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
								Quick Actions
							</span>

							{onToggleAutoAccept && (
								<div className="flex items-center justify-between py-1">
									<div className="flex flex-col">
										<span className="text-sm font-semibold">Direct Auto-Receive</span>
										<span className="text-xs text-muted-foreground">Receive files with zero prompts</span>
									</div>
									<SpringToggle
										checked={autoAccept}
										onChange={onToggleAutoAccept}
										ariaLabel="Auto Receive"
									/>
								</div>
							)}

							<div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40">
								{onOpenQR && (
									<button
										onClick={() => {
											setOpen(false);
											onOpenQR();
										}}
										className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-muted/60 hover:bg-muted text-xs font-medium gap-1.5"
									>
										<QrCodeIcon className="size-4 text-accent" />
										<span>Pair QR</span>
									</button>
								)}
								{onOpenTextShare && (
									<button
										onClick={() => {
											setOpen(false);
											onOpenTextShare();
										}}
										className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-muted/60 hover:bg-muted text-xs font-medium gap-1.5"
									>
										<MessageSquareIcon className="size-4 text-purple-400" />
										<span>Text Share</span>
									</button>
								)}
								{onOpenDrawer && (
									<button
										onClick={() => {
											setOpen(false);
											onOpenDrawer();
										}}
										className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-muted/60 hover:bg-muted text-xs font-medium gap-1.5"
									>
										<HistoryIcon className="size-4 text-emerald-400" />
										<span>Transfers</span>
									</button>
								)}
							</div>
						</div>

						{/* Purposeful Links */}
						<div className="flex w-full flex-col gap-y-2">
							<span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
								Features
							</span>
							{productLinks.map((link) => (
								<LinkItem
									className="rounded-lg p-2 hover:bg-muted"
									key={`prod-${link.label}`}
									onClick={() => setOpen(false)}
									{...link}
								/>
							))}

							<span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider pt-2">
								Platforms
							</span>
							{platformLinks.map((link) => (
								<LinkItem
									className="rounded-lg p-2 hover:bg-muted"
									key={`plat-${link.label}`}
									onClick={() => setOpen(false)}
									{...link}
								/>
							))}
						</div>

						{/* Primary Action Buttons */}
						<div className="pt-2 flex flex-col gap-2">

							<a
								href="https://github.com/Fixotix/LocalReceive"
								target="_blank"
								rel="noopener noreferrer"
								className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-border bg-card hover:bg-muted font-bold text-xs"
							>
								<GithubIcon className="size-4 fill-current" />
								<span>Star on GitHub (Fixotix/LocalReceive)</span>
							</a>

							<a
								href="https://razorpay.me/@prepsnap"
								target="_blank"
								rel="noopener noreferrer"
								className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-accent/40 bg-accent/10 text-accent font-bold text-xs"
							>
								<HeartIcon className="size-4 text-rose-400 fill-rose-400" />
								<span>Donate for Grow (Razorpay) ↗</span>
							</a>
						</div>
					</div>
				</Portal>
			)}
		</div>
	);
}

