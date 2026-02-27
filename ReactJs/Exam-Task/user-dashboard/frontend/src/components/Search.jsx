import { useState, useEffect } from "react";
import useDebounce from '../hooks/useDebounce'
import { Input } from 'antd'

function Search({ onSearch }) {
    const [value, setValue] = useState('')
    const debouncedValue = useDebounce(value)

    useEffect(() => {
        onSearch(debouncedValue)
    }, [debouncedValue, onSearch])

    return (
        <Input.Search 
            placeholder="Search Here..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            allowClear
            onClear={() => setValue('')}
            style={{width: 180}}
        />
    )
}

export default Search