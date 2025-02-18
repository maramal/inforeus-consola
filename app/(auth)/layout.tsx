import { ClerkProvider } from "@clerk/nextjs";
import { esUY } from "@/locale/es-UY";
import SidebarMenu from "@/components/sidebar-menu";
import { auth } from "@clerk/nextjs/server";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { userId, redirectToSignIn } = await auth()

    if (!userId) return redirectToSignIn()

    return (
        <ClerkProvider localization={esUY}>
            <div className="flex">
                <SidebarMenu />
                <main className="flex-1 ml-64 p-4">
                    {children}
                </main>
            </div>
        </ClerkProvider>
    );
}