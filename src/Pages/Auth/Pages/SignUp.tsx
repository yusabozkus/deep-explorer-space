import { SignupValidation } from '@/Database/Validations';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import toast from 'react-hot-toast';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Button } from "@nextui-org/react";
import { Link, useNavigate } from 'react-router-dom';
import { useCreateUserAccount, useSignInAccount } from '@/Database/React Query/queries';
import { useUserContext } from '@/Context/AuthProvider';
import { Lock, Mail, User2 } from 'lucide-react';
import { motion } from 'framer-motion';

const SignUp = () => {

  const { mutateAsync: createUserAccount, isLoading: isCreatingAccount } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isLoading: isSigningInUser } = useSignInAccount();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
    try {
      // Toast işlemini buraya sarıyoruz
      await toast.promise(
        (async () => {
          // 1. Hesap oluşturma işlemi
          const newUser = await createUserAccount(user);

          if (!newUser) {
            throw new Error("Account creation failed");
          }

          // Eğer hesap başarıyla oluşturulmuşsa, giriş yapmayı deneyelim
          const session = await signInAccount({
            email: user.email,
            password: user.password,
          });

          if (!session) {
            navigate("/sign-in");
            throw new Error("Login failed");
          }

          // 2. Giriş yapıldıktan sonra kullanıcıyı doğrulayalım
          const isLoggedIn = await checkAuthUser();

          if (isLoggedIn) {
            form.reset();
            navigate("/");
          } else {
            throw new Error("User authentication failed");
          }
        })(),
        {
          loading: "Account is being created...",
          success: "Account created and logged in successfully!",
          error: (err) => `An error occurred: ${err.toString()}`,
        },
        {
          style: {
            minWidth: '250px',
          },
          success: {
            duration: 3000,
            icon: '✅',
          },
        }
      );
    } catch (error) {
      console.error({ error });
    }
  };


  return (
    <motion.div
      className="py-0 max-w-lg w-full h-full flex flex-col justify-between"
      initial={{ opacity: 0, y: 20 }}  // Animasyon başlangıcı
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }} // Animasyon bitişi
    >
      <motion.div
        className="flex flex-col"
        initial={{ opacity: 0, translateY: -20 }}  // Başlangıç animasyonu
        animate={{ opacity: 1, translateY: 0 }}   // Bitiş animasyonu
        transition={{ duration: 0.3 }}  // Geçiş süresi
      >
        <h1 className="text-[1.7rem] text-center sm:text-start sm:text-[2.5rem] text-white font-bold">Join the Cosmos of Knowledge</h1>
        <h2 className="mt-5 text-gray-300 text-[.8rem] font-light text-center sm:text-start hide">
          Join our community to explore, share, and discover the wonders of science.
        </h2>
      </motion.div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignup)} className="w-full flex flex-col py-20 sm:py-10">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <motion.div>
                    <span className="text-[.9rem] font-normal">Full Name</span>
                    <div className="w-full h-[60px] relative">
                      <input
                        {...field}
                        type="text"
                        className="pl-10 pr-5 w-full h-full rounded-lg mt-2 bg-dark-3 border-none outline-none px-4 text-[.9rem] font-bold placeholder:font-light placeholder:text-gray-400"
                        placeholder="Name Surname"
                      />
                      <User2 size={17} strokeWidth={2.5} className="absolute top-1/2 left-3 stroke-gray-400" />
                    </div>
                  </motion.div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <motion.div className="mt-6">
                    <span className="text-[.9rem] font-normal">Username</span>
                    <div className="w-full h-[60px] relative">
                      <input
                        {...field}
                        type="text"
                        className="pl-10 pr-5 w-full h-full rounded-lg mt-2 bg-dark-3 border-none outline-none px-4 text-[.9rem] font-bold placeholder:font-light placeholder:text-gray-400"
                        placeholder="@example_user"
                      />
                      <User2 size={17} strokeWidth={2.5} className="absolute top-1/2 left-3 stroke-gray-400" />
                    </div>
                  </motion.div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <motion.div className="mt-6">
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
                  <motion.div className="mt-6">
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
          <motion.div className="mt-4">
            <div className="flex flex-col gap-4 w-full mt-9">
              <motion.button
                type="submit"
                className="w-full sm:w-max px-16 py-3 rounded-lg bg-primary text-white font-bold text-[.9rem]"
                whileHover={{ scale: 1.05 }}
              >
                Register
              </motion.button>
              <Link className="w-full sm:w-max" to="/sign-in">
                <motion.button
                  className="w-full sm:w-max px-10 py-3 rounded-lg bg-transparent border border-primary text-white font-bold text-[.9rem]"
                  whileHover={{ scale: 1.05 }}
                >
                  Sign In
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </form>
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
  )
}

export default SignUp
