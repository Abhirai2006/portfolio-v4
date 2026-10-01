// Email kept lightly obfuscated in source so scrapers don't get a plain literal.
const rev = (parts: string[]) => parts.map((p) => p.split("").reverse().join("")).join("");

export const CONTACT_EMAIL = rev(["iarihba", "mg@6002", "moc.lia"]);

export type MailIntent = "hire" | "internship" | "freelance" | "hello";

const TEMPLATES: Record<MailIntent, { label: string; subject: string; body: string }> = {
  hire: {
    label: "Full-time role",
    subject: "Hi Abhishek, I'd like to chat about a role",
    body: "Hey Abhishek,\n\nI saw your portfolio and I'm hiring for a role I think fits you.\n\nRole:\nTeam / company:\nLocation (remote or on-site):\nWhen we'd want you to start:\n\n—",
  },
  internship: {
    label: "Internship",
    subject: "Internship opportunity for you, Abhishek",
    body: "Hey Abhishek,\n\nWe have an internship open and your ML work stood out.\n\nTeam:\nDuration:\nStipend:\nStart date:\n\n—",
  },
  freelance: {
    label: "Freelance / project",
    subject: "Freelance project — quick question",
    body: "Hey Abhishek,\n\nI've got a project I'd like your help on.\n\nWhat it is:\nRough scope:\nTimeline:\nBudget range:\n\n—",
  },
  hello: {
    label: "Just saying hi",
    subject: "Hey Abhishek 👋",
    body: "Hey Abhishek,\n\nSaw your portfolio and wanted to say hi.\n\nWhat caught my eye:\n\n—",
  },
};

export function mailto(intent: MailIntent = "hire") {
  const t = TEMPLATES[intent];
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(t.body)}`;
}

export const MAIL_INTENTS = (Object.keys(TEMPLATES) as MailIntent[]).map((k) => ({
  intent: k,
  label: TEMPLATES[k].label,
  href: mailto(k),
}));

/** Pre-filled mailto: link — opens the visitor's own mail client (RFC 6068). */
export const hireMailto = mailto("hire");
