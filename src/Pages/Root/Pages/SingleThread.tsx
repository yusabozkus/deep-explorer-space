import { useLocation, useOutletContext, useParams } from 'react-router-dom'
import ThoughtCard from '@/components/Cards/ThoughtCard';
import { IUser } from '@/Types';
import { useGetThoughtByID } from '@/Database/React Query/queries';
import GoBackButton from '@/components/Shared/GoBackButton';

const SingleThread = () => {

    const location = useLocation();
    const { id } = useParams()
    const user = useOutletContext<IUser>()
    const { post } = location.state || {}
    const { data: postByID } = useGetThoughtByID(id)

    if (!post && !postByID) return <p>not found</p>

    return (
        <div className='w-full p-4 flex flex-row gap-6 relative'>
            <GoBackButton />
            <div className='flex-1 flex flex-col gap-4 max-w-[650px] m-auto'>
                <ThoughtCard thought={post.creator && post ? post : postByID} user={user} hideComment={true} />
            </div>
        </div>
    )
}

export default SingleThread
