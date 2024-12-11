import { Button } from '@nextui-org/button'
import { Bell } from 'lucide-react'
import { useEffect } from 'react';

const MobileTopbar = () => {

    return (
        <header className='w-full py-3 backdrop-blur-sm flex flex-row items-center justify-between px-4'>
            <div className='flex flex-row items-center'>
                <img className="h-[25px]" src="/images/logo.png" alt="" />
            </div>
            <Button size='sm' variant='light' isIconOnly>
                <Bell size={20} />
            </Button>
        </header>
    )
}

export default MobileTopbar
