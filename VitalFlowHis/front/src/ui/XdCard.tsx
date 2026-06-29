import { ReactNode } from "react";

type XdCardProps = {
  className?: string;
  title?: string;
  children: ReactNode;
};

export function XdCard({ className, title, children }: XdCardProps) {
  const classes = className ? `card-block ${className}` : "card-block";
  return (
    <section className={classes}>
      {title ? <h2>{title}</h2> : null}
      {children}
    </section>
  );
}
