import type React from "react";

export const LogoIcon = ({ className = "size-5", ...props }: React.ComponentProps<"svg">) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.4"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
		{...props}
	>
		<circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
		<path d="M4.93 4.93a10 10 0 0 1 14.14 0" opacity="0.4" />
		<path d="M7.76 7.76a6 6 0 0 1 8.48 0" opacity="0.75" />
		<path d="M2.1 2.1a14 14 0 0 1 19.8 0" opacity="0.25" />
	</svg>
);

export const Logo = ({ className, ...props }: React.ComponentProps<"div">) => (
	<div className={`flex items-center gap-2 select-none ${className || ""}`} {...props}>
		<div className="flex items-center justify-center size-7 rounded-lg bg-foreground text-background">
			<LogoIcon className="size-4 fill-background stroke-background" />
		</div>
		<span className="font-bold text-base tracking-tight text-foreground">
			LocalReceive
		</span>
	</div>
);

