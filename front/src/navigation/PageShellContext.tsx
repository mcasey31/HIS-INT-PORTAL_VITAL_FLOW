import { createContext, ReactNode, useContext, useEffect } from "react";

export type PageShellBreadcrumbItem = {
  label: string;
  path?: string;
};

export type PageShellState = {
  title: string;
  breadcrumbItems: readonly PageShellBreadcrumbItem[];
};

type PageShellContextValue = {
  setPageShell: (value: PageShellState) => void;
};

const PageShellContext = createContext<PageShellContextValue | null>(null);

type PageShellProviderProps = {
  value: PageShellContextValue;
  children: ReactNode;
};

export function PageShellProvider({ value, children }: PageShellProviderProps) {
  return <PageShellContext.Provider value={value}>{children}</PageShellContext.Provider>;
}

export function usePageShell(shellState: PageShellState) {
  const context = useContext(PageShellContext);
  const breadcrumbKey = shellState.breadcrumbItems
    .map((item) => `${item.label}::${item.path ?? ""}`)
    .join("|");

  useEffect(() => {
    context?.setPageShell(shellState);
  }, [breadcrumbKey, context, shellState.title]);
}