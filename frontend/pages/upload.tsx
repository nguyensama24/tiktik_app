import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import axios from 'axios';
import { SanityAssetDocument } from '@sanity/client';
import useAuthStore from '../store/authStore';
import { client } from '../utils/client';
import { topics } from '../utils/constants';
import { BASE_URL } from '../utils';

const upload = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [videoAsset, setVideoAsset] = useState<SanityAssetDocument | undefined>();
    const [wrongFileType, setWrongFileType] = useState(false);
    const [isLoadingBtn, setIsLoadingBtn] = useState(false);
    const [caption, setCaption] = useState('');
    const [category, setCategory] = useState(topics[0].name);
    const [savingPost, setSavingPost] = useState(false);
    const { userProfile }: { userProfile: any } = useAuthStore();
    const [topic, setTopic] = useState<String>(topics[0].name);
    const router = useRouter();

    const uploadVideo = async (e: any) => {
        const selectedFile = e.target.files[0];
        const fileTypes = ['video/mp4', 'video/webm', 'video/ogg']

        if (fileTypes.includes(selectedFile.type)) {
            setWrongFileType(false);
            setIsLoading(true);

            client.assets.upload('file', selectedFile, {
                contentType: selectedFile.type,
                filename: selectedFile.name,
            })
                .then((data) => {
                    setVideoAsset(data);
                    setIsLoading(false);
                })
        } else {
            setIsLoading(false);
            setWrongFileType(true);
        }
    }

    const handlePost = async () => {
        if (caption && videoAsset?._id && category) {
            setSavingPost(true);
            setIsLoadingBtn(true);
            const document = {
                _type: 'post',
                caption,
                video: {
                    _type: 'file',
                    asset: {
                        _type: 'reference',
                        _ref: videoAsset?._id
                    }
                },

                userId: userProfile?._id,
                postedBy: {
                    _type: 'postedBy',
                    _ref: userProfile?._id
                },
                topic: category
            }
            await axios.post(`${BASE_URL}/api/post`, document);

            router.push('/');
        }
    }


    const handleDiscard = () => {
        setSavingPost(false);
        setVideoAsset(undefined);
        setCaption('');
        setTopic('');
    };
    return (
        <div className='flex w-full h-full bg-[#F8F8F8] justify-center'>
            <div className='bg-white rounded-lg w-full flex flex-col gap-6 p-6'>
                <div>
                    <div>
                        <div>
                            <p className='text-2xl font-bold'>Upload Video</p>
                            <p className='text-md text-gray-400 mt-1'>Post a video to your account</p>
                        </div>
                    </div>
                    <div className='border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center p-6 cursor-pointer hover:border-red-300 hover:bg-gray-100'>
                        {isLoading ? (
                            <p>Uploading.....</p>
                        ) : (
                            <div>
                                {videoAsset ? (
                                    <div>
                                        <video src={videoAsset.url} loop controls className='rounded-xl h-[350px] bg-black'></video>
                                    </div>
                                ) : (
                                    <label className='cursor-pointer'>
                                        <div className='flex flex-col items-center justify-center '>
                                            <div className='flex flex-col items-center justify-center '>
                                                <p className='font-bold text-xl'>
                                                    <FaCloudUploadAlt className='text-gray-300 text-6xl' />
                                                </p>
                                                <p className='text-xl font-semibold'>
                                                    Upload Video
                                                </p>
                                            </div>
                                            <p className='text-gray-400 text-center mt-10 text-sm leading-10'>
                                                MP4 or WebM or ogg <br />
                                                720x1280 or higher <br />
                                                Up to 10 minutes <br />
                                                Less than 2GB
                                            </p>
                                            <p className='bg-[#F51997] text-center mt-4 rounded text-white text-md font-medium p-2 w-full outline-none'>
                                                Select File
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            name="upload-video"
                                            onChange={uploadVideo}
                                            className='w-0 h-0'

                                        />
                                    </label>
                                )}
                            </div>
                        )}
                        {wrongFileType && (
                            <p className='text-center text-xl text-red-400 font-semibold mt-4'>
                                Please select a video file
                            </p>
                        )}
                    </div>

                </div>
                <div className='flex flex-col gap-3 pb-10'>
                    <label className='text-md font-medium '>Caption</label>
                    <input
                        type="text"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className='rounded outline-none text-md border-2 border-gray-200 p-2'
                    />
                    <label className='text-md font-medium'> Choose a Category</label>
                    <select
                        onChange={(e) => setCategory(e.target.value)}
                        className='outline-none border-2 border-gray-200 text-md capitalize p-2 rounded cursor-pointer'
                    >
                        {topics.map((topic) => (
                            <option
                                key={topic.name}
                                className='outline-none capitalize bg-white text-gray-700 text-md p-2 hover:bg-slate-300'
                                value={topic.name}
                            >
                                {topic.name}
                            </option>
                        ))}
                    </select>
                    <div className='flex gap-6 mt-10'>

                        <button
                            onClick={handleDiscard}
                            type='button'
                            className='border-gray-300 border-2 text-md font-medium p-2 rounded w-full outline-none'
                        >
                            Discard
                        </button>
                        <button
                            onClick={handlePost}
                            type='button'
                            className={`${isLoadingBtn ? ('bg-[#7e3a60]') : ('bg-[#F51997]')} text-white text-md font-medium p-2 rounded w-full outline-none`}
                            disabled={isLoadingBtn}
                        >
                            {isLoadingBtn ? (
                                <div role="status">
                                    <svg
                                        aria-hidden="true"
                                        className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-pink-600"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"
                                        />
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                            ) : (
                                <>
                                    Post
                                </>

                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default upload