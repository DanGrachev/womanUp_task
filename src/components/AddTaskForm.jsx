import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {sendTask} from "../store/reducers/todo-reducer";
import {storage} from '../firebase';
import {ref} from 'firebase/storage';
import './AddTaskForm.css';
import uploadIcon from '../assets/img/upload_icon.png';
import fileIcon from '../assets/img/file_icon.png';


const AddTaskForm = ({setAddingMode}) => {
    // объект задачи
    const [taskData, setTaskData] = useState({
        id: Date.now(),
        head: '',
        description: '',
        date: '',
        file: [],
        isDone: false
    });
    // прикрепленный файл
    const [file, setFile] = useState({});

    const dispatch = useDispatch();


    const onInputChange = (e) => {
        const newData = {
            ...taskData
        }
        newData[e.target.id] = e.target.value;
        setTaskData(newData);
    }

    const onFileChose = (e) => {
        const fileRef = ref(storage, `documents/${e.target.files[0]?.name}`);

        const newData = {
            ...taskData,
            file: [fileRef.name, fileRef.fullPath]
        }

        setTaskData(newData);
        setFile(e.target.files[0]);
    }

    const sendFormData = (e) => {
        e.preventDefault();

        dispatch(sendTask(taskData, file));
        setAddingMode(false);
    }

    return (
        <div className='modal' onClick={() => setAddingMode(false)}>
            <div className='modal_content' onClick={e => e.stopPropagation()}>
                <div className='modal_title'><h3>Новая задача</h3></div>

                <form className="form" onSubmit={sendFormData}>
                    <input onChange={(e) => onInputChange(e)} value={taskData.head}
                           type="text" placeholder='Заголовок' id='head' className="form__input"/>

                    <input onChange={(e) => onInputChange(e)} value={taskData.description}
                           type="text" placeholder='Описание' id='description' className="form__input"/>

                    <input onChange={(e) => onInputChange(e)} value={taskData.date}
                           type="date" placeholder='Дата завершения' id='date' className="form__input date"/>

                    <input onChange={(e) => onFileChose(e)} type="file" id='file' className="form__input_file"/>
                    <label htmlFor="file" className='form__input_file__label'>
                        Прикрепить файл <br/>
                        <img src={uploadIcon} alt="upload file"/>
                    </label>

                    {taskData.file[0] && <div className='form__attached_file'>
                        <img src={fileIcon} alt="file"/>
                        <span>{taskData.file[0]}</span>
                    </div>}

                    <button type='submit' className="form__btn">Создать</button>
                </form>

            </div>
        </div>
    );
};

export default AddTaskForm;