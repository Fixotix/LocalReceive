import { cn } from "@/lib/utils";
import { DecorIcon } from "@/components/decor-icon";

type Integration = {
	name: string;
	platform: string;
	description: string;
	badge: string;
	iconSvg: React.ReactNode;
	decor?: React.ReactNode;
};

const data: Integration[] = [
	{
		name: "Android Mobile & Tablets",
		platform: "Android 10 - 15",
		description: "Lightweight native APK. Direct file picker, camera QR scanner, and background downloads.",
		badge: "Native APK",
		iconSvg: (
			<svg className="size-8 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
				<path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 0 0-.1521-.5676.416.416 0 0 0-.5676.1521l-2.0223 3.503C15.5902 8.4111 13.8533 8.125 12 8.125c-1.8535 0-3.5905.2861-5.1368.8247L4.8409 5.4467a.4161.4161 0 0 0-.5677-.1521.4157.4157 0 0 0-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.7979h24c-.3432-4.139-2.6889-7.6112-6.1185-9.4765" />
			</svg>
		),
		decor: <DecorIcon position="bottom-left" />,
	},
	{
		name: "Apple iPhone & iPad",
		platform: "iOS & iPadOS",
		description: "Zero install required. Opens in Safari via camera QR code with instant WebRTC P2P DataChannels.",
		badge: "Safari P2P",
		iconSvg: (
			<svg className="size-8 text-zinc-300" viewBox="0 0 24 24" fill="currentColor">
				<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.34c.64-.78 1.08-1.86.96-2.94-.93.04-2.06.62-2.73 1.4-.59.68-1.11 1.77-.97 2.83 1.04.08 2.1-.51 2.74-1.29" />
			</svg>
		),
		decor: <DecorIcon position="top-right" />,
	},
	{
		name: "Apple Mac & MacBook",
		platform: "macOS Sonoma & Sequoia",
		description: "Full wire-speed gigabit throughput up to 120+ MB/s. Drag-and-drop 50GB folders with zero lag.",
		badge: "120 MB/s",
		iconSvg: (
			<svg className="size-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
				<rect x="2" y="3" width="20" height="14" rx="2" />
				<line x1="8" y1="21" x2="16" y2="21" />
				<line x1="12" y1="17" x2="12" y2="21" />
			</svg>
		),
	},
	{
		name: "Windows PC & Surface",
		platform: "Windows 10 & 11",
		description: "Run directly in Chrome, Edge, or Firefox. Local host discovery automatically maps internal LAN IP.",
		badge: "Wire LAN",
		iconSvg: (
			<svg className="size-8 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
				<path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
			</svg>
		),
		decor: <DecorIcon position="bottom-right" />,
	},
	{
		name: "Linux Workstations",
		platform: "Ubuntu • Fedora • Arch",
		description: "Native streaming engine support. Zero dependencies, pure standard WebSocket and WebRTC stack.",
		badge: "POSIX",
		iconSvg: (
			<svg className="size-8 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
				<polyline points="4 17 10 11 4 5" />
				<line x1="12" y1="19" x2="20" y2="19" />
			</svg>
		),
	},
	{
		name: "WebRTC & Local Gigabit LAN",
		platform: "Air-Gapped Router",
		description: "100% peer-to-peer data transport. No cellular data used, no files uploaded to cloud storage.",
		badge: "0 KB Cloud",
		iconSvg: (
			<svg className="size-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
				<path d="M5 12.55a11 11 0 0 1 14.08 0" />
				<path d="M1.42 9a16 16 0 0 1 21.16 0" />
				<path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
				<line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
			</svg>
		),
		decor: <DecorIcon position="top-left" />,
	},
];

export function Integrations() {
	return (
		<div className="relative mx-auto max-w-5xl border">
			<div className="grid grid-cols-2 gap-px bg-border md:grid-cols-3">
				{data.map((item) => (
					<IntegrationCard integration={item} key={item.name}>
						{item.decor}
					</IntegrationCard>
				))}
			</div>
			<DecorIcon position="top-left" />
			<DecorIcon position="top-right" />
			<DecorIcon position="bottom-left" />
			<DecorIcon position="bottom-right" />
		</div>
	);
}

function IntegrationCard({
	integration,
	className,
	children,
	...props
}: React.ComponentProps<"div"> & {
	integration: Integration;
}) {
	return (
		<div
			className={cn(
				"relative flex flex-col items-start gap-4 bg-background p-4 text-start md:p-6 md:even:bg-background/75",
				className
			)}
			{...props}
		>
			<div className="flex items-center justify-between w-full">
				<div className="p-2 rounded-lg bg-zinc-900/60 border border-border/50">
					{integration.iconSvg}
				</div>
				<span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-border/60 bg-surface/80 text-accent font-bold">
					{integration.badge}
				</span>
			</div>
			<div className="space-y-1">
				<div className="flex items-center gap-2">
					<h3 className="font-semibold text-sm md:text-base">{integration.name}</h3>
				</div>
				<p className="text-[11px] font-mono text-zinc-500">{integration.platform}</p>
				<p className="text-muted-foreground text-xs leading-relaxed pt-1">
					{integration.description}
				</p>
			</div>
			{integration.decor}
			{children}
		</div>
	);
}
