import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useContext } from 'react';
import EmailContext  from './UserContext';


const Login = () => {
const socket = io.connect("http://localhost:3000");
const { email, setEmail , setRoom ,room } = useContext(EmailContext);
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const navigate = useNavigate();


    axios.defaults.withCredentials = true;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {

            const response = await axios.post('http://127.0.0.1:3000/login', {
                email,
                password
            }, {
                withCredentials: true 
            });
            if (response.status === 200) {
                navigate('/chat');
            } else {
                setErrorMessage(response.data.message || 'خطایی در ورود رخ داده است.');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('مشکلی در اتصال به سرور رخ داده است. لطفا دوباره تلاش کنید.');
        }
    };

    const joinRoom = () => {
        if (username !== "" && room !== "") {
          socket.emit("join_room", room);
          setShowChat(true);
        }
      };


    return (
        <div>
        <section className="bg-light py-3 py-md-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
                        <div className="card border border-light-subtle rounded-3 shadow-sm">
                            <div className="card-body p-3 p-md-4 p-xl-5">
                                <div className="text-center mb-3">

                                </div>
                                <h2 className="fs-6 fw-normal text-center text-secondary mb-4">Login</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="row gy-2 overflow-hidden">

                                        <div className="col-12">
                                            <div className="form-floating mb-3">
                                                <input
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    type="email" className="form-control" name="email" id="email" placeholder="email" />
                                                <label htmlFor="email" className="form-label">email </label>

                                            </div>
                                        </div>
                                        <div className="col-12">
                                            {errorMessage && (
                                                <div className="alert alert-danger" role="alert">
                                                    {errorMessage}
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-12">
                                            <div className="form-floating mb-3">
                                                <input
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    type="password" className="form-control" name="password" id="password" placeholder="password" />
                                                <label htmlFor="password" className="form-label">password</label>

                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="form-floating mb-3">
                                                <input
                                                    onChange={(e) => setRoom(e.target.value)}
                                                    type="text" className="form-control" name="room" id="room" placeholder="room" />
                                                <label htmlFor="room" className="form-label">room</label>

                                            </div>
                                        </div>


                                        <div className="col-12">
                                            <div className="d-grid my-3">
                                                <button onClick={joinRoom} className="btn btn-primary btn-lg" type="submit">login</button>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <p className="m-0 text-secondary text-center">dont have account?</p>
                                        </div>
                                        <div className="col-12">
                                            <div className="d-grid my-3">
                                                <button  className="btn btn-lg" type="submit">register</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
           
        </section>
        
        
        </div>

    )
}

export default Login