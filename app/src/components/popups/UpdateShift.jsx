import React, {useState} from 'react'

import dayjs from 'dayjs'

export default function UpdateShift({workHours, removeForm}) 
{
    let [startDate, setStartDate] = useState(dayjs(workHours.startTime).toISOString().slice(0, 10))
    let [endDate, setEndDate] = useState(dayjs(workHours.endTime).toISOString().slice(0, 10))
    let [startTime, setStartTime] = useState(dayjs(workHours.startTime).toISOString().slice(11, 16))
    let [endTime, setEndTime] = useState(dayjs(workHours.endTime).toISOString().slice(11, 16))
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
        console.log(shiftData)
        fetch((process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000') + '/shifts/', {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                shiftID: workHours._id,
                updates: shiftData
            })
        }).then(async(res) =>
        {
            if (res.status === 200)
            {
                removeForm()
            } else
            {
                let result = await res.text()
                console.log(result)
                setErrorMessage("Make sure the starting time is before the ending time")
            }
        })
    }

    return (
        <form className=" md:w-1/2 flex flex-col justify-center items-center p-4 bg-primary opacity-100 w-10/12 rounded shadow relative" onClick={(e) => e.stopPropagation()} action="">
            <img onClick={removeForm} className="absolute w-10 top-0 right-0 cursor-pointer hover:opacity-75" src="x-in-circle.svg" alt="close form"/>
            <h3 className="font-semibold text-xl mt-4">Update shift</h3>
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
            <button onClick={handleFormSubmit} className="bg-secondary text-gray-100 rounded shadow px-4 py-2 hover:opacity-75">Update</button>
        </form>
    )
}
