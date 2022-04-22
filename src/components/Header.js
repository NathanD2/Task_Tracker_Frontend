// rafce => arrow function that exports on bottom
// import React from 'react'
import PropTypes from 'prop-types'
import Button from './Button'

// Able to see route we are currently on.
import { useLocation } from 'react-router-dom'  

const Header = ({ title, onAdd, showAdd }) => {
    // See current path
     const location = useLocation()

    return (
        <header className='header'>
            <h1 >{title}</h1>
            {
                // && Short hand ternary operator without else.
                location.pathname === '/' && <Button color={showAdd ? 'red' : 'green'} text={showAdd ? 'Close' : 'Add'} onClick={onAdd }/>
            }
        </header>
    )
}
// or
// const Header = (props) => {
//     return (
//       <header>
//           <h1>{props.title}</h1>
//       </header>
//     )
//   }

// Default Values
Header.defaultProps = {
    title: "Task Tracker",
}

// A way of type safing. Still renders though.
Header.propTypes = {
    title: PropTypes.string.isRequired,
}

// CSS in JS.
// const headingStyle = {
//     color: 'red',
//     backgroundColor: 'black'
// }

export default Header