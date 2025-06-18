"use client"

import { UploadCloud } from "lucide-react"
import styles from "./styles.module.scss"
import { ChangeEvent, useState } from "react"
import Image from "next/image";
import { Button } from "@/app/dashboard/_components/button";
import { api } from "@/services/api";
import { getCookieClient } from "@/lib/cookieClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Category {
    id: string;
    name: string;
}

interface FormProps {
    categories: Category[];
}

export function Form({ categories }: FormProps){
    const router = useRouter();
    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string>("");

    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]){
            const image = e.target.files[0];
            
            if(image.type !== "image/jpeg" && image.type !== "image/png"){
                toast.warning("As imagens devem ser de extensão .png ou .jpg/.jpeg");
                return;
            }

            setImage(image);
            setPreviewImage(URL.createObjectURL(image));
        }
    }

    const handleRegisterProduct = async (formData: FormData) => {
        const categoryIndex = formData.get("category");
        const name = formData.get("name");
        const price = formData.get("price");
        const description = formData.get("description");

        if(!name || !categoryIndex || !price || !description || !image){
            toast.warning("Preencha todos os campos.");
            return;
        }

        const data = new FormData();

        data.append("name", name);
        data.append("price", price);
        data.append("description", description);
        data.append("category_id", categories[Number(categoryIndex)].id);
        data.append("file", image);

        const token = await getCookieClient();

        await api.post("/products", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .catch((err) => {
            console.log(err);
            toast.warning("Falha ao cadastrar este produto.")
        })

        toast.success("Produto cadastrado com sucesso!");
        router.push("/dashboard");
    }

    return(
        <main className={styles.container}>
            <h1>Novo Produto</h1>

            <form action={handleRegisterProduct} className={styles.form}>
                <label className={styles.labelImage}>
                    <span>
                        <UploadCloud size={30} color="#fff" />
                    </span>

                    <input 
                        type="file"
                        accept="image/png, image/jpeg"
                        required
                        onChange={handleFile}
                    />

                    {previewImage.trim() !== "" && (
                        <Image
                            src={previewImage}
                            alt="Imagem de preview"
                            className={styles.preview}
                            fill={true} //ocupa todo os espaço
                            quality={100}
                            priority={true}
                        />
                    )}
                </label>

                <select name="category">
                    {categories.map((category, index) => (
                        <option key={category.id} value={index}>
                            {category.name}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    name="name"
                    placeholder="Digite o nome do produto..."
                    required
                    className={styles.input}
                />

                <input
                    type="text"
                    name="price"
                    placeholder="Preço do produto..."
                    required
                    className={styles.input}
                />

                <textarea
                    name="description"
                    className={styles.input}
                    placeholder="Digite a descrição do produto..."
                    required
                ></textarea>

                <Button name="Cadastrar produto" />
            </form>
        </main>
    )
}