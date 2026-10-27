"use client";

import { useId, useState } from "react";
import Icon from "./DocIcon";

/**
 * Below 1024 px the help-centre sidebar folds behind one button; from 1024 px
 * it is always shown and the button is gone. The nav is server-rendered
 * either way, so every link is in the document for crawlers.
 */
export default function SidebarToggle({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:overscroll-contain lg:pe-2">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-12 w-full items-center justify-between gap-3 border border-line-strong px-4 text-start font-medium text-ink lg:hidden"
      >
        <span className="flex items-center gap-2.5">
          <Icon name="book" size={18} />
          {label}
        </span>
        <Icon name={open ? "close" : "plus"} size={18} />
      </button>
      <div id={id} className={`${open ? "block" : "hidden"} pt-5 lg:block lg:pt-0`}>
        {children}
      </div>
    </div>
  );
}
