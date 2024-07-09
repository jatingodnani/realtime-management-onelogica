import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCancel } from "react-icons/md";
import { useUser } from '@clerk/clerk-react';
import { fetchSignedInUsers } from '../fetch/fetch';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModalForm = ({ isOpen, onClose, socket }) => {
  const { user } = useUser();
  let [signedinuser, setSignedinuser] = useState([]);

  useEffect(() => {
    fetchSignedInUsers(setSignedinuser);
  }, []);

  const [formData, setFormData] = useState({
    userId: user && user.id,
    email: user && user.emailAddresses[0].emailAddress,
    name: user && user.firstName + ' ' + user?.lastName,
    title: '',
    description: '',
    assignTo: '',
    deadline: '',
    addTags: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.deadline) {
      alert('Please fill out all required fields.');
      return;
    }

    let newArr = [];

    if (formData.assignTo) {
      formData.assignTo.split(",").forEach((assign) => {
        let userass = signedinuser.length > 0 && signedinuser.find((each) =>
          each.email === assign.trim() && each.email !== user.emailAddresses[0].emailAddress
        );
        if (userass) {
          newArr.push(userass);
        }
      });
    }

    const updatedFormData = {
      ...formData,
      assignTo: newArr.length > 0 ? newArr : ""
    };

    console.log(signedinuser, newArr, updatedFormData.assignTo);
    socket.emit("message", updatedFormData);

   
    onClose();
    toast.success('Task created successfully!');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed  z-50 top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50"
        >
          <motion.div
            initial={{ y: "-100vh" }}
            animate={{ y: 0 }}
            exit={{ y: "-100vh" }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
            className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[75%] lg:w-[50%] xl:w-[40%] h-auto"
          >
            <div className='flex w-full justify-between items-center cursor-pointer' >
              <h2 className="text-2xl font-bold mb-4">Create Task</h2>
              <MdCancel onClick={onClose} size={30} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="h-[50px] pl-4 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder='Title here...'
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  className="mt-1 pl-4 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder='Description here...'
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="assignTo" className="block text-sm font-medium text-gray-700">Assign To</label>
                <input
                  type="text"
                  id="assignTo"
                  name="assignTo"
                  className="h-[50px]  mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.assignTo}
                  onChange={handleChange}
                  placeholder='Add multiple Users eMail using commas'
                />
              </div>
              <div className="mb-4">
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  className="pr-4 h-[50px] mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="addTags" className="block text-sm font-medium text-gray-700">Add Tags</label>
                <input
                  type="text"
                  id="addTags"
                  placeholder="Add multiple tags using commas"
                  name="addTags"
                  className=" h-[50px] pl-4 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.addTags}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Task
                </button>
              </div>
            </form>
          </motion.div>
          <ToastContainer />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalForm;

