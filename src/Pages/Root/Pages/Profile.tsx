import ArticleCard from '@/components/Cards/ArticleCard'
import ThoughtCard from '@/components/Cards/ThoughtCard'
import FollowButton from '@/components/Shared/FollowButton'
import { useGetUserByID } from '@/Database/React Query/queries'
import { IUser } from '@/Types'
import { Avatar, AvatarGroup, Button, Spinner, Tab, Tabs, user } from '@nextui-org/react'
import { Models } from 'appwrite'
import { MoreVertical } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'

const Profile = () => {

    const { username } = useParams();
    const { data: currentUser, refetch } = useGetUserByID(username);
    const user = useOutletContext<IUser>();

    const [followersCount, setFollowersCount] = useState<number>(0);

    useEffect(() => {
        if (currentUser) {
            setFollowersCount(currentUser.followers.length); // Başlangıç takipçi sayısı
        }
    }, [currentUser]);

    useEffect(() => {
        refetch();
    }, [username]);

    if (!currentUser) {
        return <Spinner />;
    }

    const handleFollowChange = (isFollowing: boolean) => {
        setFollowersCount((prev) => (isFollowing ? prev + 1 : prev - 1));
    };

    return (
        <section className='max-w-[600px] w-full m-auto mt-10 px-3 lg:px-0'>
            <div className='flex flex-row justify-between items-center'>
                <div>
                    <h1 className='text-[1.4rem] font-semibold'>{currentUser.name}</h1>
                    <h2 className='text-[.9rem] font-normal text-default-500'>@{currentUser.username}</h2>
                </div>
                <Avatar
                    src={currentUser.profile}
                    className='w-[80px] h-[80px]' />
            </div>
            <div className='mt-6 mb-6'>
                <h3 className='text-[.9rem] text-[#eeeeee] font-normal'>{currentUser.bio}</h3>
                <div className='flex flex-row items-center gap-2 my-5'>
                    <p className='text-[.8rem] text-default-500'>{followersCount} Followers</p>
                    <p className='text-[.6rem] text-default-500 mt-[2px]'>•</p>
                    <p className='text-[.8rem] text-default-500 '>Socials</p>
                </div>
                <AvatarGroup max={3}>
                    {currentUser.followers.map((follower: Models.Document) => (
                        <Avatar classNames={{ base: "w-[30px] h-[30px]", icon: "w-[30px] h-[30px]", img: "w-[30px] h-[30px] object-cover" }} src={follower.follower.profile} />
                    ))}
                </AvatarGroup>
            </div>

            <div>
                {currentUser.$id === user.id ?
                    <div className='w-full flex flex-row gap-2'>
                        <Button
                            variant='solid'
                            color='primary'
                            className='w-full font-medium'>
                            New post
                        </Button>
                        <Button
                            variant='solid'
                            color='default'
                            className='w-full font-medium'>
                            <Link to={"/profile/edit"} className='w-full h-full flex items-center justify-center text-center'>
                                Edit Profile
                            </Link>
                        </Button>
                        <Button isIconOnly>
                            <MoreVertical />
                        </Button>
                    </div>
                    :
                    <div className='w-full flex flex-row gap-2'>
                        <FollowButton
                            user={user}
                            followerList={currentUser.followers}
                            followed={currentUser.$id}
                            follower={user.id}
                            onFollowChange={handleFollowChange} // Prop iletildi
                        />
                        <Button
                            variant='solid'
                            color='default'
                            className='w-full font-medium'>
                            Donate
                        </Button>
                        <Button isIconOnly>
                            <MoreVertical />
                        </Button>
                    </div>}
            </div>

            <div className='mt-10'>
                <Tabs
                    fullWidth
                    size="lg"
                    aria-label="Options"
                    color="primary"
                    className="border-border sticky top-[80px] z-50 backdrop-blur-sm rounded-lg"
                    classNames={{
                        tabContent: "text-gray text-[.9rem] font-medium",
                        wrapper: "bg-red-50"
                    }}
                    variant="underlined">
                    <Tab
                        className='w-full'
                        key="posts"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>Posts</span>
                            </div>
                        }
                    >

                        {currentUser.thoughts.map((item) => (
                            <ThoughtCard thought={item} user={user} key={item.$id} hideCreator={true} />
                        ))}


                    </Tab>
                    <Tab
                        key="articles"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>Articles</span>
                            </div>
                        }

                    >

                        <div className='mt-10'>
                            {currentUser.articles.map((item) => (
                                <ArticleCard article={item} key={item.$id} isCreator user={currentUser} />
                            ))}
                        </div>
                    </Tab>
                    <Tab
                        key="activity"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>Activity</span>
                            </div>
                        }
                    >
                        <p>asdsada</p>
                    </Tab>
                    <Tab
                        key="likes"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>Likes</span>
                            </div>
                        }
                    />
                </Tabs>
            </div>
        </section>
    )
}

export default Profile
