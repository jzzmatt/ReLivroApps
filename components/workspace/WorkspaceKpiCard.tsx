"use client";

import {motion, useReducedMotion} from "motion/react";

export type WorkspaceKpiAccent = "visitors" | "books" | "favorites" | "messages";

const icons: Record<WorkspaceKpiAccent, string> = {
  visitors: "👁",
  books: "▣",
  favorites: "♡",
  messages: "✉",
};

export function WorkspaceKpiCard({
  label,
  value,
  accent,
  index,
}: {
  label: string;
  value: string;
  accent: WorkspaceKpiAccent;
  index: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className={`workspace-kpi workspace-kpi--${accent} workspace-kpi--enter`}
      style={{animationDelay: `${index * 60}ms`}}
      aria-label={`${label}: ${value}`}
      initial={false}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -2,
              transition: {duration: 0.22},
            }
      }
    >
      <span className="workspace-kpi-icon" aria-hidden="true">
        {icons[accent]}
      </span>
      <strong>{value}</strong>
      <small>{label}</small>
    </motion.article>
  );
}
