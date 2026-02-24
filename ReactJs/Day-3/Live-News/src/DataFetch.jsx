import { useState } from 'react';
import './App.css'
import { useEffect } from 'react';

function DataFetch() {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const fetchedData = await fetch('https://jsonplaceholder.typicode.com/posts')
            const getData = await fetchedData.json()
            setData(getData)
        } catch {
            console.error("Error in fetching data!!")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])


    return (
        <div className="resultDisplay">
            <div className="refreshButton">
                <button onClick={fetchData}>Refresh</button>
            </div>
            <div className="dataDisplay">
                {isLoading ? (
                    <div className="loadingdata">Loading...</div>
                ) : (
                    data.map(item => (
                        <div className="individualData" key={item.id}>
                            <div className="titleData">{item.title}</div>
                            <div className="bodyData">{item.body}</div>
                        </div>
                    ))
                )}
            </div>

        </div>
    )
}

export default DataFetch;