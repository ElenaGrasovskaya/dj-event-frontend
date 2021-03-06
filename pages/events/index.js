
import { API_URL } from "@/config/index";
import HomePage from "pages";


export default function EventsPage(props) 
{

  const { events, flow, expenses } = props;
  return <HomePage events={events} flow ={flow} expenses={expenses}/>
  

}

export async function getServerSideProps() {


  const [res, resFlow, resExpenses] = await Promise.all([
    fetch(`${API_URL}/api/events`), 
    fetch(`${API_URL}/api/flows`),
    fetch(`${API_URL}/api/expenses`)
  ]);
  const [events, flow, expenses] = await Promise.all([
    res.json(), 
    resFlow.json(),
    resExpenses.json()
  ]);

  return {
    props: { events, flow, expenses },
  };
}


/*

{
  const [summ, setSumm] = useState({
    summClientPrice: 0,
    summClientDept: 0,
    summExpenses: 0,
    summPersonalExpenses: 0,
  });

  console.log(events.data);

  useEffect(() => {
    setSumm({
      summClientPrice: events.data.reduce(
        (acc, el) => acc + el.attributes.clientPrice,
        0
      ),

      summClientDept: events.data.reduce(
        (acc, el) => acc + el.attributes.clientDept,
        0
      ),

      summExpenses: events.data.reduce(
        (acc, el) => acc + el.attributes.expenses,
        0
      ),

      summPersonalExpenses: events.data.reduce(
        (acc, el) => acc + el.attributes.expensesPersonal,
        0
      ),
    });
  }, [events]);

  return (
    <Layout>
      <h1>Заказы</h1>

      {events.length === 0 && <h3>No events to show</h3>}
      <div className={styles.eventTitle}>
        <div></div>
        <div>Заказ</div>
        <div>Цена</div>
        <div>Остаток</div>
        <div>Затраты</div>
        <div>Личные</div>
        <div>Закрыт</div>
        <div></div>
      </div>
      {events.data.map((evt) => (
        <EventItem key={evt.id} evt={{ ...evt.attributes, id: evt.id }} />
      ))}
      <div className={styles.results}>
        <div></div>
        <div></div>
        <div>{summ.summClientPrice}</div>
        <div>{summ.summClientDept}</div>
        <div>{summ.summExpenses}</div>
        <div>{summ.summPersonalExpenses}</div>
        <div></div>
        <div></div>
      </div>
      <Link href="/events/add">
        <div className={styles.btnadd}>
          <FaRegPlusSquare />
        </div>
      </Link>
    </Layout>
  );
}

  */
