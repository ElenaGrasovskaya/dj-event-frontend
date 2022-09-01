import { RiScreenshot2Fill } from "react-icons/ri";
import { API_URL } from "@/config/index";
import Button from "react-bootstrap/Button";


export default function Backup(data) {
  
  const saveNewBackup = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/api/backups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: {orders:data, date: new Date()}}),
    });
    if (!res.ok) {
      alert("Something went wrong");
    } else {
      const data = await res.json();
      console.log("Backups saved", data)

    }

  }

  return (
    <Button onClick={saveNewBackup} variant="light">
      <RiScreenshot2Fill />
    </Button>
  );
}
