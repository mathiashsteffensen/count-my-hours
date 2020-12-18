import React, {useState, useEffect} from 'react'

import dayjs from 'dayjs'

import popUp from '../../popups/PopUp'
import {numberToMonth, dayToNumber, numberToDay} from '../../../utils'
import WorkListing from '../month/WorkListing'
import Count from '../../Count'

export default function PayPeriod({user}) 
{
    let today = dayjs()
    let [shifts, setShifts] = useState(false)
    let [dateToDisplay, setDateToDisplay] = useState(today.day(0))
    let [dataFetched, setDataFetched] = useState(false)

    useEffect(() =>
    {
        let fetchData = async () =>
        {
            let result = await fetch((process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000') + `/shifts/inPayPeriod/${dateToDisplay.toJSON().slice(0, 10)}`, {credentials: 'include'}).then((res) => res.json()).catch(err => console.log(err))
            setShifts(result)
            setDataFetched(true)
        }

        if (!dataFetched)
        {
            fetchData()
        }
    }, [dataFetched])

    let getDaysToAddOnPagination = () =>
    {
        switch(user.payPeriodType)
        {
            case 'weekly':
                return 7
            case 'biweekly':
                return 14
            case 'monthly':
                return 29
            default:
        }
    }

    let handleForwardPagination = () =>
    {
        setDateToDisplay(dateToDisplay.add(getDaysToAddOnPagination(), 'days'))
        setDataFetched(false)
    }

    let handleBackwardPagination = () =>
    {
        setDateToDisplay(dateToDisplay.subtract(getDaysToAddOnPagination(), 'days'))
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

    let getTitle = () =>
    {
        switch(user.payPeriodType)
        {
            case 'weekly':
                return <span>Shifts payed out on {numberToDay(dayToNumber(user.payPeriodWeekly.payOutDay))}, {dateToDisplay.day(dayToNumber(user.payPeriodWeekly.payOutDay)).date()}/{dateToDisplay.day(dayToNumber(user.payPeriodWeekly.payOutDay)).month()+1} <br/>Pay Period from {dateToDisplay.day(dayToNumber(user.payPeriodWeekly.payPeriodDay)).subtract(7, 'days').date()}/{dateToDisplay.day(dayToNumber(user.payPeriodWeekly.payPeriodDay)).subtract(7, 'days').month()+1} to {dateToDisplay.day(dayToNumber(user.payPeriodWeekly.payPeriodDay)-1).date()}/{dateToDisplay.day(dayToNumber(user.payPeriodWeekly.payPeriodDay)).month()+1}</span>
            case 'biweekly':
                return <span>Shifts payed out on {numberToDay(dayToNumber(user.payPeriodBiWeekly.payOutDay))}, {dateToDisplay.day(dayToNumber(user.payPeriodBiWeekly.payOutDay)).date()}/{dateToDisplay.day(dayToNumber(user.payPeriodBiWeekly.payOutDay)).month()+1} <br/>Pay Period from {dateToDisplay.day(dayToNumber(user.payPeriodBiWeekly.payPeriodDay)).subtract(14, 'days').date()}/{dateToDisplay.day(dayToNumber(user.payPeriodBiWeekly.payPeriodDay)).subtract(14, 'days').month()+1} to {dateToDisplay.day(dayToNumber(user.payPeriodBiWeekly.payPeriodDay)-1).date()}/{dateToDisplay.day(dayToNumber(user.payPeriodBiWeekly.payPeriodDay)).month()+1}</span>
            case 'monthly':
                return <span>Shifts payed out for {numberToMonth(dateToDisplay.month())}, {dateToDisplay.year()} <br/> Pay Period from {user.payPeriodMonthly.startDate}/{dateToDisplay.month()} to {user.payPeriodMonthly.startDate-1}/{dateToDisplay.month()+1}</span>
            default:
        }
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
                <h3 className="w-full text-primary font-semibold text-center">
                    {getTitle()}
                </h3>
                <div className="w-11/12 font-medium mt-2">
                    {shifts && shifts.length < 1 ? <h4>No shifts this pay period</h4> : shifts.map((shift) =>
                    {
                       return <WorkListing key={shift._id} refresh={() => setDataFetched(false)} workHours={shift} />
                    })}
                </div>
                <button onClick={handleAddShiftForm} className="lg:px-1 bg-secondary my-2 text-gray-100 rounded shadow px-4 py-2 hover:opacity-75">Add Shift</button>
                <Count shifts={shifts} user={user} />
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
            <h3 className="w-11/12 text-primary font-semibold text-center">
                {getTitle()}
            </h3>
            <img className="w-16" src="loader.svg" alt="loading"/>
        </div>
    )
}
