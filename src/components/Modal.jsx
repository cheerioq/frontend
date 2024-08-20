import React from 'react'
import {RiCloseLine} from "react-icons/ri"
import "./Modal.css";
import { useNavigate } from 'react-router-dom';

export default function Modal({ setModalOPen }) {
  const navigate = useNavigate()
  return (
    <div className="darkBg" onClick={()=>setModalOPen(false)}>
            <div className="centered">
<div className='modal'>
        {/* //modal header */}
      <di className="modalHeader">
        <h5 className=''>confirm</h5>
      </di>
      <button className='closeBtn' onClick={()=>setModalOPen(false)}>
        <RiCloseLine></RiCloseLine>
      </button>
      {/* modal content */}
      <div className="modalContent">
        Are you confirm to logout
      </div>
      <div className="modalAction">
        <div className="actionContainer">
            <button className='logout-btn' onClick={()=>{
              setModalOPen(false);
              localStorage.clear();
              navigate("./signin")
            }}>Log Out</button>
            <button className='cancel-btn' onClick={()=>setModalOPen(false)}>Cancel</button>
        </div>
      </div>
    </div>
    </div>
    
    </div>

  )
}
