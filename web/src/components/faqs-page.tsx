import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { DecorIcon } from "@/components/decor-icon";

export function FaqsSection() {
	return (
		<section className="mx-auto grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 lg:border-x border-border/60 py-6 md:py-10">
			<div className="px-4 pt-4 pb-6">
				<div className="space-y-5">
					<h2 className="text-balance font-bold text-4xl md:text-6xl lg:font-black">
						Frequently Asked Questions
					</h2>
					<p className="text-muted-foreground text-sm">
						Quick answers to common questions about LocalReceive LAN AirDrop.
					</p>
					<p className="text-muted-foreground text-sm">
						{"Want to support open-source development? "}
						<a
							className="text-accent font-medium hover:underline inline-flex items-center gap-1"
							href="https://razorpay.me/@prepsnap"
							target="_blank"
							rel="noopener noreferrer"
						>
							<span>Donate via Razorpay</span>
							<span>↗</span>
						</a>
					</p>
				</div>
			</div>
			<div className="relative place-content-center">
				{/* vertical guide line */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-y-0 left-3 h-full w-px bg-border"
				/>

				<Accordion
					className="rounded-none border-x-0 border-y"
					collapsible
					type="single"
				>
					{faqs.map((item) => (
						<AccordionItem
							className="group relative pl-5"
							key={item.id}
							value={item.id}
						>
							<DecorIcon
								className="left-[13px] size-3 group-last:hidden"
								position="bottom-left"
							/>

							<AccordionTrigger className="px-4 py-4 hover:no-underline focus-visible:underline focus-visible:ring-0">
								{item.title}
							</AccordionTrigger>

							<AccordionContent className="px-4 pb-4 text-muted-foreground">
								{item.content}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
}

const faqs = [
	{
		id: "item-1",
		title: "How fast does LocalReceive transfer files?",
		content:
			"LocalReceive streams files across your local 5GHz Wi-Fi / Ethernet router at wire speeds up to 120+ MB/s (1 Gbps) using dual-engine WebRTC DataChannels and zero-copy HTTP streaming chunking.",
	},
	{
		id: "item-2",
		title: "Does LocalReceive consume internet or cellular data?",
		content:
			"Zero KB. LocalReceive operates 100% inside your local area network (LAN). It works completely offline, air-gapped, and requires zero external internet bandwidth.",
	},
	{
		id: "item-3",
		title: "How do I pair an Android or iPhone?",
		content:
			"Simply tap 'Phone / QR' on the top bar or on the landing page, and scan the terminal QR code with your phone camera. It opens instantly in Safari or Chrome without installing anything, or you can download our Native Android APK.",
	},
	{
		id: "item-4",
		title: "What is Direct Auto-Receive?",
		content:
			"Direct Auto-Receive (engineered with transitions.dev double-bounce spring physics) enables zero-prompt automatic downloading. Incoming transfers are received directly to disk without requiring manual confirmation clicks.",
	},
	{
		id: "item-5",
		title: "Is there any file size limit?",
		content:
			"No. You can transfer 50GB 4K videos, massive zip archives, raw photo libraries, and whole folders. Streams are piped directly to disk without buffering in RAM.",
	},
	{
		id: "item-6",
		title: "How do I run LocalReceive offline on my computer?",
		content:
			"Clone our open-source GitHub repository: git clone https://github.com/Fixotix/LocalReceive.git, navigate to the folder with 'cd LocalReceive', run 'npm install', and then 'npm start'. Your terminal immediately prints an ASCII QR code and local Wi-Fi IP address ready for wire-speed transfers!",
	},
	{
		id: "item-7",
		title: "How can I support LocalReceive?",
		content:
			"LocalReceive is 100% free and open-source. You can star our GitHub repository (Fixotix/LocalReceive) and support continuous development via our Razorpay Donate link: https://razorpay.me/@prepsnap",
	},
];
