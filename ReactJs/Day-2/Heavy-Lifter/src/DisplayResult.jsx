import styles from './App.module.css'

function DisplayResult({data}) {
    return (
        <div className={`${styles.resultRow}`}>
            {data}
        </div>
    )
}

export default DisplayResult;