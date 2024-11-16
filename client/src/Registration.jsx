import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Registration = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const  [error, setError] = useState('');
    const navigate = useNavigate()

 

const handleSubmit = (e) => {
    e.preventDefault()
    axios.post("http://127.0.0.1:3000/register" , {name , email , password})
    .then(res => {
        navigate('/Login')
    })
    .catch(err => {
        if (err.response && err.response.data) {
          setError(err.response.data.error);
        } else {
          setError('خطایی در ارتباط با سرور رخ داده است');
        }
      });
   

}


    return (
        <section className="bg-light py-3 py-md-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
                        <div className="card border border-light-subtle rounded-3 shadow-sm">
                            <div className="card-body p-3 p-md-4 p-xl-5">
                                <div className="text-center mb-3">

                                </div>
                                <h2 className="fs-6 fw-normal text-center text-secondary mb-4">Enter your details to register</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="row gy-2 overflow-hidden">
                                        <div className="col-12">
                                            <div className="form-floating mb-3">
                                                <input
                                                    onChange={(e) => setName(e.target.value)}
                                                    type="text" className="form-control" name="name" id="name" placeholder="name" />
                                                <label htmlFor="name" className="form-label">First Name</label>

                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="form-floating mb-3">
                                                <input
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    type="email" className="form-control" name="email" id="email" placeholder="email" />
                                                <label htmlFor="email" className="form-label">email </label>

                                            </div>
                                        </div>



                                        <div className="col-12">
                                            <div className="form-floating mb-3">
                                                <input
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    type="password" className="form-control" name="password" id="password" placeholder="password" />
                                                <label htmlFor="password" className="form-label">password</label>

                                            </div>
                                        </div>

                                        {error && <div className="error-message">{error}</div>}
                                        <div className="col-12">
                                            <div className="d-grid my-3">
                                                <button className="btn btn-primary btn-lg" type="submit">Sign up</button>
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
    );
};

export default Registration;