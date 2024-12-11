import * as z from "zod";

const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 30 MB
export const SigninValidation = z.object({
  email: z.string().email({ message: "Geçersiz e-posta adresi." }),
  password: z.string().min(8, { message: "Şifre en az 8 karakter olmalıdır." }),
});

const turkishLowerCase = (str: string) =>
  str
    .replace(/İ/g, "i")
    .replace(/I/g, "ı")
    .replace(/Ç/g, "ç")
    .replace(/Ğ/g, "ğ")
    .replace(/Ü/g, "ü")
    .replace(/Ş/g, "ş")
    .replace(/Ö/g, "ö")
    .toLowerCase();

const turkishUpperCase = (str: string) =>
  str
    .replace(/i/g, "İ")
    .replace(/ı/g, "I")
    .replace(/ç/g, "Ç")
    .replace(/ğ/g, "Ğ")
    .replace(/ü/g, "Ü")
    .replace(/ş/g, "Ş")
    .replace(/ö/g, "Ö")
    .toUpperCase();

const capitalizeFirstLetter = (str: string) =>
  str
    .split(" ")
    .map((word) => turkishUpperCase(word[0]) + turkishLowerCase(word.slice(1)))
    .join(" ");

export const SignupValidation = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .regex(/^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/, {
      message: "Name must only contain letters.",
    })
    .refine((val) => capitalizeFirstLetter(val) === val, {
      message: "The first letter of each word must be capitalized.",
    })
    .refine((val) => val.trim().split(/\s+/).length >= 2, {
      message: "Name must consist of at least two words.",
    }),

  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long." })
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, {
      message:
        "Username must start with a letter or an underscore (_) and can only contain letters, numbers, and underscores (_).",
    }),

  email: z.string().email({ message: "Invalid email address." }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

export const UserThoughtValidation = z.object({
  caption: z
    .string()
    .min(10, { message: "It must be at least 10 characters." })
    .max(4000, { message: "It must be at most 4000 characters." }),

  location: z.string().optional(),

  images: z
    .array(
      z.custom<File>().refine((file) => file.size <= 10 * 1024 * 1024, {
        message: "Each image must be 10 MB or less.",
      })
    )
    .max(5, { message: "You can upload up to 5 images." })
    .optional(),

  video: z
    .custom<File>()
    .optional()
    .refine((file) => !file || file.size <= MAX_VIDEO_SIZE, {
      message: "Video must be 30 MB or less.",
    }),
});

export const ResetPasswordValidation = z
  .object({
    password: z
      .string()
      .min(8, { message: "Şifre en az 8 karakter olmalıdır." }),
    confirmPassword: z
      .string()
      .min(8, { message: "Şifre en az 8 karakter olmalıdır." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor.",
    path: ["confirmPassword"], // Hata mesajını `confirmPassword` alanında göster
  });

export const ArticleValidation = z.object({
  title: z.string().max(150, "It must be at most 150 characters."),
  subtitle: z.string().max(150, "It must be at most 150 characters."),
  inner: z.string().max(30000, "It must be at most 30.000 characters."),
});

export const RecoveryValidation = z.object({
  email: z.string().email({ message: "Geçersiz e-posta adresi." }),
});

export const UpdateUserValidation = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .regex(/^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/, {
      message: "Name must only contain letters.",
    })
    .refine((val) => capitalizeFirstLetter(val) === val, {
      message: "The first letter of each word must be capitalized.",
    })
    .refine((val) => val.trim().split(/\s+/).length >= 2, {
      message: "Name must consist of at least two words.",
    }),

  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long." })
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, {
      message:
        "Username must start with a letter or an underscore (_) and can only contain letters, numbers, and underscores (_).",
    }),

  email: z.string().email({ message: "Invalid email address." }),
  bio: z.string().max(250, { message: "Invalid email address." }),
  pFile: z.custom<File[]>(),
});
