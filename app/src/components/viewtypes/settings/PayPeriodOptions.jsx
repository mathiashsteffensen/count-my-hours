import React, { useState } from 'react'

import {dayToNumber, numberToDay} from '../../../utils'

import dayjs from 'dayjs'

export default function PayPeriodOptions({payPeriodType, startDate, startDay, payOutDay, payOutWeek})
{
    let [helpStringCSS, setHelpStringCSS] = useState('hidden')

    let helpString;

    let handleDisplayHelp = () =>
    {
        setHelpStringCSS('bg-gray-300 w-64 p-2 rounded shadow-md -mt-4 mb-4')
    }

    let handleRemoveHelp = () =>
    {
        setHelpStringCSS('hidden')
    }

    switch(payPeriodType)
    {
        case 'monthly':
            helpString = `This means your paycheck for August will span hours worked from ${startDate.value} June up to and including ${Number(startDate.value)-1} August`

            return (  
                <div className="w-full flex justify-center items-center flex-col">
                    <label className="font-medium w-full flex items-center justify-between mt-2">
                        Start of Pay Period:
                        <input min="1" max="28" onChange={(e) => startDate.update(e.target.value)} value={startDate.value} className="text-sm w-8/22 ml-2 py-1 px-2 rounded shadow" type="number"/>
                    </label>
                    <label className="font-medium w-full flex items-center justify-between mt-2">
                        End of Pay Period:
                        <input min="1" max="28" readOnly value={Number(startDate.value)-1 < 1 ? 1 : Number(startDate.value)-1} className="bg-gray-200 cursor-not-allowed text-sm w-8/22 ml-2 py-1 px-2 rounded shadow" type="number"/>
                    </label>
                    <img onMouseOut={handleRemoveHelp} onMouseOver={handleDisplayHelp} className="w-6 mb-4" src="help.svg" alt="help"/>
                    <div className={helpStringCSS}>
                        <p>{helpString}</p>
                    </div>
                </div>
            );
        case 'biweekly':
            let exStart = dayjs().day(dayToNumber(startDay.value))
            let exEnd = exStart.date(exStart.date()+13)

            helpString = `
                This means for the 14 days spanning ${startDay.value}, ${exStart.date()}/${exStart.month()+1} 
                to ${numberToDay(dayToNumber(startDay.value)-1).toLowerCase()}, ${exEnd.date()}/${exEnd.month()+1},
                both days included, you will be paid on ${payOutDay.value} ${exEnd.set('day', dayToNumber(payOutDay.value)).date()}/${exEnd.set('day', dayToNumber(payOutDay.value)).month()+1}
            `

            return (
                <div className="w-full flex justify-center items-center flex-col">
                    <label className="font-medium w-full flex items-center justify-between mt-2">
                        Payed on:
                        
                        <div className=" flex flex-col justify-center items-center w-3/5">
                            <select value={payOutWeek.value} onChange={(e) => payOutWeek.update(e.target.value)} className="text-sm w-full ml-2 bg-white py-1 px-2 rounded shadow" type="number" name="pay-period" id="pay-period">
                                <option value="even">Even Weeks</option>
                                <option value="uneven">Uneven Weeks</option>
                            </select>
                            <select value={payOutDay.value} onChange={(e) => payOutDay.update(e.target.value)} className="mt-2 text-sm w-full ml-2 bg-white py-1 px-2 rounded shadow" type="number" name="pay-period" id="pay-period">
                                <option value="monday">Monday</option>
                                <option value="tuesday">Tuesday</option>
                                <option value="wednesday">Wednesday</option>
                                <option value="thursday">Thursday</option>
                                <option value="friday">Friday</option>
                                <option value="saturday">Saturday</option>
                                <option value="sunday">Sunday</option>
                            </select>
                        </div>
                    </label>
                    <label className="font-medium w-full flex items-center justify-between mt-2">
                        Pay Period starts on:
                        <select  value={startDay.value} onChange={(e) => startDay.update(e.target.value)} className="text-sm w-2/6 ml-2 bg-white py-1 px-2 rounded shadow" type="number" name="pay-period" id="pay-period">
                            <option value="monday">Monday</option>
                            <option value="tuesday">Tuesday</option>
                            <option value="wednesday">Wednesday</option>
                            <option value="thursday">Thursday</option>
                            <option value="friday">Friday</option>
                            <option value="saturday">Saturday</option>
                            <option value="sunday">Sunday</option>
                        </select>
                    </label>
                    <label className="font-medium w-full flex items-center justify-between mt-2">
                        Pay Period ends on:
                        <input readOnly value={numberToDay(dayToNumber(startDay.value)-1)}  className="text-sm w-2/6 ml-2 cursor-not-allowed py-1 px-2 bg-gray-200 rounded shadow" type="text"/>
                    </label>
                    <img onMouseOut={handleRemoveHelp} onMouseOver={handleDisplayHelp} className="w-6 mb-4" src="help.svg" alt="help"/>
                    <div className={helpStringCSS}>
                        <p>{helpString}</p>
                    </div>
                </div>
            )
        case 'weekly':
            exStart = dayjs().day(dayToNumber(startDay.value))
            exEnd = exStart.date(exStart.date()+6)
    
            helpString = `
                This means for the 7 days spanning ${startDay.value}, ${exStart.date()}/${exStart.month()+1} 
                to ${numberToDay(dayToNumber(startDay.value)-1).toLowerCase()}, ${exEnd.date()}/${exEnd.month()+1},
                both days included, you will be paid on ${payOutDay.value} ${exEnd.set('day', dayToNumber(payOutDay.value)).date()}/${exEnd.set('day', dayToNumber(payOutDay.value)).month()+1}
            `
    
            return (
                <div className="w-full flex justify-center items-center flex-col">
                    <label className="font-medium w-full flex items-center justify-between mt-2">
                        Payed on:
                        
                        <div className=" flex flex-col justify-center items-center w-3/5">
                            <select value={payOutDay.value} onChange={(e) => payOutDay.update(e.target.value)} className=" text-sm w-full ml-2 bg-white py-1 px-2 rounded shadow" type="number" name="pay-period" id="pay-period">
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option>
                                <option value="Sunday">Sunday</option>
                            </select>
                        </div>
                    </label>
                    <label className="font-medium w-full flex items-center justify-between mt-2">
                        Pay Period starts on:
                        <select  value={startDay.value} onChange={(e) => startDay.update(e.target.value)} className="text-sm w-2/6 ml-2 bg-white py-1 px-2 rounded shadow" type="number" name="pay-period" id="pay-period">
                            <option value="monday">Monday</option>
                            <option value="tuesday">Tuesday</option>
                            <option value="wednesday">Wednesday</option>
                            <option value="thursday">Thursday</option>
                            <option value="friday">Friday</option>
                            <option value="saturday">Saturday</option>
                            <option value="sunday">Sunday</option>
                        </select>
                    </label>
                    <label className="font-medium w-full flex items-center justify-between mt-2">
                        Pay Period ends on:
                        <input readOnly value={numberToDay(dayToNumber(startDay.value)-1)}  className="text-sm w-2/6 ml-2 cursor-not-allowed py-1 px-2 bg-gray-200 rounded shadow" type="text"/>
                    </label>
                    <img onMouseOut={handleRemoveHelp} onMouseOver={handleDisplayHelp} className="w-6 mb-4" src="help.svg" alt="help"/>
                    <div className={helpStringCSS}>
                        <p>{helpString}</p>
                    </div>
                </div>
            )    
        default:
            return null;
    }   
}