import React, { useState, useEffect } from 'react';
import './App.scss';

const FILTER_TYPE = {
    ALL: 'All',
    ACTIVE: 'Active',
    COMPLETED: 'Completed',
};

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [inited, setInited] = useState(false);
    const [currentFilter, setCurrentFilter] = useState(FILTER_TYPE.ALL);

    useEffect(() => {
        function getTodos() {
            let storageTodos = null;
            if (localStorage) {
                storageTodos = localStorage.getItem('todos');
            } else if (sessionStorage) {
                storageTodos = sessionStorage.getItem('todos');
            }
            if (storageTodos) {
                setTodos(JSON.parse(storageTodos));
                setInited(true);
            }
        }
        getTodos();
    }, []);

    useEffect(() => {
        if (inited) {
            if (localStorage) {
                localStorage.setItem('todos', JSON.stringify(todos));
            } else if (sessionStorage) {
                sessionStorage.setItem('todos', JSON.stringify(todos));
            }
        }
    }, [inited, todos]);
    return (
        <div className='container'>
            <h1>TODO APP</h1>
            <input
                value={newTodo}
                onChange={(e) => {
                    setNewTodo(e.target.value);
                }}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        setTodos([
                            ...todos,
                            { name: newTodo, isCompleted: false },
                        ]);
                        setNewTodo('');
                    }
                }}
                type='text'
                className='input-item'
                placeholder='Enter your todo item ...'
            />
            <div className='todo-container'>
                {todos
                    .filter((todo) =>
                        currentFilter === FILTER_TYPE.ALL
                            ? todo
                            : currentFilter === FILTER_TYPE.ACTIVE
                            ? todo.isCompleted === false
                            : todo.isCompleted === true
                    )
                    .map((todo, index) => (
                        <div key={index} className='todo-item'>
                            <input
                                type='checkbox'
                                checked={todo.isCompleted}
                                onChange={(e) => {
                                    const newTodos = [...todos];
                                    newTodos[index].isCompleted =
                                        e.target.checked;
                                    setTodos(newTodos);
                                }}
                            />
                            <div
                                className={
                                    todo.isCompleted
                                        ? 'todo-item-name completed'
                                        : 'todo-item-name'
                                }
                            >
                                {todo.name}
                            </div>
                            <span
                                role='img'
                                aria-label='icon'
                                className='todo-remove'
                                onClick={() =>
                                    setTodos((todos) =>
                                        todos.filter(
                                            (value, currentIndex) =>
                                                index !== currentIndex
                                        )
                                    )
                                }
                            >
                                ❌
                            </span>
                        </div>
                    ))}
            </div>

            <div className='check-all'>
                <input
                    type='checkbox'
                    onClick={(e) => {
                        if (e.target.checked !== false) {
                            setTodos((todos) =>
                                todos.map((todo) => ({
                                    ...todo,
                                    isCompleted: true,
                                }))
                            );
                        } else {
                            setTodos((todos) =>
                                todos.map((todo) => ({
                                    ...todo,
                                    isCompleted: false,
                                }))
                            );
                        }
                    }}
                />
                <div className='check-all-name'>Check All</div>
                <div className='todo-item-left'>
                    {todos.filter((todo) => !todo.isCompleted).length} items
                    left
                </div>
            </div>

            <div className='filter'>
                <div className='filter-buttons'>
                    {Object.values(FILTER_TYPE).map((filter) => (
                        <div
                            key={filter}
                            className={
                                currentFilter === filter
                                    ? 'filter-button active'
                                    : 'filter-button'
                            }
                            onClick={() => setCurrentFilter(filter)}
                        >
                            {filter}
                        </div>
                    ))}
                </div>
                <div
                    className='filter-button'
                    onClick={(e) => {
                        setTodos((prevTodos) =>
                            prevTodos.filter(
                                (todo) => todo.isCompleted === false
                            )
                        );
                    }}
                >
                    Clear Completed
                </div>
            </div>
        </div>
    );
}

export default App;
