import { timeAgo } from '@/Database/utils';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Skeleton, Avatar } from "@nextui-org/react";
import { Models } from 'appwrite';
import { HiOutlineBookmark } from "react-icons/hi";
import { MdMoreVert } from "react-icons/md";
import ItemStats from '../Shared/ItemStats';
import { MediaPlayer, MediaProvider, Poster } from "@vidstack/react";
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { IUser } from '@/Types';
import { useDeleteThought } from '@/Database/React Query/queries';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ThoughtCard = ({ thought, user, hideCreator = false, hideComment }: { thought: Models.Document, user: IUser, hideCreator?: boolean, hideComment?: boolean }) => {

    const { mutateAsync: deleteThought } = useDeleteThought()


    if (!thought && !thought?.likes) {
        return (
            <article className='bg-card border border-border rounded-lg'>
                <div className='flex flex-row w-full justify-between'>
                    <div className='flex flex-row items-center gap-3'>
                        <Skeleton className='w-[45px] h-[45px] rounded-full' />
                        <div>
                            <Skeleton className='w-[200px] h-[19px] rounded-lg' />
                            <Skeleton className='w-[200px] h-[19px] mt-1 rounded-lg' />
                        </div>
                    </div>
                </div>
                <div className='mt-5'>
                    <Skeleton className='w-[80%] h-[25px] rounded-full' />
                    <Skeleton className='w-full h-[300px] mt-2 rounded-xl' />
                    <section className='flex flex-col'>
                        <div className='w-full p-1 mt-5 flex flex-row items-center gap-2'>
                            <Skeleton className='w-full h-[30px] rounded-lg' />
                            <Skeleton className='w-full h-[30px] rounded-lg' />
                            <Skeleton className='w-full h-[30px] rounded-lg' />
                        </div>
                    </section>
                </div>
            </article>
        );
    }

    const handleDeletePost = async () => {
        try {
            const toastId = toast.loading("Deleting thought...");
            await deleteThought(thought.$id);
            toast.success("Thought deleted successfully!", { id: toastId });
        } catch (error) {
            toast.error("Failed to delete thought!");
        }
    };

    return (
        <motion.article layoutId={thought.$id} className='border-b pb-[30px] mb-[30px] border-border relative cursor-pointer'>
            {!hideCreator &&
                <div className='flex flex-row w-full justify-between'>
                    <Link to={`/${thought.creator.username}`}>
                        <div className='flex flex-row items-center gap-3'>
                            <Avatar size='md' src={thought.creator.profile} />
                            <div>
                                <h1 className='text-white text-[.9rem] font-semibold'>{thought.creator.name}</h1>
                                <div className='mt-[2px] flex flex-row items-center gap-2'>
                                    <span className='text-default-500 text-[.75rem] font-light'>{timeAgo(thought.$createdAt)}</span>
                                    <p className='text-default-500 text-[.75rem] mt-[2px]'>•</p>
                                    <span className='text-gray text-[.75rem] font-light'>{thought.location ? thought.location : thought.creator.username}</span>
                                </div>
                            </div>
                        </div></Link>

                    <div className='flex flex-row'>
                        <Button isIconOnly size='sm' variant='light'>
                            <HiOutlineBookmark size={20} strokeWidth={2} color='#d6d6d6' />
                        </Button>
                        <Dropdown className='bg-card border border-border'>
                            <DropdownTrigger>
                                <Button isIconOnly size='sm' variant='light'>
                                    <MdMoreVert size={20} color='#d6d6d6' />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                variant='flat'
                                aria-label="Action event example"
                            >
                                <DropdownItem key="report">Report Post</DropdownItem>
                                {thought.creator.$id === user.id && <DropdownItem onPress={handleDeletePost} key="delete" className="text-danger" color="danger">
                                    Delete file
                                </DropdownItem>}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            }
            <div className='mt-5'>
                <Link to={`/threads/${thought.$id}`} state={{ post: thought }}>
                    <motion.article className="post-card">
                        <h2>{thought.caption}</h2>
                    </motion.article>
                </Link>

                {thought.images.length > 0 &&
                    <PhotoProvider>
                        <div className={`${thought.images.length === 1 ? "grid-rows-1" : thought.images.length === 2 ? "grid-cols-2 " : "grid-cols-2 grid-rows-2"} w-full grid gap-1 mt-4 relative max-h-[400px] h-full`}>
                            {thought.images.slice(0, 3).map((image, index) => (
                                <div key={index} className={`${index === 0 ? "row-span-2" : ""} relative w-full h-full`}>
                                    <PhotoView src={image}>
                                        <img
                                            className='border border-border w-full h-full object-cover rounded-xl brightness-75 hover:brightness-95 transition-all ease-linear cursor-pointer'
                                            src={image}
                                            alt={`Image ${index + 1}`}
                                        />
                                    </PhotoView>
                                    {index === 2 && thought.images.length > 3 && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 hover:bg-opacity-10 transition-all ease-linear flex items-center justify-center rounded-xl">
                                            <span className="text-white text-xl font-semibold">+{thought.images.length - 3}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Görüntülenmeyen diğer resimleri gizli bir şekilde PhotoView içinde listele */}
                        {thought.images.slice(3).map((image, index) => (
                            <PhotoView key={`hidden-${index}`} src={image}>
                                {/* Görünmeyen PhotoView bileşenleri */}
                                <img style={{ display: 'none' }} src={image} alt={`Hidden Image ${index + 4}`} />
                            </PhotoView>
                        ))}
                    </PhotoProvider>
                }
                {thought.video_url && (
                    <div className='relative w-full mt-4'>
                        <MediaPlayer
                            src={thought.video_url}
                            viewType='video'
                            streamType='on-demand'
                            className='flex items-center justify-center object-contain w-full'
                            logLevel='warn'
                            crossOrigin
                            playsInline
                        >
                            <MediaProvider className='border border-border w-full'>
                                <Poster className="vds-poster rounded-xl w-full" />
                            </MediaProvider>
                            <DefaultVideoLayout
                                className='rounded-xl w-full'
                                thumbnails={thought.video_url}
                                icons={defaultLayoutIcons}
                            />
                        </MediaPlayer>
                    </div>
                )}
                <ItemStats thought={thought} user={user} hideComment={hideComment} />
            </div>
        </motion.article>
    );
};

export default ThoughtCard;
