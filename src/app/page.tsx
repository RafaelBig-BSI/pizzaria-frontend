import Image from "next/image";
import styles from "./page.module.scss"
import logoImg from "/public/logo.svg"
import Link from "next/link";
import { api } from "@/services/api";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default function Home() {
  const handleLogin = async (formData: FormData) => {
    "use server"

    const email = formData.get("email");
    const password = formData.get("password");

    if(email === "" || password === "") return;

    try{
      const response = await api.post("/session", {
        email,
        password,
      });

      if(!response.data.token) return;

      // Salvando token do usuário
      const expressTime = 60 * 60 * 24 * 30 * 1000; // 30 dias
      const cookieStore = await cookies();

      cookieStore.set("session", response.data.token, {
        maxAge: expressTime,
        path: "/", // todos os caminhos podem acessar o cookie
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
      });
    }
    catch(err){
      console.log("ERROR:");
      console.log(err);
      return;
    }

    redirect("/dashboard");
  }

  return (
    <>
      <div className={styles.containerCenter}>
        <Image
          src={logoImg}
          alt="Logo da pizzaria"
        />

        <section className={styles.login}>
          <form action={handleLogin}>
            <input
                type="email"
                required
                name="email"
                placeholder="Digite seu E-mail..."
                className={styles.input}
              />

              <input
                type="password"
                required
                name="password"
                placeholder="************"
                className={styles.input}
              />

              <button type="submit">
                Acessar
              </button>
          </form>

          <Link href="/signup" className={styles.text}>
            Não possui uma conta? Cadastre-se
          </Link>
        </section>
      </div>
    </>
  );
}
