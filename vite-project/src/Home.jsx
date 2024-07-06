import React, { useState, useEffect } from 'react';
import Create from './Create';
import axios from 'axios';

function Home() {
    const [todos, setTodos] = useState([]);
    const [editText, setEditText] = useState(""); // State to hold the edited text
    const [editingId, setEditingId] = useState(null); // State to track which task is being edited

    useEffect(() => {
        axios.get('http://localhost:8000/get')
            .then(result => setTodos(result.data))
            .catch(err => console.log(err));
    }, []);

    const handleEdit = (id) => {
        axios.put(`http://localhost:8000/edit/${id}`, { task: editText })
            .then(result => {
                // Update the todos state to reflect the edited task
                setTodos(prevTodos =>
                    prevTodos.map(todo =>
                        todo._id === id ? { ...todo, task: editText } : todo
                    )
                );
                // Reset the editText and editingId state
                setEditText("");
                setEditingId(null);
            })
            .catch(err => console.log(err));
    }

    const handleInputChange = (event) => {
        setEditText(event.target.value);
    }

    const startEditing = (id, currentTask) => {
        // Set the editText state to the current task text
        setEditText(currentTask);
        // Set the editingId state to the current task id
        setEditingId(id);
    }

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8000/delete/${id}`)
            .then(result => {
                // Remove the deleted todo from the state
                setTodos(prevTodos =>
                    prevTodos.filter(todo => todo._id !== id)
                );
            })
            .catch(err => console.log(err));
    }

    return (
        <div>
            <h2>Todo list</h2>
            <Create />
            {
                todos.length === 0 ? <div>No Record Found</div> :
                    todos.map((todo) => (
                        <div className="task" key={todo._id}>
                            {
                                editingId === todo._id ? (
                                    <>
                                        <input type="text" value={editText} onChange={handleInputChange} />
                                        <button onClick={() => handleEdit(todo._id)}>Save</button>
                                    </>
                                ) : (
                                    <>
                                        <span onClick={() => startEditing(todo._id, todo.task)}>Edit</span>
                                        <div className="checkbox">
                                            <p>{todo.task}</p>
                                        </div>
                                        <div>
                                            <span onClick={() => handleDelete(todo._id)}>Delete</span>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    ))
            }
        </div>
    );
}

export default Home;
