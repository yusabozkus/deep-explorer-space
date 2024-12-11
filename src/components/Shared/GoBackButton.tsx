import { Button } from '@nextui-org/button'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const GoBackButton = () => {

    const navigate = useNavigate()

    return (
        <Button className='text-[.8rem] font-medium text-white items-center hover:bg-white hover:text-black fixed top-26 left-26 hidden lg:flex' onPress={() => navigate(-1)}>
            <ChevronLeft size={18} />
            Go Back
        </Button>
    )
}

export default GoBackButton
