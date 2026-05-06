export const DEFAULT_TITLE = "Muzzamil Raza" as const;
export const DEFAULT_DESC =
	"Hi! This is a portfolio/introductory website for Muzzamil Raza" as const;

export type Project = {
	name: string;
	/** Date range or marker (e.g. "Nov '25 — now", "contributing"). Rendered in mono uppercase. */
	date: string;
	/** One-line description rendered in the body column. */
	summary: string;
	/** Single-sentence commentary rendered in the right margin. */
	sidenote: string;
	/** Optional URL — when present, the project name renders as a link. */
	href?: string;
};

export const WORK: readonly Project[] = [
	{
		name: "AYTICS",
		date: "Nov '25 — now",
		summary:
			"Fintech platform digitizing bonding payments — sole full-stack engineer.",
		sidenote:
			"Building alone forces ruthless prioritization. Every feature has to earn its place against a backlog of one.",
	},
	{
		name: "TrueMark",
		date: "Oct '24 — Sep '25",
		summary:
			"DocuSign-style signing platform with biometric ID verification.",
		sidenote:
			"The hard part wasn't the Rekognition call — it was earning the trust the seven-second sign-and-verify promise required.",
	},
	{
		name: "FirstClass Healthcare",
		date: "Mar '23 — Oct '25",
		summary:
			"HIPAA-compliant medical and mental healthcare platform for correctional facilities.",
		sidenote:
			"The hardest UX problem wasn't compliance — it was designing for staff who hadn't asked for software in their job.",
	},
	{
		name: "Search Wavelength",
		date: "Oct '23 — Feb '24",
		summary:
			"Alumni-to-alma-mater connection platform — led full backend rewrite from Python to Node.",
		sidenote:
			"Built celery group-tasks on redis from scratch when the Node port didn't have them. Sometimes \"open source\" just means \"someone else hasn't written it yet.\"",
	},
	{
		name: "Drive Thru Urgent Care",
		date: "Mar '23 — Sep '23",
		summary:
			"Drive-through medical care booking platform with real-time patient–provider messaging.",
		sidenote:
			"Real-time chat is rarely about real-time. It's about not making the user wonder whether their message arrived.",
	},
	{
		name: "OneReel",
		date: "Jul '22 — Feb '23",
		summary:
			"Multi-user video calls livestreamed simultaneously across multiple social platforms.",
		sidenote:
			"Streaming to many platforms at once means failing on each one in slightly different ways. The work was making the failures legible.",
	},
] as const;

export const OPEN_SOURCE: readonly Project[] = [
	{
		name: "pallas-ui",
		date: "contributing",
		summary:
			"A React component library and design system, built in the open.",
		sidenote:
			"Designing primitives for other people's products forces you to be specific about what \"flexible\" actually means.",
		href: "https://github.com/PallasUI/pallas-ui",
	},
] as const;
