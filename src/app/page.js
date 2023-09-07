'use client'
import styles from '@/Css/Slider.module.css'
import React, { Fragment, useEffect, useRef, useState } from 'react';
// Import Swiper React components 

import "@/Css/style.css";
import Image from 'next/image'
import axios from "axios";
import useSWR from "swr";

const fetcher = async (url) => {
  return await axios
    .get(url, {
      auth: {
          username: "4dmin",
          password: "testpwd123"
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
  const [filePath, setfilePath] = useState();


  const { data, error, isLoading } = useSWR(
    `api/user/weeklyTreading`,
    fetcher
  );

  const deleteList = (Id) => {
    console.log(Id);

    var bodyFormData = new FormData();
    bodyFormData.append('id', Id);


    axios({
      method: 'delete',
      url: `api/user/weeklyTreading`,
      data: bodyFormData,      
      auth: {
        username: "4dmin",
        password: "testpwd123"
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

    axios({
      method: 'post',
      url: `api/user/weeklyTreading`,
      data: bodyFormData,
      auth: {
          username: "4dmin",
          password: "testpwd123"
      }

    }).then(response => {
      console.log("getItems response:-", response.data, "done");
      // setData(response.data.Items);
    }).catch(error => {
      console.log("Error In Post Data getItems", error);
    });
  }

 

  return (
    <main>
      <div id={styles.wrapper}>
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
             focus:border-gray-500" id="grid-first-name" type="text" placeholder="Jane" value={Title} onChange={(e) => { setName(e.target.value) }} />
                        </div>
                      </div>

                      <div className="flex flex-wrap -mx-3 mb-2">
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
                            Description
                          </label>
                          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 
            leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" placeholder="Albuquerque"
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


      <div className={styles.slider}>

        {
          data?.message.map((value) => {
            return (
              <ul className="max-w-full divide-y divide-gray-200 dark:divide-gray-700" key={value._id}>
                <li className="pb-3 sm:pb-4 pt-7">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img className="w-16 h-16 rounded-full" src={value.profile_img} alt="Neil image" />
                    </div>
                    <div className="flex-1 min-w-0 text-white">
                      <p className="text-sm font-medium  ">
                        {value.title}
                      </p>
                      <p className="text-sm  truncate  ">
                        {value.description}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-yellow-400">
                      {value.Studio}
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={() => deleteList(value.cloudinary_id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            )
          })
        }



      </div>
    </main>
  );
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
