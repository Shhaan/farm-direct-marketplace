import React from 'react'
import headercss from './Header.module.css'
import logo from '../../Asset/Image/Famlogo.jpg'
 

const Header = ({admin}) => {

  const headerStyle = {
    backgroundColor: admin  ? '#44496D' : '#005F40' 
  };

  return (
  
    <div className={headercss.Header}  style={headerStyle}>
        

        
        {admin ? <h1 className={headercss.heading}>FarmAid</h1> : <img className={headercss.logo} src={logo} alt="Logo" />}



        </div>
 
  )
}

export default Header