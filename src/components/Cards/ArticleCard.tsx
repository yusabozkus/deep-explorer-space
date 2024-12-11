import { timeAgo } from '@/Database/utils'
import { Avatar, Button, Skeleton, Tooltip } from '@nextui-org/react'
import { Models } from 'appwrite'
import { BadgeCheck, Bookmark, CircleMinus, Clock8, MessageCircle, MoreVertical } from "lucide-react"
import { Link } from 'react-router-dom'

const ArticleCard = ({ article, isCreator = false, user }: { article: Models.Document, isCreator?: boolean, user: Models.Document }) => {
    // İlk <img> etiketinin src'sini almak için regex kullanımı
    const firstImageSrc = article.inner.match(/<img[^>]+src="([^">]+)"/)?.[1];

    if (!article || !article.success_votes) {
        return (
            <article className="flex flex-row gap-20 mt-10 w-full">
                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex flex-row items-center gap-3">
                        <Skeleton className='rounded-full w-[35px] h-[35px]' />
                        <Skeleton className="w-full max-w-[200px] h-[20px] rounded-lg" />
                    </div>
                    <div className="mt-">
                        <Skeleton className="w-full h-[40px] rounded-lg" />
                        <Skeleton className="w-full h-[20px] mt-2 rounded-lg" />
                    </div>
                    <div className="flex flex-row gap-3">
                        <Skeleton className="w-[120px] h-[20px] rounded-lg" />
                        <Skeleton className="w-[80px] h-[20px] rounded-lg" />
                        <Skeleton className="w-[80px] h-[20px] rounded-lg" />
                    </div>
                </div>
                <div className="w-[150px] h-[150px]">
                    <Skeleton className="w-full h-full rounded-lg" />
                </div>
            </article>
        )
    }

    if (isCreator && !user) {
        return <p>user loading</p>
    }

    return (
        <article className="w-full h-full">
            <Link className='w-full h-full flex flex-row gap-0 lg:gap-20 items-center' to={`/article/${article.$id}`}>
                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex flex-row items-center gap-3">

                        <Avatar className='w-[25px] h-[25px] lg:w-[35px] lg:h-[35px]' size='sm' src={isCreator ? user.profile : article.creator?.profile} />
                        <h3 className="text-gray font-normal mt-[2px] text-[.9rem] lg:text-[1rem]">{isCreator ? user.name : article.creator?.name}</h3>
                    </div>
                    <div className='mr-2'>
                        <h1 className="text-[1.5rem] lg:text-[1.7rem] font-bold text-white line-clamp-2">{article.title}</h1>
                        <h2 className="text-[.85rem] lg:text-[.95rem] font-medium text-default-500 line-clamp-2">{article.subtitle}</h2>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row gap-3">
                            <Tooltip
                                closeDelay={100}
                                classNames={{
                                    content: "bg-card border border-border"
                                }}
                                content={
                                    <div className="px-1 py-2 flex flex-col">
                                        <div className="flex flex-rows items-center gap-2">
                                            <Clock8 color="#fff" strokeWidth={2} size={17} />
                                            <p className="font-semibold text-[.8rem] mt-[2px]">Date of sharing</p>
                                        </div>
                                        <h4 className="text-[1rem] font-normal text-white mt-1">{timeAgo(article.$createdAt)}</h4>
                                    </div>
                                }>
                                <div className="cursor-pointer transition-all ease-linear flex flex-row gap-2 items-center bg-transparent border-transparent hover:bg-card border hover:border-border p-1 rounded-lg">
                                    <Clock8 color="#71717A" strokeWidth={2} size={15} />
                                    <h4 className="text-[.75rem] font-normal text-default-500 w-[60px] lg:w-max overflow-hidden text-ellipsis whitespace-nowrap">{timeAgo(article.$createdAt)}</h4>
                                </div>
                            </Tooltip>
                            <Tooltip
                                closeDelay={100}
                                classNames={{
                                    content: "bg-card border border-border"
                                }}
                                content={
                                    <div className="px-1 py-2 flex flex-col">
                                        <div className="flex flex-rows items-center gap-2">
                                            <BadgeCheck color="#fff" strokeWidth={2} size={17} />
                                            <p className="font-semibold text-[.8rem] mt-[2px]">Successfull votes</p>
                                        </div>
                                        <h4 className="text-[1rem] font-normal text-white mt-1">345</h4>
                                    </div>
                                }>
                                <div className="cursor-pointer transition-all ease-linear flex flex-row gap-2 items-center bg-transparent border-transparent hover:bg-card border hover:border-border p-1 rounded-lg">
                                    <BadgeCheck color="#71717A" strokeWidth={2} size={15} />
                                    <h4 className="text-[.75rem] font-normal text-default-500">345</h4>
                                </div>
                            </Tooltip>
                            <Tooltip
                                closeDelay={100}
                                classNames={{
                                    content: "bg-card border border-border"
                                }}
                                content={
                                    <div className="px-1 py-2 flex flex-col">
                                        <div className="flex flex-rows items-center gap-2">
                                            <MessageCircle color="#fff" strokeWidth={2} size={17} />
                                            <p className="font-semibold text-[.8rem] mt-[2px]">Comments</p>
                                        </div>
                                        <h4 className="text-[1rem] font-normal text-white mt-1">345</h4>
                                    </div>
                                }>
                                <div className="cursor-pointer transition-all ease-linear flex flex-row gap-2 items-center bg-transparent border-transparent hover:bg-card border hover:border-border p-1 rounded-lg">
                                    <MessageCircle color="#71717A" strokeWidth={2} size={15} />
                                    <h4 className="text-[.75rem] font-normal text-default-500">345</h4>
                                </div>
                            </Tooltip>
                        </div>
                        <div className='hidden lg:flex'>
                            <Tooltip
                                closeDelay={100}
                                content="Show less like this"
                                classNames={{
                                    content: "bg-card border border-border"
                                }}>
                                <Button variant="light" size="sm" isIconOnly>
                                    <CircleMinus color="#71717A" size={20} />
                                </Button>
                            </Tooltip>
                            <Tooltip
                                closeDelay={100}
                                content="Save"
                                classNames={{
                                    content: "bg-card border border-border"
                                }}>
                                <Button variant="light" size="sm" isIconOnly>
                                    <Bookmark color="#71717A" size={20} />
                                </Button>
                            </Tooltip>
                            <Tooltip
                                closeDelay={100}
                                content="More"
                                classNames={{
                                    content: "bg-card border border-border"
                                }}>
                                <Button variant="light" size="sm" isIconOnly>
                                    <MoreVertical color="#71717A" size={20} />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                </div>
                <div className="w-[100px] h-[100px] lg:w-[150px] lg:h-[150px]">
                    <img src={firstImageSrc || "https://miro.medium.com/v2/resize:fit:720/format:webp/1*E_7vA7D7ejXRutj6LY3ZDg.png"} className="object-cover w-full h-full rounded-xl" alt="" />
                </div>
            </Link>
        </article>
    );
}

export default ArticleCard;