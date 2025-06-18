import { api } from "@/services/api"
import { Button } from "../_components/button"
import styles from "./styles.module.scss"
import { getCookieServer } from "@/lib/cookieServer"
import { redirect } from "next/navigation"
import { toast } from "sonner"

export default function Category(){
    const handleRegisterCategory = async (formData: FormData) => {
        "use server"

        const name = formData.get("name");

        if(name === ""){
            toast.warning("Obrigatório informar nome da categoria.");
            return;
        }

        const data = {
            name,
        }

        const token = await getCookieServer();

        await api.post("/categories", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .catch((err) => {
            console.log(err);
            return;
        });

        toast.success("Categoria cadastrada com sucesso!");
        redirect("/dashboard");
    }

    return(
        <main className={styles.container}>
            <h1>Nova Categoria</h1>

            <form action={handleRegisterCategory} className={styles.form}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nome da categoria, ex: Pizzas"
                    required
                    className={styles.input}
                />

                <Button name="Cadastrar" />
            </form>
        </main>
    )
}