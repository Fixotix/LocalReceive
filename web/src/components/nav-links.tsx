import type { LinkItemType } from "@/components/sheard";
import {
	WifiIcon,
	ZapIcon,
	ShieldCheckIcon,
	GaugeIcon,
	QrCodeIcon,
	ClipboardIcon,
	SmartphoneIcon,
	AppleIcon,
	MonitorIcon,
	HelpCircleIcon,
	HeartIcon,
	Code2Icon,
} from "lucide-react";

export const productLinks: LinkItemType[] = [
	{
		label: "Gigabit Wire-Speed",
		href: "#radar",
		description: "120+ MB/s raw LAN streaming with zero bottlenecks",
		icon: <GaugeIcon className="text-accent" />,
	},
	{
		label: "Air-Gapped Privacy",
		href: "#radar",
		description: "100% local subnet. Zero cloud relays or telemetry",
		icon: <ShieldCheckIcon className="text-emerald-400" />,
	},
	{
		label: "Direct Auto-Receive",
		href: "#radar",
		description: "Receive files in background without manual prompts",
		icon: <ZapIcon className="text-amber-400" />,
	},
	{
		label: "Zero-Config Radar",
		href: "#radar",
		description: "Instantly auto-discovers peers on your Wi-Fi/Ethernet",
		icon: <WifiIcon className="text-sky-400" />,
	},
	{
		label: "Phone Camera Pairing",
		href: "#radar",
		description: "Scan QR code to connect iPhone or Android in 1 second",
		icon: <QrCodeIcon className="text-purple-400" />,
	},
	{
		label: "Clipboard Sync",
		href: "#radar",
		description: "Transfer text, links, and passwords peer-to-peer",
		icon: <ClipboardIcon className="text-rose-400" />,
	},
];

export const platformLinks: LinkItemType[] = [
	{
		label: "Local Web Client",
		href: "#quickstart",
		description: "Zero-install web client running on local Wi-Fi",
		icon: <MonitorIcon className="text-emerald-400" />,
	},
	{
		label: "iOS Safari & Mobile",
		href: "#quickstart",
		description: "Direct camera QR pairing in any mobile browser",
		icon: <SmartphoneIcon className="text-zinc-200" />,
	},
	{
		label: "macOS, Windows & Linux",
		href: "#quickstart",
		description: "Drag-and-drop gigabit transfer in any desktop browser",
		icon: <MonitorIcon className="text-sky-400" />,
	},
];

export const resourceLinks: LinkItemType[] = [
	{
		label: "Frequently Asked Questions",
		href: "#faq",
		icon: <HelpCircleIcon className="size-4" />,
	},
	{
		label: "Donate for Grow (Razorpay)",
		href: "https://razorpay.me/@prepsnap",
		icon: <HeartIcon className="size-4 text-rose-400" />,
	},
	{
		label: "Open Source Protocol",
		href: "https://github.com",
		icon: <Code2Icon className="size-4" />,
	},
];

