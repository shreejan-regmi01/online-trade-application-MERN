import React, { useState, useContext, useEffect, useRef } from 'react'
import AuthContext from '../../../context/auth/authContext';
import ComputerContext from '../../../context/computer/computerContext';
import AlertContext from '../../../context/alert/alertContext';
import Alert from '../../layout/Alert';
import axios from 'axios';

const AddComputer = ({ match }) => {
    const pid = match.params.id;

    const authContext = useContext(AuthContext);
    const { loadUser } = authContext;

    const alertContext = useContext(AlertContext);
    const { setAlert } = alertContext;

    const computerContext = useContext(ComputerContext);
    const { computerMessage, addComputer, clearComputerMessage, editComputer } = computerContext;


    useEffect(() => {
        loadUser();
        // eslint-disable-next-line
    }, []);

    const [computer, setComputer] = useState({
        title: '',
        description: '',
        brand: '',
        price: '',
        soldFrom: '',
        condition: 'new',
        images: []
    })

    useEffect(() => {
        if (pid) {
            (async function (id) {
                try {
                    const p = await axios.get(`/computer/${id}`);
                    setComputer({ ...p.data });
                } catch (error) {
                    console.log(error);
                }
            })(pid);
        } else {
            setComputer({
                title: '',
                description: '',
                brand: '',
                price: '',
                soldFrom: '',
                condition: 'new',
                images: []
            })
        }
        //eslint-disable-next-line
    }, [pid]);

    const onChange = (e) => {
        setComputer({ ...computer, [e.target.name]: e.target.value });
    }

    const onSubmit = e => {
        e.preventDefault();
        if (title === '' || description === '' || brand === '' || price === '' || soldFrom === '' || condition === '')
            return;
        if (pid)  //edit case
            editComputer(pid, computer);
        else  //add case
            addComputer(computer);
        setComputer({
            title: '',
            description: '',
            brand: '',
            price: '',
            soldFrom: '',
            condition: 'new',
            images: []
        })
    }

    useEffect(() => {
        if (computerMessage === 'Ad for computer listed successfully!' ||
            computerMessage === 'Ad for computer updated successfully!') {
            setAlert('success', computerMessage);
            clearComputerMessage();
        }
        //eslint-disable-next-line
    }, [computerMessage])

    const myRef = useRef(null);

    const fileSelectedEvent = (e) => {
        if (e.target.files.length > 3) {
            myRef.current.disabled = true;
            setAlert('warning', 'You cannot upload more than 3 images');
            return;
        }
        myRef.current.disabled = false;
        setComputer({
            ...computer,
            images: e.target.files
        })
    }

    const { title, description, brand, price, soldFrom, condition } = computer;
    return (
        <section>
            <div className="container-fluid" style={{ paddingTop: '19vh' }}>
                <div className="row justify-content-center">
                    <div className="col-md-6 border p-4 mb-2 pb-2">
                        <div className="d-flex">
                            <i className="fas fa-laptop fa-5x d-block"></i>
                            <div className="ml-5">
                                <h1 className="font-weight-bold">Post Ad</h1>
                                <p className="text-secondary mt-1">Selected Category: <span className="font-weight-bold">Computer and Laptop</span></p>
                            </div>
                        </div>
                        <hr />
                        <Alert />
                        <form onSubmit={onSubmit}>
                            <div className="mb-3 field-required">
                                <label>Ad Title</label>
                                <input type="text" name="title" className="form-control" value={title} onChange={onChange}
                                    required></input>
                            </div>
                            <div className="mb-3 field-required">
                                <label>Ad Description</label>
                                <textarea name="description" className="form-control" value={description} onChange={onChange} required></textarea>
                            </div>
                            <div className="mb-3 field-required">
                                <label>Brand</label>
                                <input type="text" name="brand" className="form-control" value={brand} onChange={onChange}
                                    required></input>
                            </div>
                            <div className="mb-3 field-required">
                                <label>Price</label>
                                <input type="number" name="price" className="form-control" min="1" value={price} onChange={onChange} required></input>
                            </div>
                            <div className="mb-3 field-required">
                                <label>Condition</label>
                                <select name="condition" className="form-control" value={condition} onChange={onChange}>
                                    <option value="new">New</option>
                                    <option value="old">Old</option>
                                </select>
                            </div>
                            <div className="mb-4 field-required">
                                <label>Sold From</label>
                                <input type="text" name="soldFrom" className="form-control" value={soldFrom} onChange={onChange} required></input>
                            </div>
                            {pid ? null :
                                <div className="form-group">
                                    <label htmlFor="file">Select Image(s)</label>
                                    <input type="file" name="images" className="form-control-file" id="file" onChange={fileSelectedEvent}
                                        accept="image/*" multiple required />
                                </div>
                            }
                            <div className="text-center">
                                <button ref={myRef} type="submit" className="btn btn-info btn-lg my-3">{pid ? "Edit " : "Post "}Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section >
    )
}

export default AddComputer;