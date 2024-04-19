import React, { useEffect, useState } from 'react';
import { MdFavorite } from 'react-icons/md';
import { NextPage } from 'next';

import useAuthStore from '../store/authStore';

interface IProps {


    likes: any;
    // flex: string;
    handleLike: () => void;
    handleDislike: () => void;
}

const LikeButton: NextPage<IProps> = ({ likes, handleLike, handleDislike }) => {
    const [alreadyLiked, setAlreadyLiked] = useState(false);
    const { userProfile }: any = useAuthStore();
    const [likeCount, setLikeCount] = useState(Number);

    //const [like, setlike] = useState('');
    let filterLikes = likes?.filter((item: any) => item._ref === userProfile?._id);
    useEffect(() => {
        setLikeCount(likes.length);
        if (filterLikes?.length > 0) {

            setAlreadyLiked(true);

        } else {

            setAlreadyLiked(false);

        }


    }, [filterLikes, likes]);





    return (
        <div className={`flex gap-6`}>
            <div className='mt-4 flex flex-col justify-center items-center cursor-pointer'>
                {alreadyLiked ? (
                    <div className='bg-primary rounded-full p-2 md:p-4 text-[#F51997] ' onClick={() => { handleDislike; setLikeCount(likes.length - 1); setAlreadyLiked(false); }} >
                        <MdFavorite className='text-lg md:text-2xl' />
                    </div>
                ) : (
                    <div className='bg-primary rounded-full p-2 md:p-4 ' onClick={() => { handleLike; setLikeCount(likes.length + 1); setAlreadyLiked(true); }} >
                        <MdFavorite className='text-lg md:text-2xl' />
                    </div>
                )}
                <p className='text-md font-semibold '>{likeCount || 0}</p>
            </div>
        </div>
    );
};

export default LikeButton;