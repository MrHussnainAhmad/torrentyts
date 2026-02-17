import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/form-elements';
import { Eye, EyeOff } from 'lucide-react';

export default function SignIn() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { isSubmitting } } = useForm();

    const onSubmit = async (data: any) => {
        const res = await signIn('credentials', {
            redirect: false,
            username: data.username,
            password: data.password,
        });

        if (res?.error) {
            setError('Invalid credentials');
        } else {
            router.push('/admin/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg text-foreground">
            <div className="w-full max-w-md p-8 space-y-6 bg-dark-surface rounded-xl border border-dark-border">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-white">Admin Login</h1>
                    <p className="text-slate-400">Enter your credentials to access the dashboard</p>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md border border-red-500/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" {...register('username', { required: true })} className="bg-dark-bg" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                {...register('password', { required: true })}
                                className="bg-dark-bg pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
