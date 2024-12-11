import { IUser } from '@/Types';
import { Button } from '@nextui-org/button';
import { Textarea } from '@nextui-org/input';
import { Image, MapPin, Smile, X, Video } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import EmojiPicker from 'emoji-picker-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UserThoughtValidation } from '@/Database/Validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { useCreateThought } from '@/Database/React Query/queries';

const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 30 MB

const Create = ({ user }: { user: IUser }) => {

    const { mutateAsync: saveUserThought, isSuccess: thoughtSaveSuccess, isError: thoughtSaveError } = useCreateThought()

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const videoInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
    const [userLocation, setUserLocation] = useState<{ country: string | null; city: string | null }>({ country: null, city: null });
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [userThougth, setUserThougth] = useState("");

    const form = useForm<z.infer<typeof UserThoughtValidation>>({
        resolver: zodResolver(UserThoughtValidation),
        defaultValues: {
            caption: "",
            location: "",
            images: [],
            video: null,
        },
    });

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && !selectedVideo) {
            const newFiles = Array.from(files);
            const updatedImages = [...selectedImages, ...newFiles].slice(0, 5);
            setSelectedImages(updatedImages);
            form.setValue("images", updatedImages);
        } else if (selectedVideo) {
            toast.error('You cannot select images when a video is selected.');
        }
    };

    const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > MAX_VIDEO_SIZE) {
                toast.error('Video size cannot exceed 30 MB.');
                return;
            }
            if (selectedImages.length > 0) {
                toast.error('You cannot select a video when images are selected.');
                return;
            }
            setSelectedVideo(file);
            form.setValue("video", file);
        }
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = selectedImages.filter((_, i) => i !== index);
        setSelectedImages(updatedImages);
        form.setValue("images", updatedImages);
    };

    const handleRemoveVideo = () => {
        setSelectedVideo(null);
        form.setValue("video", null);
    };

    const handleGetLocation = () => {
        if (userLocation.city && userLocation.country) {
            setUserLocation({ city: "", country: "" });
            form.setValue("location", '');
        } else {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        console.log('Location data:', position.coords);
                        const { latitude, longitude } = position.coords;
                        const apiKey = 'AIzaSyAiiagD-j60yoXsUF1_iRKdKb8E0TAt668';
                        try {
                            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`)

                            if (response.data.status === 'OK') {
                                const addressComponents = response.data.results[0].address_components;
                                const country = addressComponents.find(component => component.types.includes('country'));
                                const city = addressComponents.find(component => component.types.includes('locality') || component.types.includes('administrative_area_level_1'));

                                setUserLocation({ city: country?.long_name, country: city?.long_name });
                                form.setValue("location", `${country?.long_name}, ${city?.long_name}`);

                            } else {
                                toast.error('Address could not be retrieved:', response.data.status);
                            }
                        } catch (error) {
                            toast.error('API error:', error);
                        }
                    },
                    (error) => {
                        toast.error('Location could not be retrieved:', error);
                    }
                );
            } else {
                toast.error('Browser does not support location services.');
            }
        }
    };

    const handleSubmitForm = async (data: z.infer<typeof UserThoughtValidation>) => {
        if (data.caption !== "") {
            // Show a loading toast while submitting

            try {
                // Save the thought and wait for all file uploads to complete
                const thoughtData = await saveUserThought({
                    caption: data.caption,
                    images: data.images,
                    video: data.video,
                    location: data.location,
                    user: user.id
                });

                form.reset(); // Reset form data
                setSelectedImages([]); // Clear uploaded images
                setSelectedVideo(null); // Clear uploaded video

            } catch (error) {
                console.error("Error saving thought:", error);
            }
        }
    };




    return (
        <div className='w-full p-5 bg-card border border-border rounded-xl'>
            <Form {...form}>
                <form className='w-full' onSubmit={form.handleSubmit(handleSubmitForm)}>
                    <div className='flex flex-row gap-4'>
                        <img className='w-[45px] h-[45px] rounded-full' src={user.profile} alt={user.name} />
                        <FormField
                            control={form.control}
                            name='caption'
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            minRows={2}
                                            max={4000}
                                            min={10}
                                            variant='flat'
                                            className='bg-input rounded-xl border-none outline-none text-white'
                                            placeholder="What's on your mind?"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* Image and video previews */}
                    {selectedImages.length > 0 && !selectedVideo && (
                        <motion.div initial={{ scale: .8 }} animate={{ scale: 1 }} className='flex flex-row gap-2 mt-4'>
                            <AnimatePresence>
                                {selectedImages.map((image, index) => (
                                    <motion.div
                                        initial={{ scale: .8 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        key={index}
                                        className='relative'>
                                        <img src={URL.createObjectURL(image)} alt={`Selected Image ${index + 1}`} className='w-16 h-16 object-cover rounded-md' />
                                        <div onClick={() => handleRemoveImage(index)} className='cursor-pointer absolute top-[2px] right-[2px] bg-[#181818a4] p-1 rounded-full backdrop-blur-sm'>
                                            <X className='stroke-red-500' size={15} />
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                    {selectedVideo && (
                        <AnimatePresence>
                            <motion.div
                                initial={{ scale: .8 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className='relative w-28 h-28 mt-3'>
                                <video controls src={URL.createObjectURL(selectedVideo)} className='w-full h-full object-cover rounded-md' />
                                <div onClick={handleRemoveVideo} className='cursor-pointer absolute top-[2px] right-[2px] bg-[#181818a4] p-1 rounded-full backdrop-blur-sm'>
                                    <X className='stroke-red-500' size={15} />
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}
                    {/* Buttons for selecting files */}
                    <div className='flex flex-row w-full justify-between items-center mt-4'>
                        <div className='relative'>
                            <Button
                                isIconOnly
                                variant='light'
                                color='primary'
                                className='px-0 group'
                                onPress={() => fileInputRef.current?.click()}>
                                <Image size={23} className='stroke-default-500 group-hover:stroke-white transition-all ease-linear' />
                            </Button>
                            <Button
                                isIconOnly
                                variant='light'
                                color='primary'
                                className='px-0 group'
                                onPress={() => videoInputRef.current?.click()}>
                                <Video size={23} className='stroke-default-500 group-hover:stroke-white transition-all ease-linear' />
                            </Button>
                            <Button onPress={handleGetLocation} isIconOnly variant='light' color='primary' className='px-0 group'>
                                <MapPin size={23} className='stroke-default-500 group-hover:stroke-white transition-all ease-linear' />
                            </Button>
                            <Button onPress={() => setOpenEmojiPicker(!openEmojiPicker)} isIconOnly variant='light' color='primary' className='px-0 group'>
                                <Smile size={23} className='stroke-default-500 group-hover:stroke-white transition-all ease-linear' />
                            </Button>
                            <FormField
                                control={form.control}
                                name="images"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                style={{ display: 'none' }}
                                                onChange={(event) => {
                                                    field.onChange(event);
                                                    handleImageUpload(event);
                                                }}
                                                accept="image/*"
                                                multiple
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="video"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <input
                                                type="file"
                                                ref={videoInputRef}
                                                style={{ display: 'none' }}
                                                onChange={(event) => {
                                                    field.onChange(event);
                                                    handleVideoUpload(event);
                                                }}
                                                accept="video/*"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='absolute top-12'>
                                <EmojiPicker
                                    onEmojiClick={(e) => setUserThougth(userThougth + e.emoji)}
                                    open={openEmojiPicker}
                                    theme='dark'
                                    lazyLoadEmojis
                                />
                            </div>
                        </div>
                        <div>
                            <Button type='submit' variant='bordered' color='default' size='md' className='text-default-500'>
                                Post
                            </Button>
                        </div>
                    </div>
                    {userLocation.city && userLocation.country && (
                        <AnimatePresence>
                            <div className='mt-4 flex flex-row items-center gap-2'>
                                <motion.div initial={{ scale: .8 }} animate={{ scale: 1 }} exit={{ scale: 0, opacity: 0 }}>
                                    <MapPin size={15} />
                                </motion.div>
                                <motion.p
                                    initial={{ scale: .8 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className='text-default-500 text-[.8rem] mt-[2px] font-light'>
                                    {userLocation.country}, {userLocation.city}
                                </motion.p>
                            </div>
                        </AnimatePresence>
                    )}
                </form>
            </Form>
        </div>
    );
};

export default Create;
