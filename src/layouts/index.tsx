import { ReactNode } from "react";
import MainLayout from "./main";

type Props = {
    children: ReactNode;
    variant?: "main";
};

export default function Layout({ variant = "main", children }: Props) {
    // if (variant === "auth") {
    //     return <AuthLayout>{children}</AuthLayout>;
    // }

    return <MainLayout>{children}</MainLayout>;
}
