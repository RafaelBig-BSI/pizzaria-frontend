import { getCookieServer } from "@/lib/cookieServer";
import { Orders } from "./_components/orders";
import { api } from "@/services/api";
import { OrderProps } from "@/lib/order.type";

const getOrders = async (): Promise<OrderProps[] | []> => {
    try{
        const token = await getCookieServer();

        const response = await api.get("/orders", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data || [];
    }
    catch {
        return [];
    }
}

export default async function Dashboard(){
    const orders = await getOrders();

    return(
        <>
            <Orders orders={orders} />
        </>
    )
}