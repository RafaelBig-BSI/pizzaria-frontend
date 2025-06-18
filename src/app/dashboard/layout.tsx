import { ReactNode } from "react";
import { Header } from "./_components/header";
import { OrderProvider } from "@/providers/order";

export default function DashboardLayout({ children }: { children: ReactNode }){
    return(
        <>
            <Header />
            
            <OrderProvider>
                {children}
            </OrderProvider>
        </>
    )
}