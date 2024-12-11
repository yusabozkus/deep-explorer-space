import MobileBottomBar from "@/components/Shared/MobileBottomBar";
import MobileTopbar from "@/components/Shared/MobileTopbar";
import Sidebar from "@/components/Shared/Sidebar";
import Topbar from "@/components/Shared/Topbar";
import { useUserContext } from "@/Context/AuthProvider";
import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import useSocket from "../../Database/Hooks/useSocket";
import { useEffect } from "react";

const RootLayout = () => {
  const { pathname } = useLocation();
  const { user } = useUserContext();
  const { connectUser } = useSocket();

  const hideTopbar = ["/create-article"];
  const defaultMargin = ["/articles", "/create-article"];
  const fullWidth = ["/create-article", "/article"];

  // WebSocket Bağlantısı
  if (!user || !user.id || !user.profile) {
    // Kullanıcı yokken loading animasyonu
    return (
      <AnimatePresence>
        <motion.div
          className="flex flex-row items-center justify-center w-full h-full fixed top-0 left-0 right-0 bottom-0 bg-body"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, delay: 1.5 } }}
        >
          <motion.img
            className="w-20 h-20"
            src="/images/icon.png"
            initial={{ scale: 1, opacity: 1 }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.5 } }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-5 text-center flex flex-col gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: 20,
              transition: { duration: 0.5, delay: 0.5 },
            }}
            transition={{ delay: 0, duration: 1 }}
          >
            <h3 className="text-[.8rem] text-default-500">developed by</h3>
            <h2 className="text-[1rem] font-semibold text-white">Fuez</h2>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // useEffect(() => {
  //   if (user && user.id) {
  //     connectUser(user.name);
  //   }
  // }, [user]);

  return (
    <main className="w-full h-screen bg-body">
      <div className="flex flex-row w-full h-full">
        <aside className="w-[73px] hidden lg:flex relative">
          <Sidebar user={user} />
        </aside>
        <aside className="z-50 flex lg:hidden fixed w-auto bottom-0 left-0 right-0">
          <MobileBottomBar user={user} />
        </aside>
        <section className="flex-1 relative overflow-y-auto custom-scroll">
          <div className="sticky top-0 z-50 hidden lg:flex">
            {!hideTopbar.includes(pathname) && <Topbar user={user} />}
          </div>
          <div
            className={`sticky top-0 z-50 flex lg:hidden  transition-transform duration-300`}
          >
            {!hideTopbar.includes(pathname) && <MobileTopbar />}
          </div>
          <div
            className={`w-full m-auto ${
              defaultMargin.includes(pathname) ? "mt-0" : "mt-0 lg:mt-5"
            }`}
          >
            <Outlet context={user} />
          </div>
        </section>
      </div>
    </main>
  );
};

export default RootLayout;
