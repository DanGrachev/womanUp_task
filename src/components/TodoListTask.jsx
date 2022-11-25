import React, {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {removeTask} from "../store/reducers/todo-reducer";
import {storage} from '../firebase';
import {ref, getDownloadURL } from 'firebase/storage';
import './TodoListTask.css'
import fileIcon from "../assets/img/file_icon.png";
import dayjs from "dayjs";


const TodoListTask = ({todoTask, openEditTaskForm}) => {
    const dispatch = useDispatch();
    const [fileUrl, setFileUrl] = useState('');

    useEffect(() => {
        // если есть файл, получаем его ссылку для скачивания
        if (todoTask.file[0]) {
            const fileRef = ref(storage, `documents/${todoTask.file[0]}`);
            getDownloadURL(fileRef)
                .then((url) => {
                    setFileUrl(url);
                });
        }
    }, []);

    const formattedDate = dayjs(todoTask.date).format('DD.MM.YYYY');
    const today = dayjs().format('DD.MM.YYYY');

    const onDelete = () => {
       if (window.confirm('Удалить задание?')) {
           dispatch(removeTask(todoTask));
       }
    }

    return (
        <div className='task'>
            <div className='task__checked'>
                <input type='checkbox' checked={todoTask.isDone} readOnly/>

            </div>

            <div>
                {today > formattedDate && <div className='task__deadline'>Срок выполнения истек</div>}

                <div className='task__content' style={{textDecoration: todoTask.isDone ? 'line-through' : 'none'}}>

                    {todoTask.head && <h2 className='task__content__title'>{todoTask.head}</h2>}

                    {todoTask.description && <div className='task__content__info'>
                        <h3>Описание:</h3>
                        <div className='task__content__text'>{todoTask.description}</div>
                    </div>}

                    <div className='task__content__date'>
                        Дата завершения:<span>{(todoTask.date && formattedDate) || 'не установлено'}</span>
                    </div>

                    {todoTask.file[0] && <div className='task__content__file__block'>
                        <h4>Прикрепленные файлы:</h4>
                        <div className='task__content__file'>
                            <img src={fileIcon} alt="file"/>
                            <a href={fileUrl}>{todoTask.file[0]}</a>
                        </div>
                    </div>}
                </div>
            </div>

            <div className='task__operations'>
                <button className='btn__delete' onClick={onDelete}>Удалить</button>
                <button className='btn__edit' onClick={() => openEditTaskForm(todoTask.id)}>Редактировать</button>
            </div>
        </div>
    );
};

export default TodoListTask;