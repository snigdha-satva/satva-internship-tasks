import { useState } from 'react';
import styles from './App.module.css'
import { useMemo } from 'react';
import DisplayResult from './DisplayResult.jsx'

const largeArray = Array.from({length: 10}, (_, index) => `This is the result for string ${index + 1}`)

function MemoComponent() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDark, setIsDark] = useState(false)

    const filteredData = useMemo(() => filterBySearchTerm(searchTerm), [searchTerm])

    const changeTheme = () => {
        setIsDark(isDark => !isDark)
    }

    return (
        <div className={`${styles.memoPad} ${isDark ? styles.darkTheme: styles.lightTheme}`}>
            <div className={`${styles.topBar}`}>
                <div className={`${styles.searchBar}`}>
                    <input type={`${styles.text}`} onChange={(e) => setSearchTerm(e.target.value)}/>
                </div>
                <div className={`${styles.themeToggle}`}>
                    <button onClick={changeTheme}>{isDark ? "Light" : "Dark"}</button>
                </div>
            </div>
            <div className={`${styles.filteredData}`}>
                {filteredData.map((item, index) => (<DisplayResult key={index} data = {item}/>))}
            </div>
        </div>
    )
}

function filterBySearchTerm(searchTerm)
{
    const lowerSearchTerm = searchTerm.trim().toLowerCase();
    return (
        largeArray.filter(item => (item.toLowerCase()).includes(lowerSearchTerm))
    )     
}

export default MemoComponent;
