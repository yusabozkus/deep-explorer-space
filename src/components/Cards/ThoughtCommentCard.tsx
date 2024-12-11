import { timeAgo } from '@/Database/utils'
import { Models } from 'appwrite'
import React from 'react'

const ThoughtCommentCard = ({ comment }: { comment: Models.Document }) => {
    return (
        <div className='mb-4 flex flex-row gap-3'>
            <img className='w-[35px] h-[35px] rounded-full object-cover' src={comment.creator.profile} alt="" />
            <div>
                <div className='flex flex-row items-center'>
                    <p className='text-white text-[.8rem] font-semibold'>@{comment.creator.username}</p>
                    <p className='text-white text-[.8rem] font-semibold mx-2'>•</p>
                    <p className='text-white text-[.8rem] font-semibold'>{timeAgo(comment.$createdAt)}</p>
                </div>
                <p className='text-white text-[.8rem] font-light mt-2'>{comment.comment}</p>
            </div>
        </div>
    )
}

export default ThoughtCommentCard
