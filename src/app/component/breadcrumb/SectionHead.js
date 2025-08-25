import React from 'react'

const SectionHead = ({icon , headertext }) => {
  return (
    <h2 className="text-3xl font-bold flex items-center gap-3 text-gray-800">
        {icon && <span className="text-black">{icon}</span>}
        {headertext}
        
    </h2>
  )
}

export default SectionHead