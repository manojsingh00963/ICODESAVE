import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addToPastes } from './redux/features/pasteSlice'

export function Counter() {
    
  const count = useSelector((state) => state.counter.value);

  const dispatch = useDispatch();

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(addToPastes())}
        >
          Increment
        </button>
        <span>{count}</span>
      </div>
    </div>
  )
}