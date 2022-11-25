import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {editTask} from "../store/reducers/todo-reducer";
import {ref} from "firebase/storage";
import {storage} from "../firebase";
import './AddTaskForm.css';
import uploadIcon from "../assets/img/upload_icon.png";
import fileIcon from "../assets/img/file_icon.png";


const EditTaskForm = ({setEditMode, todo, taskId}) => {
    // объект задачи
    const [taskData, setTaskData] = useState(() => {
        return todo.find(task => task.id === taskId);
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

    const onCheckboxChange = (e) => {
        const editedData = {
            ...taskData,
            isDone: e.target.checked
        }
        setTaskData(editedData);
    }

    const onFileChose = (e) => {
        const fileRef = ref(storage, `documents/${e.target.files[0].name}`);

        const editedData = {
            ...taskData,
            file: [fileRef.name, fileRef.fullPath]
        }

        setTaskData(editedData);
        setFile(e.target.files[0]);
    }

    const sendFormData = (e) => {
        e.preventDefault();

        dispatch(editTask(taskData, file));
        setEditMode(false);
    }

    return (
        <div className='modal' onClick={() => setEditMode(false)}>
            <div className='modal_content' onClick={e => e.stopPropagation()}>
                <div className='modal_title'><h3>Редактировать задачу</h3></div>

                <form className="form" onSubmit={sendFormData}>
                    <div className='form__checkbox_block'>
                        <input type="checkbox" onChange={(e) => onCheckboxChange(e)} checked={taskData.isDone} id='isDone' className='form__checkbox'/>
                        <label htmlFor="" className='form__checkbox__label'>
                            Статус: <span>{taskData.isDone ? 'Выполнено' : 'В разработке'}</span>
                        </label>
                    </div>

                    <input type="text" onChange={(e) => onInputChange(e)} value={taskData.head}
                           placeholder='Заголовок' id='head' className="form__input"/>

                    <input type="text" onChange={(e) => onInputChange(e)} value={taskData.description}
                           placeholder='Описание' id='description' className="form__input"/>

                    <input type="date" onChange={(e) => onInputChange(e)} value={taskData.date}
                           placeholder='Дата завершения' id='date' className="form__input date"/>

                    <input type="file" onChange={(e) => onFileChose(e)} id='file' className="form__input_file"/>
                    <label htmlFor="file" className='form__input_file__label'>
                        Прикрепить файл <br/>
                        <img src={uploadIcon} alt="upload file"/>
                    </label>

                    {taskData.file[0] && <div className='form__attached_file'>
                        <img src={fileIcon} alt="file"/>
                        <span>{taskData.file[0]}</span>
                    </div>}

                    <button type='submit' className="form__btn">Обновить</button>
                </form>

            </div>
        </div>
    );
};

export default EditTaskForm;