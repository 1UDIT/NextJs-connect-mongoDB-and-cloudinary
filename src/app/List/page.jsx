'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import useSWR, { mutate } from "swr";
import styles from "@/css/style.css";
import Image from "next/image";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";




export default function Home() {
    const [showModal, setShowModal] = useState(false);
    const [Title, setName] = useState('');
    const [Description, setDescription] = useState('');
    const [Studio, setStudio] = useState('');
    const [day, setday] = useState('Monday');
    const [Time, setTime] = useState('');
    const [Episode, setEpisode] = useState('');
    const [filePath, setfilePath] = useState();
    const [Season, setSeason] = useState('');
    const [SeasonType, setSeasonType] = useState('');
    const [data, setData] = useState();
    const [startDate, setDate] = useState(new Date());
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
            mutate();
            // setData(response.data.Items);
        }).catch(error => {
            console.log("Error In Post Data getItems", error);
        });
    }

    const handleFileChange = (event) => {
        setfilePath(event.target.files[0])
    };

    const submitData = async (event) => {
        const selectedDate = new Date(startDate)
        var date = selectedDate.toLocaleString('default', { month: 'short' }) + " " + selectedDate.getDate() + "," + selectedDate.getFullYear();

        event.preventDefault();
        const base64 = await convertToBase64(filePath);
        var bodyFormData = new FormData();
        bodyFormData.append('title', Title);
        bodyFormData.append('profile_img', base64);
        bodyFormData.append('description', Description);
        bodyFormData.append('day', day);
        bodyFormData.append('date', date);
        bodyFormData.append('Time', Time);
        bodyFormData.append('Studio', Studio);
        bodyFormData.append('Season', Season);
        bodyFormData.append('SeasonType', SeasonType);

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
            mutate();
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
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex justify-center items-center overflow-x-hidden min-h-screen   outline-none focus:outline-none
                             text-center   sm:p-0">
                            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    <div className="relative p-6 flex-auto">
                                        <form className="w-full max-w-sm ">
                                            <div className="flex flex-wrap -mx-3 mb-1.5">
                                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                                        Title
                                                    </label>
                                                    <input className="appearance-none block w-full bg-gray-200 text-gray-700
                                                       border border-gray-200  rounded py-3 px-4 mb-3 leading-tight focus:outline-none 
                                                       focus:border-gray-500" id="grid-first-name" type="text" placeholder="Title" value={Title} onChange={(e) => { setName(e.target.value) }} />
                                                </div>
                                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="UploadImage">
                                                        Upload Image
                                                    </label>
                                                    <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none 
                                                        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="UploadImage" type="file" name="file"
                                                        onChange={(event) => handleFileChange(event)} />
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap -mx-3 mb-1.5">
                                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                                        Studio
                                                    </label>
                                                    <input className="appearance-none block w-full bg-gray-200 text-gray-700
                                                      border border-gray-200  rounded py-3 px-4 mb-3 leading-tight focus:outline-none 
                                                      focus:border-gray-500" id="grid-Studio-name" type="text" placeholder="Studio Name" value={Studio} onChange={(e) => { setStudio(e.target.value) }} />
                                                </div>
                                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                                        day
                                                    </label>
                                                    <input className="appearance-none block w-full bg-gray-200 text-gray-700
                                                      border border-gray-200  rounded py-3 px-4 mb-3 leading-tight focus:outline-none 
                                                      focus:border-gray-500" id="grid-day-name" type="text" placeholder="day" value={day} onChange={(e) => { setday(e.target.value) }} />
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap -mx-3 mb-1.5">
                                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                                        Time
                                                    </label>
                                                    <input className="appearance-none block w-full bg-gray-200 text-gray-700
                                                        border border-gray-200  rounded py-3 px-4 mb-3 leading-tight focus:outline-none 
                                                        focus:border-gray-500" id="grid-Time-name" type="text" placeholder="Studio Name" value={Time} onChange={(e) => { setTime(e.target.value) }} />
                                                </div>
                                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                                        Episode
                                                    </label>
                                                    <input className="appearance-none block w-full bg-gray-200 text-gray-700
                                                        border border-gray-200  rounded py-3 px-4 mb-3 leading-tight focus:outline-none 
                                                        focus:border-gray-500" id="grid-Episode-name" type="text" placeholder="day" value={Episode} onChange={(e) => { setEpisode(e.target.value) }} />
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap -mx-3 mb-1.5">
                                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                                        Season
                                                    </label>
                                                    <input className="appearance-none block w-full bg-gray-200 text-gray-700
                                                        border border-gray-200  rounded py-3 px-4 mb-3 leading-tight focus:outline-none 
                                                        focus:border-gray-500" id="grid-Season-name" type="text" placeholder="Studio Name" value={Season} onChange={(e) => { setSeason(e.target.value) }} />
                                                </div>
                                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                                        SeasonType(Next/Prev)
                                                    </label>
                                                    <input className="appearance-none block w-full bg-gray-200 text-gray-700
                                                        border border-gray-200  rounded py-3 px-4 mb-3 leading-tight focus:outline-none 
                                                        focus:border-gray-500" id="grid-SeasonType-name" type="text" placeholder="day" value={SeasonType} onChange={(e) => { setSeasonType(e.target.value) }} />
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap -mx-3 mb-1.5">
                                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                                        Date
                                                    </label>
                                                    <DatePicker className="appearance-none block w-full bg-gray-200 text-gray-700
                                                        border border-gray-200  rounded py-3 px-4 mb-3 leading-tight focus:outline-none 
                                                        focus:border-gray-500" id="grid-Season-name" dateFormat="d,MMMM,yyyy" selected={startDate} onChange={(date) => { setDate(date) }} />
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap -mx-3 mb-1.5">
                                                <div className="w-full  px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="Description">
                                                        Description
                                                    </label>
                                                    <textarea className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 
                                                        leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="Description" type="text" placeholder="Description"
                                                        value={Description} onChange={(e) => { setDescription(e.target.value) }} />
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
                    </div>
                ) : null}

            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 sm:grid-cols-2  w-full">
                {
                    isLoading !== false ? <h1>Loading...</h1> :
                        data.query
                            ?.map((Item) => {
                                return (
                                    <div className="relative mx-6  mt-6 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md" key={Item._id}>
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
