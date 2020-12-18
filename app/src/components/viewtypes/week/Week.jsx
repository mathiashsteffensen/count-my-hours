import React, {useState, useEffect} from 'react'

import dayjs from 'dayjs'

import Day from './Day'

export default function Week() 
{
    let today = dayjs()
    let [datesArrays, setDatesArrays] = useState(false)
    let [dateToDisplay, setDateToDisplay] = useState(today)
    let [fetchesDone, setFetchesDone] = useState(0)

    // Used for fake updating state
    let [uselessValue, setUselessValue] = useState(false)

    let newFetchesDone = []

    let refreshView = () =>
    {
        setFetchesDone(0)
        setUselessValue(!uselessValue)
    }

    let registerFetchComplete = (day) =>
    {
        newFetchesDone.push(day)
        setFetchesDone(newFetchesDone.length)
    }
    useEffect(() =>
    {
        let newArray = [[dateToDisplay.day(1), dateToDisplay.day(2), dateToDisplay.day(3)], [dateToDisplay.day(4), dateToDisplay.day(5), dateToDisplay.day(6), dateToDisplay.date(dateToDisplay.date()+7).day(0)]]
        setDatesArrays(newArray)
    }, [dateToDisplay, uselessValue])

    let handleForwardPagination = () =>
    {
        setDateToDisplay(dateToDisplay.add(7, 'day'))
        setFetchesDone(0)
    }

    let handleBackwardPagination = () =>
    {
        setDateToDisplay(dateToDisplay.subtract(7, 'day'))
        setFetchesDone(0)
    }

    let handlePaginationReset = () => 
    {
        setDateToDisplay(today)
        setFetchesDone(0)
    }
    
    if (datesArrays)
    {
        return (
            <div className="flex justify-center items-center w-1/1 flex-col w-11/12">
                <div className="w-full flex justify-center items-center my-2">
                    <button onClick={handleBackwardPagination} className="hover:opacity-75 outline-none w-8 mx-4"><img src="previous-pagination.svg" alt="previous week"/></button>
                    <button onClick={handlePaginationReset} className="px-1 bg-secondary text-gray-100 rounded shadow py-1 hover:opacity-75">Today</button>
                    <button onClick={handleForwardPagination} className="hover:opacity-75 outline-none w-8 mx-4"><img src="next-pagination.svg" alt="previous week"/></button>
                </div>
                <h3 className="w-4/5 text-primary font-semibold text-center">Week of {datesArrays[0][0].date()}/{datesArrays[0][0].month()+1} to {datesArrays[1][3].date()}/{datesArrays[1][3].month()+1}</h3>
                {fetchesDone === 7 ? null : <img className="w-16" src="loader.svg" alt="loading"/>}
                <div className="flex justify-center items-center lg:w-3/4 w-full flex-col lg:flex-row">
                    {datesArrays[0].map((date, index) => <Day index={index} refresh={refreshView} key={index} handleComplete={registerFetchComplete}  allComplete={fetchesDone===7 ? true : false} date={date} />)}
                </div>
                <div className="flex justify-center items-center w-1/1 flex-col lg:flex-row w-full">
                    {datesArrays[1].map((date, index) => <Day index={index} refresh={refreshView} key={index+3} handleComplete={registerFetchComplete}  allComplete={fetchesDone===7 ? true : false} date={date} />)}
                </div>
            </div>
        ) 
    }

    return (
        <div className="flex justify-center items-center w-1/1">
            <img className="w-16" src="loader.svg" alt="loading"/>
        </div>
    )
}
