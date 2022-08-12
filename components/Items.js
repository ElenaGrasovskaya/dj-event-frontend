import styles from "@/styles/Items.module.css";
import { useState, useRef, useEffect } from "react";

import { BsXCircle } from "react-icons/bs";

function Items({ items, callback }) {
  const [expense, setExpense] = useState({
    items: [
      ...items.items,
      { name: "", price: 0, description: "", status: false },
    ],
  });

  const handleInputChange = (e, index) => {
    let { name, value, checked } = e.target;

    let newItems;

    if (name === "status") {
      newItems = expense.items.map((item, i) => {
        if (i === index) {
          return { ...item, status: checked };
        } else return item;
      });
    } else {
      newItems = expense.items.map((item, i) => {
        if (i === index) {
          return { ...item, [name]: value };
        } else return item;
      });
    }

    if (index === newItems.length - 1) {
      newItems = [
        ...newItems,
        { name: "", price: 0, description: "", status: false },
      ];
    }

    setExpense({ items: newItems });
    callback({
      target: {
        name: "items",
        value: { items: newItems },
      },
    });
    const newExpense = expense.items.reduce((acc, i) => {
      return acc + Number(i.price);
    }, 0);
  };
  const handleKeyPress = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInputChange(e, index);
      if (e.target.id === "item_name" + index) {
        document.getElementById(`item_value${index}`).focus();
      } else {
        document.getElementById(`item_name${index + 1}`).focus();
      }
    }
  };
  const handleDelete = (e, index) => {
    e.preventDefault();
    const newItems = expense.items.filter((el, i) => i !== index);

    setExpense({ items: newItems });
    callback({
      target: {
        name: "items",
        value: { items: newItems },
      },
    });
  };

  return (
    <div className={styles.itemsBlock}>
      {expense.items.map((item, index) => (
        <div className={styles.itemBlock} key={index + 100}>
          <input
            type="text"
            id={"item_name" + index}
            name="name"
            value={item.name}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onChange={(e) => handleInputChange(e, index)}
          />
          <input
            type="number"
            id={"item_value" + index}
            name="price"
            value={item.price}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onChange={(e) => handleInputChange(e, index)}
          />
          <div className={styles.buttonBlock}>
            <button
              className={styles.deleteButton}
              onClick={(e) => handleDelete(e, index)}
            >
              <BsXCircle />
            </button>
            <input
              className={styles.statusCheck}
              type="checkbox"
              id={"item" + index}
              name="status"
              checked={item.status}
              onChange={(e) => handleInputChange(e, index)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Items;
