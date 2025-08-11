import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { OwnerProvider } from "@/context/OwnerContext";
import { SidebarProvider } from "@/context/SidebarContext";
import AppRoutes from "@/routes/AppRoutes";
import "@/i18n/i18n";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <OwnerProvider>
          <SidebarProvider>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
              }}
            />
          </SidebarProvider>
        </OwnerProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
