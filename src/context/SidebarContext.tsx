import { createContext, useContext, useState, type ReactNode } from "react";

type SidebarContextType = {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (value: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  toggle: () => {},
  setOpen: () => {},
});

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);
  const setOpen = (value: boolean) => setIsOpen(value);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
