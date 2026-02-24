import { useState, useReducer } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

const stateObject = {
    data: [],
    loading: false,
    error: null
};

function searchReducer(state, action) {
    switch (action.type) {
        case "FETCH_INIT":
            return { ...state, loading: true, error: null };
        case "FETCH_SUCCESS":
            return { ...state, loading: false, data: action.payload, error: null };
        case "FETCH_FAILURE":
            return { ...state, loading: false, error: action.payload };
        case "CLEAR":
            return { ...state, data: [], error: action.payload };
        default:
            return state;
    }
}

function GlobalSearch() {
    const [state, dispatch] = useReducer(searchReducer, stateObject);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = async (value) => {
        if (!value) {
            dispatch({type: 'CLEAR'}) 
            return
        };

        dispatch({ type: "FETCH_INIT" });
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/users?q=${value}`);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            dispatch({ type: "FETCH_SUCCESS", payload: data });
        } catch (error) {
            dispatch({ type: "FETCH_FAILURE", payload: error.message });
        }
    };

    return (
        <div className='SearchItem'>
            <input
                type="text"
                value={query}
                placeholder="Search users..."
                onChange={(e) => {
                    setQuery(e.target.value);
                    handleSearch(e.target.value);
                }}
            />

            {state.loading && <p>Loading...</p>}
            {state.error && <p style={{ color: "red" }}>{state.error}</p>}

            <ul>
                {state.data.map((user) => (
                    <li
                        key={user.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/user/${user.id}`)}
                    >
                        {user.name} ({user.email})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GlobalSearch;
