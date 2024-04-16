import React, { useState, useEffect, useRef } from 'react'
import { Video } from '../types';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'
import { BsPlay, BsFillPlayFill, BsFillPauseFill } from 'react-icons/bs';
import { GoVerified } from 'react-icons/go'

interface IProps {
    post: Video;
}
const VideoCard: NextPage<IProps> = ({ post }) => {
    const [isHover, setIsHover] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [isVideoMute, setIsVideoMute] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);

    const onVideoPress = () => {
        if (playing) {
            videoRef?.current?.pause();
            setPlaying(false);
        } else {
            videoRef?.current?.play();
            setPlaying(true);
        }
    }

    useEffect(() => {
        if (videoRef?.current) {
            videoRef.current.muted = isVideoMute;
        }
    }, [isVideoMute])

    return (
        <div className='flex flex-col border-b-2 border-gray-200 pb-6'>
            <div>
                <div className='flex gap-1 p-2 cursor-pointer font-semibold rounded'>
                    <div className='md:w-16 md:h-16 w-10 h-10'>
                        <Link href='/'>
                            <>
                                <Image
                                    width={50}
                                    height={50}
                                    className='rounded-full'
                                    src={post.postedBy.image}
                                    alt='profile photo'


                                />
                            </>
                        </Link>
                    </div>
                    <div>
                        <Link href="/">
                            <div className='flex items-center gap-2'>
                                <p className='flex gap-2 items-center md:text-md font-bold text-primary'>
                                    {post.postedBy.userName}{` `}
                                    <GoVerified className='text-blue-400 text-md' />
                                </p>
                                <p className='capitalize font-medium text-xs text-gray-500 hidden md:block'>{post.postedBy.userName}</p>

                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            <div className='lg:ml-20 flex gap-4 relative'>
                <div onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} className='rounded-3xl'>
                    <Link href={`/detail/${post._id}`}>
                        <video ref={videoRef} className='lg:w-[600px] h-[300px] md:h-[400px] lg:h-[530px] w-[200px] rounded-2xl cursor-pointer bg-gray-100 ' src={post.video.asset.url} loop  >
                        </video>
                    </Link>

                    {isHover && (
                        <div className='absolute gradient-mask-b-10% bottom-1 cursor-pointer gap-[100px] left-3 md:left-3 lg:left-[25px] flex lg:gap-[450px] lg:justify-between w-[100px] md:w-[50px] p-3'>
                            {playing ? (
                                <button onClick={onVideoPress}>
                                    <BsFillPauseFill className='text-black text-2xl lg:text-4xl' />
                                </button>
                            ) : (
                                <button onClick={onVideoPress}>
                                    <BsFillPlayFill className='text-black text-2xl lg:text-4xl' />
                                </button>
                            )}
                            {isVideoMute ? (
                                <button onClick={() => setIsVideoMute(false)}>
                                    <HiVolumeOff className='text-black text-2xl lg:text-4xl' />
                                </button>
                            ) : (
                                <button onClick={() => setIsVideoMute(true)}>
                                    <HiVolumeUp className='text-black text-2xl lg:text-4xl' />
                                </button>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default VideoCard