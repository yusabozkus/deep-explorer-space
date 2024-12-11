import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useUserContext } from "@/Context/AuthProvider";
import { useSendResetPasswordLink, useSignInAccount } from "@/Database/React Query/queries";
import { RecoveryValidation } from "@/Database/Validations";

const RecoveryPassword = () => {
    const navigate = useNavigate();
    const { checkAuthUser } = useUserContext();

    // Query
    const { mutateAsync: sendRecovery } = useSendResetPasswordLink();

    const form = useForm<z.infer<typeof RecoveryValidation>>({
        resolver: zodResolver(RecoveryValidation),
        defaultValues: {
            email: "",
        },
    });

    const handleSubmit = async (user: z.infer<typeof RecoveryValidation>) => {
        const session = await sendRecovery({ email: user.email });

        if (!session) {
            return;
        } else {
            console.log(session);
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
                <h1 className="text-[1.7rem] text-center sm:text-start sm:text-[2.5rem] text-white font-bold">Forgot Your Password?</h1>
                <h2 className="mt-5 text-gray-300 text-[.9rem] font-light text-center sm:text-start">
                    Don't worry! Reset your password to regain access and continue your journey in science and discovery.
                </h2>
            </motion.div>
            <Form {...form}>
                <motion.form
                    initial={{ opacity: 0, translateY: -20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={form.handleSubmit(handleSubmit)} className="w-full flex flex-col">
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
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}>
                        <div className="flex flex-col gap-4 w-full mt-9">
                            <motion.button
                                type="submit"
                                className="w-full sm:w-max px-16 py-3 rounded-lg bg-primary text-white font-bold text-[.9rem]"
                                whileHover={{ scale: 1.05 }}
                            >
                                Send Reset Link
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
};

export default RecoveryPassword;
