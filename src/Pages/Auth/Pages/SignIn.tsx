import { SigninValidation } from '@/Database/Validations';
import { useForm } from "react-hook-form";
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Link, useNavigate } from 'react-router-dom';
import { signInAccount } from '@/Database/Appwrite/api';
import { useUserContext } from '@/Context/AuthProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const SignIn = () => {
  const { checkAuthUser } = useUserContext();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleSignin = async (user: z.infer<typeof SigninValidation>) => {
    try {
      await toast.promise(
        (async () => {
          const session = await signInAccount(user);
          if (!session) throw new Error("Login failed. Please try again.");

          const isLoggedIn = await checkAuthUser();

          if (isLoggedIn) {
            form.reset();
            localStorage.setItem("id", session.userId);
            navigate("/");
          } else {
            throw new Error("Login failed. Please try again.");
          }
        })(),
        {
          loading: "Logging in...",
          success: "Logged in successfully!",
          error: "Login failed. Please check your credentials."
        },
        {
          style: {
            minWidth: '250px',
          },
          success: {
            duration: 3000,
            icon: '🚀',
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div
      className="py-4 max-w-lg w-full h-full flex flex-col justify-between"
      initial={{ opacity: 0, y: 20 }}  // Animasyon başlangıcı
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }} // Animasyon bitişi
    >
      <motion.div
        className="flex flex-col"
        initial={{ opacity: 0, translateX: -20 }}  // Başlangıç animasyonu
        animate={{ opacity: 1, translateX: 0 }}   // Bitiş animasyonu
        transition={{ duration: 0.2 }}  // Geçiş süresi
      >
        <h1 className="text-[1.7rem] text-center sm:text-start sm:text-[2.5rem] text-white font-bold">Embark on a New Journey Through the Universe</h1>
        <h2 className="mt-5 text-gray-300 text-[.9rem] font-light text-center sm:text-start">
          Log in to explore science, share insights, and join a community of discovery.
        </h2>
      </motion.div>
      <Form {...form}>
        <motion.form
          initial={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={form.handleSubmit(handleSignin)} className="w-full flex flex-col">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <motion.div>
                    <span className="text-[.9rem] font-normal">Mail</span>
                    <div className="w-full h-[60px] relative">
                      <input
                        {...field}
                        type="email"
                        className="pl-10 pr-5 w-full h-full rounded-lg mt-2 bg-dark-3 border-none outline-none px-4 text-[.9rem] font-bold placeholder:font-light placeholder:text-gray-400"
                        placeholder="abc@gmail.com"
                      />
                      <Mail size={17} strokeWidth={2.5} className="absolute top-1/2 left-3 stroke-gray-400" />
                    </div>
                  </motion.div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <motion.div
                    className="mt-6">
                    <span className="text-[.9rem] font-normal">Password</span>
                    <div className="w-full h-[60px] relative">
                      <input
                        {...field}
                        type="password"
                        className="pl-10 pr-5 w-full h-full rounded-lg mt-2 bg-dark-3 border-none outline-none px-4 text-[.9rem] font-bold placeholder:font-light placeholder:text-gray-400"
                        placeholder="•••••••••"
                      />
                      <Lock size={17} strokeWidth={2.5} className="absolute top-1/2 left-3 stroke-gray-400" />
                    </div>
                  </motion.div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}>
            <Link className="w-full flex items-end justify-end mt-5" to={"/recovery-password"}>
              <p className="text-gray-400 text-[.8rem] sm:text-[.9rem]  hover:underline">Forgot your password?</p>
            </Link>
            <div className="flex flex-col gap-4 w-full mt-9">
              <motion.button
                type="submit"
                className="w-full sm:w-max px-16 py-3 rounded-lg bg-primary text-white font-bold text-[.9rem]"
                whileHover={{ scale: 1.05 }}
              >
                Sign In
              </motion.button>
              <Link className="w-full sm:w-max" to="/sign-up">
                <motion.button
                  className="w-full sm:w-max px-10 py-3 rounded-lg bg-transparent border border-primary text-white font-bold text-[.9rem]"
                  whileHover={{ scale: 1.05 }}
                >
                  Register
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </motion.form>
      </Form>
      <motion.div>
        <p className="text-[.6rem] sm:text-[.8rem] text-center text-gray-400">
          By using our site, you agree to our{" "}
          <Link className="underline transition-all ease-linear hover:text-gray-300" to={"/terms-of-use"}>
            Terms of Use
          </Link> and{" "}
          <Link className="underline transition-all ease-linear hover:text-gray-300" to={"/privacy-policy"}>
            Privacy Policy
          </Link>.
        </p>
      </motion.div>
    </motion.div>
  );
}

export default SignIn;
