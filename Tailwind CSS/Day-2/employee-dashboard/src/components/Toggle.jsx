function Toggle({ onChange, checked }) {
    return (
        <button
            type="button"
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 
                        ${checked ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
        >
            <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 
                        ${checked ? 'translate-x-5' : 'translate-x-0'
                    }`}
            />
        </button>
    )
}

export default Toggle;