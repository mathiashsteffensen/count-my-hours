import React, {useState, useEffect} from 'react'

import WorkListing from './WorkListing'

import dayjs from 'dayjs'
import {numberToMonth} from '../../../utils'
import popUp from '../../popups/PopUp'
import Count from '../../Count'

export default function Month() 
{
    let today = dayjs()
    let [shifts, setShifts] = useState(false)
    let [dateToDisplay, setDateToDisplay] = useState(today)
    let [dataFetched, setDataFetched] = useState(false)

    useEffect(() =>
    {
        let fetchData = async () =>
        {
            let result = await fetch((process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000') + `/shifts/inMonth/${dateToDisplay.toJSON().slice(0, 10)}`, {credentials: 'include'}).then((res) => res.json()).catch(err => console.log(err))
            setShifts(result)
            setDataFetched(true)
        }

        if (!dataFetched)
        {
            fetchData()
        }
    }, [dataFetched])

    let handleForwardPagination = () =>
    {
        setDateToDisplay(dateToDisplay.add(1, 'month'))
        setDataFetched(false)
    }

    let handleBackwardPagination = () =>
    {
        setDateToDisplay(dateToDisplay.subtract(1, 'month'))
        setDataFetched(false)
    }

    let handlePaginationReset = () => 
    {
        setDateToDisplay(today)
        setDataFetched(false)
    }

    let handleRemoveForm = () =>
    {
        popUp(false)
        setDataFetched(false)
    }

    let handleAddShiftForm = (e) =>
    {
        e.stopPropagation()
        popUp(true, 'add-shift', handleRemoveForm, {date: dateToDisplay})
    }

    if (dataFetched)
    {
        return (
            <div className="flex justify-center items-center w-1/1 flex-col w-11/12">
                <div className="w-full flex justify-center items-center my-2">
                    <button onClick={handleBackwardPagination} className="hover:opacity-75 outline-none w-8 mx-4"><img src="previous-pagination.svg" alt="previous week"/></button>
                    <button onClick={handlePaginationReset} className="px-1 bg-secondary text-gray-100 rounded shadow py-1 hover:opacity-75">Today</button>
                    <button onClick={handleForwardPagination} className="hover:opacity-75 outline-none w-8 mx-4"><img src="next-pagination.svg" alt="previous week"/></button>
                </div>
                <h3 className="w-4/5 text-primary font-semibold text-center">
                    {numberToMonth(dateToDisplay.month())}, {dateToDisplay.year()}
                </h3>
                <div className="w-11/12 font-medium mt-2">
                    {shifts.length < 1 ? <h4 className="text-center">No shifts this month</h4> : shifts.map((shift) =>
                    {
                       return <WorkListing key={shift._id} refresh={() => setDataFetched(false)} workHours={shift} />
                    })}
                </div>
                <button onClick={handleAddShiftForm} className="lg:px-1 bg-secondary my-2 text-gray-100 rounded shadow px-4 py-2 hover:opacity-75">Add Shift</button>
                <Count shifts={shifts} />
            </div>
        )
    }

    return (
        <div className="flex flex-col justify-center items-center w-1/1">
            <div className="w-full flex justify-center items-center my-2">
                <button onClick={handleBackwardPagination} className="hover:opacity-75 outline-none w-8 mx-4"><img src="previous-pagination.svg" alt="previous week"/></button>
                <button onClick={handlePaginationReset} className="px-1 bg-secondary text-gray-100 rounded shadow py-1 hover:opacity-75">Today</button>
                <button onClick={handleForwardPagination} className="hover:opacity-75 outline-none w-8 mx-4"><img src="next-pagination.svg" alt="previous week"/></button>
            </div>
            <h3 className="w-4/5 text-primary font-semibold text-center">
                {numberToMonth(dateToDisplay.month())}, {dateToDisplay.year()}
            </h3>
            <img className="w-16" src="loader.svg" alt="loading"/>
        </div>
    )
}
