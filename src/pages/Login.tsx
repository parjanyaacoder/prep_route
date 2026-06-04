import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '../api/services';
import { loginSuccess } from '../store/slices/authSlice';
import { Card } from '../components/ui/Card';
import type { RootState } from '../store/store';

const loginSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      const response = await authService.login(data);
      
      // The API returns { "status": "success" }, not a boolean "success: true"
      if (response.status === 'success' && response.data) {
        dispatch(loginSuccess({
          user: response.data.user || { id: data.userId },
          token: response.data.token,
        }));
        navigate('/dashboard');
      } else {
        setError('Invalid login response. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    }
  };

  return (
    <div className='min-h-screen w-full flex bg-[rgb(248,251,255)]'>
      <div className='flex w-1/2 items-center justify-center' >
        <img
          src="/login_image.webp"
          alt="Login Graphic"
          className="w-full max-w-[467px] aspect-[467/344] object-contain"
        />
      </div>

      <div className='flex w-1/2 justify-center items-center m-[10px]' >
        <Card className='bg-white w-full h-full border-[0.5px] border-[#60A5FA] rounded-[8px] flex items-center justify-center'>
          <div className='w-full max-w-[510px] flex flex-col items-start'>
            <img
              src="/preproute_logo.webp"
              alt="Login Graphic"
              className="w-full max-w-[134px] aspect-[134/33]  object-contain mb-[30px]"
            />
            <h2 className="font-sans font-semibold text-2xl leading-normal tracking-normal text-[#374151] mb-[20px]">
              Login
            </h2>
            <p className="font-sans font-normal text-xs leading-normal tracking-normal text-[#374151]  mb-[30px]">
              Use your company provided Login credentials
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-start">
              <label className="block font-sans font-medium text-base leading-normal tracking-normal text-[#374151] mb-[15px]">
                User ID
              </label>
              <input
                type="text"
                {...register('userId')}
                placeholder="Enter User ID"
                className="w-full h-12 border-[0.5px] border-[#9CA3AF] rounded-lg p-4 outline-none focus:border-blue-500 font-sans font-medium text-base leading-normal placeholder:text-[#D1D5DB] text-[#374151] mb-[30px]"
              />

              <label className="block font-sans font-medium text-base leading-normal tracking-normal text-[#374151] mb-[15px]">
                Password
              </label>
              <input
                type="password"
                {...register('password')}
                placeholder="Enter Password"
                className="w-full h-12 border-[0.5px] border-[#9CA3AF] rounded-lg p-4 outline-none focus:border-blue-500 font-sans font-medium text-base leading-normal placeholder:text-[#D1D5DB] text-[#374151] mb-[30px]"
              />

              <a href="#" className="self-end block font-sans font-normal text-sm leading-normal tracking-normal text-[#1B5DEF] mb-[30px] hover:underline">
                Forgot password?
              </a>

              {error && (
                <div className="w-full p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600 text-center mb-[20px]">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 bg-[#5988EF] rounded-lg flex justify-center items-center font-sans font-medium text-base leading-normal text-[#FAFAFA] hover:bg-[#4774D6] transition-colors disabled:opacity-70"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </form>

          </div>
        </Card>
      </div>
    </div>
  );
}
