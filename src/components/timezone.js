import React from 'react'
import './timezone.css';
export default function timezone(props) {
    let num = Number(props.name);
    let min = Math.abs((num/60)%60);
    let hr = Math.abs(Math.floor((num/60)/60));
    let sig = "+"
    num>0?( sig="+"):(sig="-");
    min<10?(min=0+ min.toString()):(min.toString());
    return (
        <div className="t1">
            <>&nbsp;(GMT<b>{sig}</b>{hr}:{min})</>
        </div>
    )
}
