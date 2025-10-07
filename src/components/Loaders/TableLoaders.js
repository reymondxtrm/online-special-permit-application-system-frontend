import React from 'react'
import Skeleton from 'react-loading-skeleton'
import "react-loading-skeleton/dist/skeleton.css";
const TableLoaders = ({
  col,row
}) => {
  return (
    <>
      {
        [...Array(col)].map((x, index) => (
          <tr key={index + 'placeholder'}>
            {
              [...Array(row)].map((x, index) => (
                <td key={index + 'row'}>
                  <>
                    <Skeleton />
                  </>
                </td>
              ))
            }
          </tr>
        ))
      }
    </>
  )
}

export default TableLoaders