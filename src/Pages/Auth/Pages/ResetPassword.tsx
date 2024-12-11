import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useUserContext } from "@/Context/AuthProvider";
import { useResetPassword } from "@/Database/React Query/queries";
import { ResetPasswordValidation } from "@/Database/Validations";
import toast from "react-hot-toast";
import { useState } from "react";

const ResetPassword = () => {
    const navigate = useNavigate();
    const { checkAuthUser } = useUserContext();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get("userId");
    const secret = queryParams.get("secret");

    // Query
    const { mutateAsync: resetPassword } = useResetPassword();

    const form = useForm<z.infer<typeof ResetPasswordValidation>>({
        resolver: zodResolver(ResetPasswordValidation),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const handleSubmit = async (user: z.infer<typeof ResetPasswordValidation>) => {
        if (userId && secret) {
            setIsSubmitting(true);

            const session = await resetPassword({ userId, secret, password: user.password });

            if (!session) {
                setIsSubmitting(false);
                return;
            }

            // Start countdown toast
            let countdown = 5;
            const countdownToast = toast.loading(`5 saniye sonra yönlendirileceksiniz...`);

            const interval = setInterval(() => {
                countdown -= 1;
                toast.loading(`${countdown} saniye sonra yönlendirileceksiniz...`, {
                    id: countdownToast,
                });

                if (countdown === 0) {
                    clearInterval(interval);
                    toast.dismiss(countdownToast);
                    navigate("/sign-in");
                }
            }, 1000);
        } else {
            toast.error("Geçersiz bağlantı. Yeni link talep edin.");
        }
    };

    return (
        <motion.div
            className="py-4 max-w-lg w-full h-full flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
        >
            <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ duration: 0.2 }}
            >
                <h1 className="text-[1.7rem] text-center sm:text-start sm:text-[2.5rem] text-white font-bold">Create a New Password</h1>
                <h2 className="mt-5 text-gray-300 text-[.9rem] font-light text-center sm:text-start">
                    Enter your new password below to update your account and continue exploring the world of science.
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
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <motion.div className="mt-6">
                                        <span className="text-[.9rem] font-normal">Password Again</span>
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
                        )}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <div className="flex flex-col gap-4 w-full mt-9">
                            <motion.button
                                type="submit"
                                className={`w-full sm:w-max px-16 py-3 rounded-lg ${isSubmitting ? "bg-gray-400" : "bg-primary"} text-white font-bold text-[.9rem]`}
                                disabled={isSubmitting}
                                whileHover={isSubmitting ? {} : { scale: 1.05 }}
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </motion.button>
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

export default ResetPassword;
