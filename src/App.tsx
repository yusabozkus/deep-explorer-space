import { Route } from "react-router-dom";
import Home from "./Pages/Root/Pages/Home";
import AuthLayout from "./Pages/Auth/AuthLayout";
import RootLayout from "./Pages/Root/RootLayout";
import SignIn from "./Pages/Auth/Pages/SignIn";
import SignUp from "./Pages/Auth/Pages/SignUp";
import { Toaster } from "react-hot-toast";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Articles from "./Pages/Root/Pages/Articles";
import CreateArticle from "./Pages/Root/Pages/CreateArticle";
import SingleArticle from "./Pages/Root/Pages/SingleArticle";
import CustomSwitch from "./components/Shared/CustomSwitch";
import Profile from "./Pages/Root/Pages/Profile";
import EditProfile from "./Pages/Root/Pages/EditProfile";
import { useUserContext } from "./Context/AuthProvider";
import SingleThread from "./Pages/Root/Pages/SingleThread";
import RecoveryPassword from "./Pages/Auth/Pages/RecoveryPassword";
import ResetPassword from "./Pages/Auth/Pages/ResetPassword";
import { AnimatePresence, motion } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";

function App() {
  const { isAuthenticated } = useUserContext();

  if (isAuthenticated === null) {
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

  return (
    <HelmetProvider>
      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <main className="flex h-screen">
            <Toaster
              toastOptions={{
                className: "bg-body",
                style: {
                  backgroundColor: "#252525d8",
                  color: "white",
                  fontWeight: "400",
                  fontSize: "14px",
                  backdropFilter: "blur(6px)",
                },
              }}
            />
            <CustomSwitch>
              {!isAuthenticated && (
                <Route element={<AuthLayout />}>
                  <Route path="/" element={<SignIn />} />
                  <Route path="/sign-in" element={<SignIn />} />
                  <Route path="/sign-up" element={<SignUp />} />
                  <Route
                    path="/recovery-password"
                    element={<RecoveryPassword />}
                  />
                  <Route path="/reset-password" element={<ResetPassword />} />
                </Route>
              )}

              {isAuthenticated && (
                <Route element={<RootLayout />}>
                  <Route index path="/" element={<Home />} />
                  <Route
                    index
                    element={<SingleArticle />}
                    path="/article/:id"
                  />
                  <Route index element={<SingleThread />} path="/threads/:id" />

                  <Route index path="/articles" element={<Articles />} />

                  <Route
                    index
                    path="/create-article"
                    element={<CreateArticle />}
                  />

                  {/* <Route index path="/test" element={<Test />} /> */}

                  <Route index path="/:username" element={<Profile />} />
                  {isAuthenticated && (
                    <Route
                      index
                      path="/profile/edit"
                      element={<EditProfile />}
                    />
                  )}
                </Route>
              )}
            </CustomSwitch>
          </main>
        </NextThemesProvider>
      </NextUIProvider>
    </HelmetProvider>
  );
}

export default App;
