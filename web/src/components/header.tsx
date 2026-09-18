"use client";

import React, { useState, useEffect } from "react";
import { Logo } from "@/components/logo";
import { DesktopNav } from "@/components/desktop-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeIconStack } from "@/components/transitions/TransitionsKit";
import { GithubIcon } from "@/components/icons/github-icon";
import { QrCodeIcon, StarIcon } from "lucide-react";

export interface HeaderProps {
	isDark: boolean;
	onToggleTheme: () => void;
	onOpenQR?: () => void;
	onOpenTextShare?: () => void;
	onOpenDrawer?: () => void;
}

export function Header({
	isDark,
	onToggleTheme,
	onOpenQR,
	onOpenTextShare,
	onOpenDrawer,
}: HeaderProps) {
	const [starCount, setStarCount] = useState<number | null>(null);

	useEffect(() => {
		let isMounted = true;
		fetch("https://api.github.com/repos/Fixotix/LocalReceive")
			.then((res) => {
				if (!res.ok) throw new Error(`HTTP error ${res.status}`);
				return res.json();
			})
			.then((data) => {
				if (isMounted && typeof data.stargazers_count === "number") {
					setStarCount(data.stargazers_count);
				}
			})
			.catch((err) => {
				console.debug("GitHub star count fetch failed:", err);
			});

		return () => {
			isMounted = false;
		};
	}, []);
	return (
		<div className="sticky top-[max(0.75rem,env(safe-area-inset-top,0.75rem))] sm:top-5 z-50 w-full px-3.5 sm:px-6 pointer-events-none">
			<header
				className={`pointer-events-auto max-w-5xl mx-auto rounded-2xl border px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between transition-all backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)] ${
					isDark
						? "bg-[#111218]/85 border-white/[0.1] text-white"
						: "bg-white/90 border-black/[0.08] text-zinc-900"
				}`}
			>
				{/* Left: Clean Brand Logo */}
				<div className="flex items-center">
					<a href="#" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
						<Logo />
					</a>
				</div>

				{/* Center: Clean Nav Links (Centered exact match to efferd screenshot) */}
				<div className="hidden md:flex items-center justify-center">
					<DesktopNav />
				</div>

				{/* Right: Actions */}
				<div className="flex items-center gap-2 sm:gap-2.5">
					{onOpenQR && (
						<button
							onClick={onOpenQR}
							className={`p-2 rounded-xl transition-colors ${
								isDark
									? "text-zinc-400 hover:text-white hover:bg-white/10"
									: "text-zinc-600 hover:text-black hover:bg-black/5"
							}`}
							title="Connect Phone (QR)"
						>
							<QrCodeIcon className="size-4" />
						</button>
					)}

					<ThemeIconStack isDark={isDark} onClick={onToggleTheme} />

					{/* GitHub Repo with Live Stars */}
					<a
						href="https://github.com/Fixotix/LocalReceive"
						target="_blank"
						rel="noopener noreferrer"
						className={`inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-xl text-xs font-semibold border transition-all active:scale-95 group ${
							isDark
								? "bg-white/[0.06] border-white/10 text-zinc-200 hover:bg-white/12 hover:text-white"
								: "bg-black/[0.04] border-black/10 text-zinc-700 hover:bg-black/8 hover:text-black"
						}`}
						title="Star LocalReceive on GitHub"
					>
						<GithubIcon className="size-3.5 fill-current group-hover:scale-110 transition-transform" />
						<span className="hidden sm:inline font-medium">GitHub</span>
						<span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-accent/20 text-accent font-mono text-[11px] font-bold">
							<StarIcon className="size-3 fill-accent text-accent" />
							<span>{starCount !== null ? starCount.toLocaleString() : "0"}</span>
						</span>
					</a>

					<a
						href="https://razorpay.me/@prepsnap"
						target="_blank"
						rel="noopener noreferrer"
						className={`hidden sm:inline-flex items-center justify-center h-8 px-4 rounded-xl text-xs font-bold transition-all active:scale-95 ${
							isDark
								? "bg-accent text-black hover:bg-accent/90 shadow-[0_2px_12px_rgba(229,169,60,0.25)]"
								: "bg-zinc-950 text-white hover:bg-zinc-800 shadow-xs"
						}`}
					>
						Donate ↗
					</a>

					{/* Mobile Menu Icon for Small Screens */}
					<div className="md:hidden">
						<MobileNav
							onOpenQR={onOpenQR}
							onOpenTextShare={onOpenTextShare}
							onOpenDrawer={onOpenDrawer}
						/>
					</div>
				</div>
			</header>
		</div>
	);
}


