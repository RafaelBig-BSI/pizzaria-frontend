import { getCookieServer } from "@/lib/cookieServer";
import { Form } from "./_components/form";
import { api } from "@/services/api";

export default async function Product(){    
    const token = await getCookieServer();

    const response = await api.get("/categories", {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    return(
        <main>
            <Form categories={response.data} />
        </main>
    )
}