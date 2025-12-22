import { navItems } from "@/config";
import NavButton from "../navbutton";
import Link from "next/link";
import Image from "next/image";
import SignOutBtn from "../signoutbtn";

export default function NavBar() {
    return (
        <nav className="flex flex-row justify-between items-center p-4 w-full shadow-md">
            <div>
                <Link href="/"><Image src="/logo-opus.png" alt="Autospa Opus" width={100} height={100} priority /></Link>
            </div>
            <div className="hidden md:flex flex-row gap-4">
                {navItems.map((item) => (
                    <NavButton key={item.name} href={item.href} label={item.name} />
                ))}
                <SignOutBtn />
            </div>
        </nav>
    )
}