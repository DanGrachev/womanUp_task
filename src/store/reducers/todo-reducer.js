import {db, storage} from "../../firebase";
import {collection, doc, getDocs, addDoc, deleteDoc, updateDoc} from "firebase/firestore";
import {ref, uploadBytes, deleteObject } from "firebase/storage";

const FETCH_TODO = 'FETCH_TODO';
const FETCH_TODO_SUCCESS = 'FETCH_TODO_SUCCESS';
const ERROR = 'ERROR';
const ADD_TASK = 'ADD_TASK';
const DELETE_TASK = 'DELETE_TASK';
const EDIT_TASK = 'EDIT_TASK';

const defaultState = {
    todo: [],
    loading: false,
    error: null
}

export const todoReducer = (state = defaultState, action) => {
    switch (action.type) {
        case FETCH_TODO:
            return {
                ...state,
                loading: true
            }
        case FETCH_TODO_SUCCESS:
            return {
                ...state,
                todo: [...action.payload],
                loading: false
            }
        case ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            }
        case ADD_TASK:
            return {
                ...state,
                todo: [...state.todo, action.data]
            }
        case DELETE_TASK:
            return {
                ...state,
                todo: state.todo.filter(task => task.id !== action.id)
            }
        case EDIT_TASK:
            return {
                ...state,
                todo: state.todo.map(task => {
                    if (task.id === action.payload.id) {
                        return {
                            ...task,
                            ...action.payload
                        }
                    }
                    return task
                })
            }
        default:
            return state
    }
}

// action creators
export const fetchTodosSuccess = (todoList) => ({type: FETCH_TODO_SUCCESS, payload: todoList});
export const addTask = (taskData) => ({type: ADD_TASK, data: taskData});
export const deleteTask = (taskId) => ({type: DELETE_TASK, id: taskId});
export const updateTask = (newData) => ({type: EDIT_TASK, payload: newData});



/**
 *
 * @returns {(function(*): Promise<void>)|*} фн-я получает список всех задач
 */
export const fetchTodos = () => {
    return async (dispatch) => {
        try {
            dispatch({type: FETCH_TODO});

            let todo_tasks = await getDocs(collection(db, 'todo_tasks'));
            todo_tasks = todo_tasks.docs.map(el => ({...el.data(), id: el.id}));

            dispatch(fetchTodosSuccess(todo_tasks));
        } catch (e) {
            dispatch({type: ERROR, payload: 'Произошла ошибка при загрузке списка дел'});
        }
    }
}

/**
 *
 * @param taskData объект задачи
 * @param file прикрепленный файл
 * @returns {(function(*): void)|*} фн-я добавляет новое задание и отправляет его в БД
 */
export const sendTask = (taskData, file) => {
    return (dispatch) => {
        try {
            // попытка предотвратить создание в firebase storage пустых файлов
            // при отправке задания БЕЗ прикрепленного файла
            if (file && file.name) {
                const fileRef = ref(storage, `documents/${file.name}`);

                Promise.all([
                    addDoc(collection(db, 'todo_tasks'), taskData),
                    uploadBytes(fileRef, file)
                ]).then(() => dispatch(addTask(taskData)));
            } else {
                addDoc(collection(db, 'todo_tasks'), taskData)
                    .then(() => dispatch(addTask(taskData)));
            }

        } catch (e) {
            dispatch({type: ERROR, payload: `Произошла ошибка при создании задачи. ${e}`});
        }
    }
}

/**
 *
 * @param task объект задачи
 * @returns {(function(*): void)|*} фн-я удаляет задание из локального стейта и БД
 */
export const removeTask = (task) => {
    return (dispatch) => {
        try {
            // попытка предотвратить создание в firebase storage пустых файлов
            // при отправке задания БЕЗ прикрепленного файла
            if (task.file[0]) {
                const fileRef = ref(storage, `documents/${task.file[0]}`);

                Promise.all([
                    deleteDoc(doc(db, 'todo_tasks', task.id)),
                    deleteObject(fileRef)
                ]).then(() => dispatch(deleteTask(task.id)));
            } else {
                deleteDoc(doc(db, 'todo_tasks', task.id)).then(() => dispatch(deleteTask(task.id)));
            }

        } catch (e) {
            dispatch({type: ERROR, payload: `Произошла ошибка при удалении задачи. ${e}`});
        }
    }
}

/**
 *
 * @param taskData объект задачи с новыми данными
 * @param file прикрепленный файл
 * @returns {(function(*): void)|*} фн-я обновляет информацию в задаче
 */
export const editTask = (taskData, file) => {
    return (dispatch) => {
        try {
            // попытка предотвратить создание в firebase storage пустых файлов
            // при отправке задания БЕЗ прикрепленного файла
            if (file && file.name) {
                const fileRef = ref(storage, `documents/${file.name}`);

                Promise.all([
                    updateDoc(doc(db, 'todo_tasks', taskData.id), taskData),
                    uploadBytes(fileRef, file)
                ]).then(() => dispatch(updateTask(taskData)));
            } else {
                updateDoc(doc(db, 'todo_tasks', taskData.id), taskData)
                    .then(() => dispatch(updateTask(taskData)));
            }

        } catch (e) {
            alert(`Ошибка: ${e}`)
        }
    }
}