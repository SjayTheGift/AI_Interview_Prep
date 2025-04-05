"use client"
import { useState } from "react"; // Import useState
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import FormFields from "./FormFields"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action"
import { Loader2 } from "lucide-react"

const authSchema = (type: FormType) => {
    return z.object({
        name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3),
    })
}

const AuthForm = ({ type }: { type: FormType }) => {
    const [loading, setLoading] = useState(false); // Loading state
    const router = useRouter();
    const formSchema = authSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true); // Start loading
        try {
            if (type === 'sign-up') {
                const { name, email, password } = values;
                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name: name!,
                    email,
                    password
                });

                if (!result?.success) {
                    toast.error(result?.message);
                    return;
                }

                toast.success("Account created successfully. Please Sign in.");
                router.push("/sign-in");
            } else {
                const { email, password } = values;
                const userCredentials = await signInWithEmailAndPassword(auth, email, password);
                const idToken = await userCredentials.user.getIdToken();

                if (!idToken) {
                    toast.error("Sign in failed");
                    return;
                }

                await signIn({
                    email,
                    idToken
                });

                toast.success("Sign in successfully.");
                router.push("/");
            }
        } catch (error) {
            console.log(error);
            toast.error(`There was an error: ${error}`);
        } finally {
            setTimeout(() => {
              setLoading(false);
          }, 3000); // Adjust duration as needed
        }
    }

    const isSignIn = type === "sign-in";

    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.svg" alt="logo" height={32} width={38} />
                    <h2 className="text-primary-100">PrepWise</h2>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                        {!isSignIn && 
                            <FormFields 
                                control={form.control} 
                                name="name" 
                                label="Name" 
                                placeholder="Your Name" 
                            />
                        }
                        <FormFields 
                            control={form.control} 
                            name="email" 
                            label="Email" 
                            placeholder="Enter Email"
                            type="email"
                        />
                        <FormFields 
                            control={form.control} 
                            name="password" 
                            label="Password" 
                            placeholder="Enter Password"
                            type="password"
                        />
                        
                        <Button type="submit" className="btn w-full" disabled={loading}>
                            {loading ? <Loader2  className="animate-spin" />  : (isSignIn ? 'Sign in' : "Create an Account")}
                        </Button>
                    </form>
                </Form>
                <p className="text-center">
                    {isSignIn ? 'No account yet?' : "Have an account already?"}
                    <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className="font-bold text-user-primary ml-1"> 
                        {!isSignIn ? 'Sign-In' : 'Sign-Up'}
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default AuthForm;