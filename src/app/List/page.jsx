'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import useSWR from "swr";
import styles from "@/css/style.css";
import Image from "next/image";


const fetcher = async (url) => {
    return await axios
        .get(url, {
            auth: {
                username: process.env.BASE_Login,
                password: process.env.BASE_passWord
            }
        })
        .then((res) => res.data)
        .catch((error) => {
            if (error.response.status !== 409) throw error;
        });
};


export default function Home() {
    const [showModal, setShowModal] = useState(false);
    const [Title, setName] = useState('');
    const [Description, setDescription] = useState('');
    const [Studio, setStudio] = useState('');
    const [dayset, setday] = useState('Monday');
    const [Time, setTime] = useState('');
    const [Episode, setEpisode] = useState('');
    const [filePath, setfilePath] = useState();
    const [Season, setSeason] = useState();
    const [data, setData] = useState();
    const [isLoading, setLoading] = useState(true);
 

    useEffect(() => {
        const Apicaller = async () => {
            await axios({
                method: 'get',
                url: `api/data/schedule`, 
                auth: {
                    username: process.env.BASE_Login,
                    password: process.env.BASE_passWord
                  }

            }).then(response => {
                setLoading(false);
                setData(response.data);
            }).catch(error => {
                console.log("Error In Post Data getItems", error);
            });
        }
        Apicaller();
    }, [])


    //   const { data, error, isLoading } = useSWR(
    //     `/api/data/weeklyTreading`,
    //     fetcher
    //   );


    const deleteList = (Id) => {
        console.log(Id);

        var bodyFormData = new FormData();
        bodyFormData.append('id', Id);


        axios({
            method: 'delete',
            url: `api/data/schedule`,
            data: bodyFormData,
            auth: {
                username: process.env.BASE_Login,
                password: process.env.BASE_passWord
            }

        }).then(response => {
            console.log("getItems response:-", response.data.message, "Delete");

            // setData(response.data.Items);
        }).catch(error => {
            console.log("Error In Post Data getItems", error);
        });
    }

    const handleFileChange = (event) => {
        setfilePath(event.target.files[0])
    };

    const submitData = async (event) => {
        event.preventDefault();
        const base64 = await convertToBase64(filePath);
        var bodyFormData = new FormData();
        bodyFormData.append('title', Title);
        bodyFormData.append('profile_img', base64);
        bodyFormData.append('description', Description);
        bodyFormData.append('day', dayset);
        bodyFormData.append('Time', Time);
        bodyFormData.append('Studio', Studio);
        bodyFormData.append('Season', Season);

        await axios({
            method: 'post',
            url: `api/data/schedule`,
            data: bodyFormData,
            auth: {
                username: process.env.BASE_Login,
                password: process.env.BASE_passWord
              }

        }).then(response => {
            console.log("getItems response:-", response.data, "done");
            // setData(response.data.Items);
        }).catch(error => {
            console.log("Error In Post Data getItems", error);
        });
    }



    return (
        <main className="flex   flex-col items-center justify-between">
            <div id={styles.wrapper} className="mt-5">
                <button
                    onClick={() => setShowModal(true)}
                    className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button" data-modal-toggle="defaultModal">
                    add new
                </button>

                {showModal ? (
                    <>
                        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    <div className="relative p-6 flex-auto">
                                        <form className="w-full max-w-lg">
                                            <div className="flex flex-wrap -mx-3 mb-6">
                                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                                        Title
                                                    </label>
                                                    <input className="appearance-none block w-full bg-gray-200 text-gray-700
             border border-gray-200  rounded py-3 px-4 mb-3 leading-tight focus:outline-none 
             focus:border-gray-500" id="grid-first-name" type="text" placeholder="Title" value={Title} onChange={(e) => { setName(e.target.value) }} />
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap -mx-3 mb-2">
                                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
                                                        Description
                                                    </label>
                                                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 
            leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" placeholder="Description"
                                                        value={Description} onChange={(e) => { setDescription(e.target.value) }} />
                                                </div>
                                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
                                                        Upload Image
                                                    </label>
                                                    <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none 
            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" name="file"
                                                        onChange={(event) => handleFileChange(event)} />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                                <button
                                                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                                                    type="button"
                                                    onClick={() => setShowModal(false)}
                                                >
                                                    Close
                                                </button>
                                                <button
                                                    className="text-white bg-yellow-500 active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                                    type="button"
                                                    onClick={(e) => { setShowModal(false); submitData(e) }}
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </>
                ) : null}

            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 sm:grid-cols-2 ">
                {
                    isLoading !== false ? <h1>Loading...</h1> :
                        data.query
                            ?.map((Item) => {
                                return (
                                    <div className="relative mt-10 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md" key={Item._id}>
                                        <a className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl" href="#">
                                            <Image
                                                className="object-cover"
                                                src={Item.profile_img}
                                                alt="product image"
                                                fill={true}
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                priority={true} />
                                        </a>
                                        <div className="mt-4 px-5 pb-5">
                                            <a href="#">
                                                <h5 className="text-xl tracking-tight text-slate-900">{Item.title}</h5>
                                            </a>
                                            <div className="mt-2 mb-9 flex items-center justify-between">
                                                <p>
                                                    <span className="font-bold text-slate-900 line-clamp-3">{Item.description}</span>
                                                </p>
                                            </div>
                                            <div onClick={() => deleteList(Item.cloudinary_id)}
                                                className="absolute bottom-2 right-2 left-2 flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
                                                Delete
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                }
            </div>

        </main>
    )
}


function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result)
        };
        fileReader.onerror = (error) => {
            reject(error)
        }
    })
}
