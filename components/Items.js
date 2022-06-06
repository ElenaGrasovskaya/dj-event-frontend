import styles from '@/styles/Items.module.css';
import {useState} from 'react';

import { BsXCircle } from "react-icons/bs";

function Items({items, callback}) {
    console.log("items", items);
      
    const [expense, setExpense] = useState({items: [...items.items, {name:"", price:0, description:"", status:""}]})
    const handleInputChange = (e, index) => {
            const { name, value } = e.target;
                    
            const newItems = expense.items.map((item, i)=>{
                if (i===index)
                {
                    return {...item, [name]:value}
                }
                else return item;
            })

            if (index===newItems.length-1)
            {
                newItems = [...newItems, {name:"", price:0, description:"", status:""}]

           }  
           console.log("result", {items:newItems});  


            setExpense({items:newItems});
            callback({target: {
                name: "items",
                value:{items:newItems},
            }});
            const newExpense = expense.items.reduce((acc, i)=>{return acc+Number(i.price)},0);
              

            
     
    }

    const handleDelete = (e, index) => {
        e.preventDefault();
        const newItems = expense.items.filter((el, i)=>i!==index);

        setExpense({items:newItems});
        callback({target: {
            name: "items",
            value:{items:newItems},
        }});

    }

    
    return (
        <div >
             {expense.items.map((item, index)=>( <div className={styles.itemBlock}>
            <input type='text' id={'item'+index} name='name' value={item.name} onChange={(e)=> handleInputChange(e, index)} />
            <input type='number' id={'item'+index} name='price' value={item.price} onChange={(e)=> handleInputChange(e, index)} />
            <input type='text' id={'item'+index} name='description' value={item.description} onChange={(e)=> handleInputChange(e, index)} />
            <div className={styles.buttonBlock}><button className={styles.deleteButton} onClick={(e)=>handleDelete(e,index)}><BsXCircle/></button>
            <input className={styles.statusCheck} type='checkbox' id={'item'+index} name='status' value={item.status} onChange={(e)=> handleInputChange(e, index)} /></div></div>))}
            
        </div>
    )
}

export default Items;