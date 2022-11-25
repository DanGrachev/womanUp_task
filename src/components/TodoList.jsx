import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchTodos} from "../store/reducers/todo-reducer";
import TodoListTask from "./TodoListTask";
import Preloader from "../common/Preloader/Preloader";
import AddTaskForm from "./AddTaskForm";
import EditTaskForm from "./EditTaskForm";
import './TodoList.css'


const TodoList = () => {
    const dispatch = useDispatch();

    const {todo, loading, error} = useSelector(state => state.todos);
    const [addingMode, setAddingMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [taskId, setTaskId] = useState(null)

    useEffect(() => {
        dispatch(fetchTodos())
    }, [todo.length]);

    if (loading) {
        return <Preloader />
    }

    function openEditTaskForm(id) {
        setEditMode(true);
        setTaskId(id);
    }

    return (
        <div className='todoList'>
            <div className='add_task' onClick={() => setAddingMode(true)}><span>+</span> Создать задание</div>

            {addingMode && <AddTaskForm setAddingMode={setAddingMode}/>}

            {editMode && <EditTaskForm setEditMode={setEditMode} todo={todo} taskId={taskId}/>}

            {error && <h1 className='error_message'>{error}</h1>}

            {todo.map(todoTask => <TodoListTask key={todoTask.id} todoTask={todoTask} openEditTaskForm={openEditTaskForm}/>)}
        </div>
    );
};

export default TodoList;