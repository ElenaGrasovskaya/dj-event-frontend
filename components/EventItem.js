import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/EventItem.module.css";
import { API_URL } from "@/config/index";
import { useRouter } from "next/router";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

export default function EventItem({ evt }) {
  const router = useRouter();
  console.log("evt", evt);

  const deleteEvent = async (e) => {
    if (confirm("Are you sure?")) {
      const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.massage);
      } else {
        router.push("/events");
      }
    }
  };
  return (

    <div className={styles.event}>
     
      <Link href={`/events/edit/${evt.slug}`}>
        <div className={styles.img}>
          <Image
            src={evt.image_url || "/images/sample/furniture.png"}
            width={30}
            height={30}
          />
        </div>
      </Link>
      <Link href={`/events/edit/${evt.slug}`}>
        <div className={styles.title}>
          <h2>{evt.title}</h2>
        </div>
      </Link>

      <div>
        <h3>{evt.clientPrice}</h3>
      </div>
      <div>
        <h3>{evt.clientDept}</h3>
      </div>

      <div>
        <h3>{evt.expenses}</h3>
      </div>
      <div>
        <h3>{evt.expensesPersonal}</h3>
      </div>
      <div>
        <input type="checkbox" checked={evt.status} readOnly className={styles.checkbox}/>
      </div>

      <div className={styles.delete}>
        <Link href={`/events`}>
          <a href="#" className={styles.delete} onClick={deleteEvent}>
            <FaTimes />
          </a>
        </Link>
      </div>
    </div>
  );
}
