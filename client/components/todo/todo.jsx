import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Todo = () => {
    const [todos, setTodos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [pending, setPending] = useState(true); 
    const backendUrl = import.meta.env.BACKEND_URL || 'http://localhost:8000';
    const navigate = useNavigate();

    const fetchTodos = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get(`${backendUrl}/api/todo/getTodo`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = Array.isArray(response.data) ? response.data : response.data.todos || [];
            setTodos(data);
        } catch (err) {
            console.error("Failed to fetch Todos", err);
            if (err.response?.status === 401) handleLogout();
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleAddTodo = async () => {
        if (!title) return alert("Title is required");
        try {
            const token = localStorage.getItem("authToken");
            await axios.post('http://localhost:8000/api/todo/create', 
                { title, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setShowModal(false);
            setTitle("");
            setDescription("");
            fetchTodos(); 
        } catch (err) {
            console.error(err);
            alert("Error adding todo");
        }
    };

    const handleMarkDone = async (id) => {
        const token = localStorage.getItem("authToken");
        try {
            await axios.put(`http://localhost:8000/api/todo/mark/${id}`, 
                {}, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchTodos(); 
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate('/', { replace: true });
    };

    return (
        /* h-screen and overflow-hidden prevent the entire body from scrolling */
        <div className='bg-amber-200 h-screen w-full flex flex-col items-center pt-4 md:pt-8 font-sans overflow-hidden'>
            
            {/* Header Section: Fully Responsive Width */}
            <header className='w-full max-w-4xl flex justify-between items-center px-4 md:px-10 mb-6 md:mb-10 shrink-0'>
                <div className='text-2xl md:text-3xl font-bold text-gray-800 tracking-tight'>Todo App</div> 
                <button 
                    className='bg-red-50 text-red-600 px-3 py-1.5 md:px-5 md:py-2 rounded-lg shadow-sm font-bold text-sm md:text-base hover:bg-red-100 transition cursor-pointer border border-red-100' 
                    onClick={handleLogout}
                >
                    Log out
                </button>
            </header>

            {/* Navigation Tabs: Stack on very small screens, row on others */}
            <div className='flex flex-row justify-center gap-2 md:gap-4 mb-6 md:mb-8 shrink-0 px-2'>
                <button 
                    onClick={() => setPending(false)} 
                    className={`px-4 py-2 md:px-6 md:py-2 rounded-full shadow transition cursor-pointer text-xs md:text-sm font-medium ${!pending ? 'bg-amber-600 text-white' : 'bg-white text-gray-700'}`}
                >
                    Completed
                </button>
                <button 
                    onClick={() => setPending(true)} 
                    className={`px-4 py-2 md:px-6 md:py-2 rounded-full shadow transition cursor-pointer text-xs md:text-sm font-medium ${pending ? 'bg-amber-600 text-white' : 'bg-white text-gray-700'}`}
                >
                    Pending
                </button>
                <button 
                    onClick={() => setShowModal(true)}
                    className='bg-blue-600 text-white px-4 py-2 md:px-6 md:py-2 rounded-full shadow hover:bg-blue-700 transition cursor-pointer text-xs md:text-sm font-bold'
                >
                    + Add Task
                </button>
            </div>

            {/* Responsive Scrollable Todo List Area */}
            <div className='flex-1 w-full max-w-md overflow-y-auto px-4 pb-20 custom-scrollbar'>
                <div className='flex flex-col gap-3 md:gap-4'>
                    {todos
                        .filter(todo => pending ? !todo.completed : todo.completed)
                        .map((todo) => (
                            <div key={todo._id} className='flex justify-between items-start md:items-center bg-white/80 backdrop-blur-sm p-4 md:p-5 rounded-xl shadow-sm border border-amber-100 animate-in fade-in duration-300'>
                                <div className='flex-1 pr-3'>
                                    <p className={`font-bold text-base md:text-lg ${todo.completed ? 'text-gray-400' : 'text-gray-800'}`}>
                                        {todo.title}
                                    </p>
                                    <p className='text-xs md:text-sm text-gray-500 mt-1'>{todo.description}</p>
                                </div>
                                
                                {!todo.completed && (
                                    <button 
                                        className='bg-green-500 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-green-600 transition cursor-pointer shrink-0' 
                                        onClick={() => handleMarkDone(todo._id)}
                                    >
                                        Done
                                    </button>
                                )}
                            </div>
                        ))
                    }
                    
                    {/* Empty State */}
                    {todos.filter(todo => pending ? !todo.completed : todo.completed).length === 0 && (
                        <div className="flex flex-col items-center mt-12 text-gray-500">
                            <div className="text-4xl md:text-5xl mb-2 opacity-20">No Tasks</div>
                            <p className="text-sm">Enjoy your free time!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Todo Modal: Adjusted for mobile screens */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 md:p-8 rounded-2xl w-full max-w-sm shadow-2xl">
                        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">New Task</h2>
                        
                        <label className="block text-xs md:text-sm font-semibold text-gray-600 mb-1 ml-1">Title</label>
                        <input 
                            type="text" 
                            placeholder="What needs to be done?" 
                            className="w-full border-2 border-gray-100 focus:border-blue-400 outline-none p-2.5 md:p-3 mb-4 rounded-xl transition text-sm"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        
                        <label className="block text-xs md:text-sm font-semibold text-gray-600 mb-1 ml-1">Description</label>
                        <textarea 
                            placeholder="Details..." 
                            className="w-full border-2 border-gray-100 focus:border-blue-400 outline-none p-2.5 md:p-3 mb-6 rounded-xl h-24 md:h-28 resize-none transition text-sm"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <div className="flex justify-end gap-2 md:gap-3 font-bold">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-gray-400 hover:text-gray-600 transition cursor-pointer text-sm"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleAddTodo}
                                className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition cursor-pointer text-sm"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default Todo;