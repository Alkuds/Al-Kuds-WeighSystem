
import React from 'react'
import inventory from '../assets/images/inventory_icon.PNG';
const Impexp = () => {
  return (
    
    <div style={{direction:"rtl"}}>
      <div className=''>
      <img src={inventory} alt="ohoh" />
      <h1>الجرد اليومي</h1>
      </div>
      <table style={{direction:"rtl"}}>
        <thead>
          <tr>
            <th>الحديد</th>
            <th>القطر</th>
            <th>العميل</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>January</td>
            <td>$100</td>
            <td>$100</td>
          </tr>
          <tr>
            <td>February</td>
            <td>$80</td>
            <td>$80</td>
          </tr>
        </tbody>
      </table>

    </div>
  )
}

export default Impexp