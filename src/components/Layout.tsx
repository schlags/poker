import { Inter } from "next/font/google";
import DylanSchlager from "./DylanSchlager";

interface LayoutProps {
  children: React.ReactNode;
}

const inter = Inter({ subsets: ["latin"] });

const Layout = ({ children }: LayoutProps) => {
  return (
        <div className="flex w-screen h-screen justify-start">
          <main className="mx-auto md:my-auto w-screen md:w-2/3 xl:w-1/2 md:h-auto p-4 md:p-8 pb-48">
            <DylanSchlager />
            <div className="rounded-lg shadow-lg relative w-full h-full md:h-auto p-8">
              {children}
            </div>
          </main>
        </div>
  );
};

export default Layout;
