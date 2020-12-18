import React, { useState, useEffect } from 'react'

import popUp from '../../popups/PopUp'
import WorkListing from './WorkListing'

import {numberToDay} from '../../../utils'

export default function Day({date, handleComplete, allComplete, refresh}) 
{
    let [shifts, setShifts] = useState(false)

    // used for reloading shifts on this day only 
    let [uselessValue, setUselessValue] = useState(false)
    useEffect(() =>
    {
        let isSubscribed = true;
        let fetchShifts = async () =>
        {
            let result = await fetch((process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000') + `/shifts/onDay/${date.toJSON().slice(0, 10)}`, {credentials: 'include'}).then((res) => res.json()).catch(err => console.log(err))
            if (isSubscribed) setShifts(result)
            if (!allComplete)
            {
                handleComplete(date.day())
            }
        }
        fetchShifts()
        return () => (isSubscribed = false)
    }, [date, uselessValue])

    let handleRemoveForm = () =>
    {
        popUp(false)
        refresh()
    }

    let handleAddShiftForm = (e) =>
    {
        e.stopPropagation()
        popUp(true, 'add-shift', handleRemoveForm, {date: date})
    }

    let refreshDayOnly = () =>
    {
        setUselessValue(!uselessValue)
    }
    
    if (allComplete&&shifts)
    {
        return (
            <div className="lg:mx-2 lg:px-2 lg:flex-1 font-medium flex justify-center items-center flex-col py-4 bg-gray-200 w-10/12 mb-4 rounded shadow">
                <h5>{numberToDay(date.day())} {date.date()}/{date.month()+1}</h5>
                {shifts.map((shift, index) => <WorkListing refresh={refreshDayOnly} key={index} workHours={shift} />)}
                <button onClick={handleAddShiftForm} className="lg:px-1 bg-secondary text-gray-100 rounded shadow px-4 py-2 hover:opacity-75">Add Shift</button>
            </div>
        )
    }
    return null
}
 