import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { SignIn, useAuth, useUser } from '@clerk/clerk-react';
import { getAlltask, signInUser } from '../fetch/fetch';
import ModalForm from './Createtask';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { user } = useUser();
  if (!user) return <div className='flex w-full h-[80%] items-center justify-center'><SignIn /></div>;
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('Connected to socket server', socket.id);
      });

      socket.on('message-recived', (newTask) => {
        setTasks(prevTasks => [...prevTasks, newTask]);
      });

      return () => {
        socket.off('connect');
        socket.off('message-recived');
      };
    }
  }, [socket]);

  useEffect(() => {
    if (user && user.id  && socket) {
      socket.emit('user-connected', user);
    }
  }, [user, socket]);

  useEffect(() => {
    getAlltask(setTasks, setLoading, setError);
  }, []);

  useEffect(() => {
    if (user) {
      signInUser(user.id, user.emailAddresses[0].emailAddress);
    }
  }, [user]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (!user) return <div className='flex w-full h-[80%] items-center justify-center'><SignIn /></div>;

  return (
    <div style={{ backgroundImage: `url("/client/public/background.svg")` }}>
      <div className='w-full h-[5%] flex justify-between items-center'>
        <button onClick={handleOpenModal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Open Modal
        </button>
        <ModalForm isOpen={isModalOpen} onClose={handleCloseModal} socket={socket} />
      </div>
     
    </div>
  );
}

export default Home;