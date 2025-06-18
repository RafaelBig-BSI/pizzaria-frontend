"use client"

import { getCookieClient } from "@/lib/cookieClient";
import { OrderProps } from "@/lib/order.type";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useState } from "react"
import { toast } from "sonner";

export interface OrderItemProps {
    id: string;
    amount: number;
    created_at: string;
    order_id: string;
    product_id: string;
    product: {
        id: string;
        name: string;
        price: string;
        description: string;
        banner: string;
        category_id: string;
    },
    order: {
        id: string;
        table: number;
        name: string | null;
        draft: boolean;
        status: boolean;
    }
}

interface OrderContextData {
    isOpen: boolean;
    onRequestOpen: (order_id: string) => Promise<void>;
    onRequestClose: () => void;
    order: OrderItemProps[];
    finishOrder: (order_id: string) => Promise<void>;
}

type OrderProviderProps = {
    children: ReactNode;
}

export const OrderContext = createContext({} as OrderContextData);

export function OrderProvider({ children }: OrderProviderProps){
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [order, setOrder] = useState<OrderItemProps[]>([]);
    const router = useRouter();

    const onRequestOpen = async (order_id: string) => {
        const token = await getCookieClient();

        const response = await api.get("/orders/detail", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                order_id,
            }
        });

        setOrder(response.data);
        setIsOpen(true);
    }

    const onRequestClose = () => {
        setIsOpen(false);
    }

    const finishOrder = async (order_id: string) => {
        const token = await getCookieClient();

        const data = {
            order_id,
        }

        try{
            await api.put("/orders/finish", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            toast.success("Pedido finalizado com sucesso!");
            router.refresh();
            setIsOpen(false);
        }
        catch{
            toast.error("Ocorreu um erro ao finalizar este pedido. Por favor, tente novamente mais tarde.");
            return;
        }
    }

    return(
        <OrderContext.Provider
            value={{
                isOpen,
                onRequestOpen,
                onRequestClose,
                order,
                finishOrder,
            }}
        >
            {children}
        </OrderContext.Provider>
    )
}