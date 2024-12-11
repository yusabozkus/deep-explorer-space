import GoBackButton from '@/components/Shared/GoBackButton'
import ProfileUploader from '@/components/Shared/ProfileUploader'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useUserContext } from '@/Context/AuthProvider'
import { useGetUserByID, useUpdateUser } from '@/Database/React Query/queries'
import { UpdateUserValidation } from '@/Database/Validations'
import { IUser } from '@/Types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@nextui-org/button'
import { CircularProgress } from '@nextui-org/react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useOutletContext } from 'react-router-dom'
import { z } from 'zod'

const EditProfile = () => {

  const user = useOutletContext<IUser>();
  const { setUser } = useUserContext();
  const { mutateAsync: updateUser } = useUpdateUser();
  const { data: currentUser } = useGetUserByID(user.username);

  const form = useForm<z.infer<typeof UpdateUserValidation>>({
    resolver: zodResolver(UpdateUserValidation),
    defaultValues: {
      bio: user.bio || '',
      email: user.email || '',
      name: user.name || '',
      pFile: [],
      username: user.username || '',
    },
  });

  const handleUpdateProfile = async (value: z.infer<typeof UpdateUserValidation>) => {
    try {
      const updatedUser = await updateUser({
        id: currentUser.$id,
        name: value.name,
        bio: value.bio,
        pFile: value.pFile,
        username: value.username,
        profile: currentUser.profile,
        profile_id: currentUser.profile_id,
        email: currentUser.email,
      });

      if (!updatedUser) {
        throw new Error("Update failed.");
      }

      setUser({
        ...user,
        name: updatedUser.name,
        bio: updatedUser.bio,
        profile: updatedUser.profile,
        username: updatedUser.username,
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile.");
    }
  };

  if (!user || !currentUser) {
    return <CircularProgress />;
  }

  return (
    <div className='w-full p-4 flex flex-row gap-6 relative'>
      <GoBackButton />
      <div className='p-2 w-full max-w-[600px] m-auto flex flex-col gap-5'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdateProfile)} className='flex flex-col gap-5'>
            <div className='w-full flex flex-row items-center justify-between'>
              <h1 className='text-[2rem] font-bold text-white'>Edit Profile</h1>
              <Button type='submit'>Done</Button>
            </div>

            <FormField
              control={form.control}
              name="pFile"
              render={({ field }) => (
                <FormItem className="w-[280px]">
                  <FormControl>
                    <ProfileUploader fieldChange={field.onChange} mediaUrl={user.profile} />
                  </FormControl>
                  <FormMessage className="" />
                </FormItem>
              )}
            />

            <div className='flex flex-col gap-8'>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div>
                        <span className='text-[.85rem] font-semibold'>Name</span>
                        <input
                          {...field}
                          type="text"
                          className='w-full h-[50px] bg-transparent border border-[#464646] rounded-lg mt-2 px-4 text-[.9rem] font-normal focus:border-primary transition-all ease-linear' />
                      </div>
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
                      <div>
                        <span className='text-[.85rem] font-semibold'>Username</span>
                        <input
                          {...field}
                          type="text"
                          className='w-full h-[50px] bg-transparent border border-[#464646] rounded-lg mt-2 px-4 text-[.9rem] font-normal focus:border-primary transition-all ease-linear' />
                      </div>
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
                      <div>
                        <span className='text-[.85rem] font-semibold'>Email</span>
                        <input
                          {...field}
                          type="text"
                          className='w-full h-[50px] bg-transparent border border-[#464646] rounded-lg mt-2 px-4 text-[.9rem] font-normal focus:border-primary transition-all ease-linear'
                          defaultValue={user.email} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div>
                        <span className='text-[.85rem] font-semibold'>Bio</span>
                        <textarea
                          {...field}
                          rows={3}
                          className='resize-none p-3 w-full bg-transparent border border-[#464646] rounded-lg mt-2 px-4 text-[.9rem] font-normal focus:border-primary transition-all ease-linear'
                          defaultValue={user.bio} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default EditProfile
