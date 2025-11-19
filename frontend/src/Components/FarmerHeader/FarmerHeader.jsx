import React from 'react'
import styles from './FarmerHeader.module.css'
import bag from '../../Asset/Image/Famlogo.jpg'
import { useNavigate } from 'react-router-dom'
const FarmerHeader = () => {
 const navigate =useNavigate()
  return (
    
    
    <header className={styles.header}>
         <img style={{height:'inherit'}}
        className={styles.preview15}
        loading="lazy"
        alt=""
        src={bag}
      />

      <h5 className='text-white' style={{cursor:'pointer'}} onClick={()=>navigate('/')}>Home</h5>

    </header>
  )
}

export default FarmerHeader
