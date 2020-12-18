import React, {useState} from 'react'

export default function AddShift({date, removeForm}) 
{
    let [startDate, setStartDate] = useState(date.toISOString().slice(0, 10))
    let [endDate, setEndDate] = useState(date.toISOString().slice(0, 10))
    let [startTime, setStartTime] = useState("08:00")
    let [endTime, setEndTime] = useState("16:00")
    let [errorMessage, setErrorMessage] = useState(null)

    let handleStartDateChange = (e) =>
    {
        setStartDate(e.target.value)
    }

    let handleStartTimeChange = (e) =>
    {
        setStartTime(e.target.value)
    }

    let handleEndDateChange = (e) =>
    {
        setEndDate(e.target.value)
    }

    let handleEndTimeChange = (e) =>
    {
        setEndTime(e.target.value)
    }

    let handleFormSubmit = (e) =>
    {
        e.preventDefault()
        let shiftData = {
            startTime: `${startDate}/${startTime}`,
            endTime: `${endDate}/${endTime}`
        }
        fetch((process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000') + '/shifts/create', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(shiftData)
        }).then(async(res) =>
        {
            if (res.status === 200)
            {
                removeForm()
            } else
            {
                setErrorMessage("Make sure the starting time is before the ending time & the shift is shorter than 24 hours.")
            }
        })
    }

    return (
        <form className=" md:w-1/2 flex flex-col justify-center items-center p-4 bg-primary opacity-100 w-10/12 rounded shadow relative" onClick={(e) => e.stopPropagation()} action="">
            <img onClick={removeForm} className="absolute w-10 top-0 right-0 cursor-pointer hover:opacity-75" src="x-in-circle.svg" alt="close form"/>
            <h3 className="font-semibold text-xl mt-4">Create a new shift</h3>
            <label className="py-4 flex justify-center items-center">
                <span className="text-left w-2/5">Start time: </span>
                <div className="pt-2 w-3/5">
                    <input className="w-full" onChange={handleStartDateChange} value={startDate} type="date"/>
                    <input className="w-full" onChange={handleStartTimeChange} value={startTime} type="time"/>
                </div>
            </label>
            <label className="pb-4 flex justify-center items-center">
                <span className="text-left w-2/5">End time: </span>
                <div className="pt-2 w-3/5">
                    <input className="w-full" onChange={handleEndDateChange} value={endDate} type="date"/>
                    <input className="w-full" onChange={handleEndTimeChange} value={endTime} type="time"/>
                </div>
            </label>
            <p className="text-red-600 text-sm font-semibold pb-2 text-center">{errorMessage}</p>
            <button onClick={handleFormSubmit} className="bg-secondary text-gray-100 rounded shadow px-4 py-2 hover:opacity-75">Add Shift</button>
        </form>
    )
}
