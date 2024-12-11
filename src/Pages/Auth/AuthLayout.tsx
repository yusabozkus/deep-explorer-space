import { useUserContext } from "@/Context/AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const AuthLayout = () => {
  const { isAuthenticated } = useUserContext();
  const { pathname } = useLocation();

  return (
    <>
      <AnimatePresence>
        <motion.section
          exit={{ opacity: 0, scale: 0.9 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-1 justify-center items-center flex-col py-10 bg-body overflow-x-hidden sm:px-0 px-4"
        >
          <Outlet />
        </motion.section>
      </AnimatePresence>

      <AnimatePresence>
        <motion.div className="relative w-1/2 bg-body p-2 hidden lg:flex">
          <motion.video
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            autoPlay
            className="rounded-[20px] object-cover z-10"
            src="https://cdn.dribbble.com/userupload/15211872/file/original-2de2b10f11bd8fa985753ec644525a74.mp4 "
          ></motion.video>
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-transparent z-20" />
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default AuthLayout;
