import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react-router/v8";

import "./App.css";

import { queryClient } from "@lib/reactQuery.lib";
import { NotificationToaster } from "@utils/notifications";
import { TooltipProvider } from "@components/ui/tooltip";
import { LayoutProvider } from "./layers/store/layoutContext";
import { ThemeProvider } from "./layers/store/themeSchemaContext";
import appRouter from "./features/router";

function App() {
    return (
        <ThemeProvider>
            <TooltipProvider>
                <LayoutProvider>
                    <NuqsAdapter>
                        <QueryClientProvider client={queryClient}>
                            <RouterProvider router={appRouter} />
                            <NotificationToaster />
                        </QueryClientProvider>
                    </NuqsAdapter>
                </LayoutProvider>
            </TooltipProvider>
        </ThemeProvider>
    );
}

export default App;
