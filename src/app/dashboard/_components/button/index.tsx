"use client"

import { useFormStatus } from "react-dom"
import styles from "./styles.module.scss"

interface ButtonProps {
    name: string;
}

export function Button({ name }: ButtonProps){
    const { pending } = useFormStatus();

    return(
        <button
            type="submit"
            className={styles.button}
            disabled={pending}
        >
            {pending ? "Carregando..." : name}
        </button>
    )
}