import { contacts, findMeAlsoIn } from "~/_data/contact-data";

type Channel = (typeof contacts)[number];

function ChannelList({
  title,
  items,
  external = false,
}: {
  title: string;
  items: Channel[];
  external?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-slate-500">{`// ${title}`}</p>
      <ul className="mt-2 space-y-0.5">
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group -mx-2 flex items-center gap-3 rounded-sm px-2 py-1.5 text-sm text-slate-300 transition-colors hover:text-cyan-300 focus-visible:bg-cyan-400/10 focus-visible:text-cyan-300 focus-visible:outline-none"
            >
              <span
                aria-hidden
                className="w-3 text-cyan-400 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                ❯
              </span>
              <item.icon aria-hidden className="size-4 shrink-0" />
              <span className="min-w-0 break-all">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Direct ways to reach me, for people who'd rather skip the form
export function ContactChannels() {
  return (
    <div className="space-y-6 font-mono">
      <ChannelList title="direct" items={contacts} />
      <ChannelList title="elsewhere" items={findMeAlsoIn} external />
    </div>
  );
}
