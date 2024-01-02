import Layout from '@/components/Layout';
import { API_URL } from '@/config/index';
import Link from 'next/link';
import Image from 'next/image';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AuthContext from '@/context/AuthContext';
import LoginPage from './account/login';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsFillQuestionSquareFill } from 'react-icons/bs';
import { BsFillCheckSquareFill } from 'react-icons/bs';
import styles from '@/styles/Home.module.css';
import { BiArchiveIn } from 'react-icons/bi';
import { BiArchiveOut } from 'react-icons/bi';
import { FaWrench } from 'react-icons/fa';
import moment from 'moment';

import Alert from 'react-bootstrap/Alert';

export default function HomePage(props) {
  const { events, flow, expenses, sharedExpenses, backups } = props;
  console.log("events", events);
  console.log("flow", flow);
  console.log("sharedExpenses", sharedExpenses);

  const sortedEvents = events.data.sort((a, b) => {
    return (
      new Date(a.attributes.createdAt).getTime() -
      new Date(b.attributes.createdAt).getTime()
    );
  });

  const [summ, setSumm] = useState({
    summClientPrice: 0,
    summClientDept: 0,
    summInterest: 0,
    summSalary: 0,
    summSalaryMax: 0,
    summPersonalExpenses: 0,
    summFlow: 0,
    summExpenses: 0,
    summSharedExpenses: 0,
  });

  const [show, setShow] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    setSumm({
      summClientPrice: events.data.reduce(
        (acc, el) =>
          !el.attributes.hidden || show ? acc + el.attributes.clientPrice : acc,
        0
      ),

      summClientDept: events.data.reduce(
        (acc, el) =>
          !el.attributes.hidden || show ? acc + el.attributes.clientDept : acc,
        0
      ),
      summInterest: events.data.reduce(
        (acc, el) =>
          !el.attributes.hidden && el.attributes.status
            ? acc + el.attributes.interest
            : acc,
        0
      ),

      summSalary: events.data.reduce(
        (acc, el) =>
          !el.attributes.hidden && el.attributes.status
            ? acc + el.attributes.salary
            : acc,
        0
      ),
      summSalaryMax: events.data.reduce(
        (acc, el) =>
          !el.attributes.hidden && el.attributes.status
            ? acc + el.attributes.salaryMax
            : acc,
        0
      ),

      summPersonalExpenses: events.data.reduce(
        (acc, el) =>
          !el.attributes.hidden || show
            ? acc + el.attributes.expensesPersonal
            : acc,
        0
      ),

      summFlow: flow.data.reduce(
        (acc, el) => (!el.attributes.hidden ? acc + el.attributes.value : acc),
        0
      ),

      summExpenses: expenses.data.reduce(
        (acc, el) => (!el.attributes.hidden ? acc + el.attributes.value : acc),
        0
      ),

      summExpenses: sharedExpenses.data.reduce(
        (acc, el) => (!el.attributes.hidden ? acc + el.attributes.value : acc),
        0
      ),
    });
  }, []);

  return (
    <>
      {user && events.data ? (
        <Layout backup={events.data}>
          <h1>Заказы</h1>
          {events.data.length === 0 && <h3>Нет подходящих заказов</h3>}
          <Button onClick={() => setShow(!show)}>Показать все</Button>{' '}
          <Button variant='info' onClick={() => router.push(`/flow`)}>
            Авансы
          </Button>{' '}
          <Button variant='warning' onClick={() => router.push(`/expenses`)}>
            Расходы
          </Button>{' '}
          <Button
            variant='danger'
            onClick={() => router.push(`/shared-expenses`)}
          >
            Расходы 1/2
          </Button>{' '}
          <Table striped hover responsive='md' className={styles.tableCenter}>
            <thead>
              <tr>
                <th>#</th>
                <th></th>
                <th>Заказ</th>
                <th>Стоимость</th>
                <th>Авансы</th>
                <th>Остаток</th>
                <th>Прибыль</th>
                <th>M-60%</th>
                <th>C-40%</th>
                <th>Дата</th>

                <th>Закрыт</th>
                <th>В архиве</th>
              </tr>
            </thead>
            <tbody>
              {events.data.map((evt, index) =>
                !evt.attributes.hidden || show ? (
                  <tr key={100 + index}>
                    <td>{index + 1}</td>
                    <Link
                      href={`/events/edit/${evt.attributes.slug}`}
                      key={110 + index}
                    >
                      <td>
                        <Image
                          key={120 + index}
                          src={
                            evt.attributes.image_url ||
                            '/images/sample/furniture.png'
                          }
                          width={30}
                          height={30}
                        />
                      </td>
                    </Link>

                    <td className={styles.kitchenName}>
                      <Link
                        href={`/events/edit/${evt.attributes.slug}`}
                        key={120 + index}
                      >
                        <strong className={styles.clickableLink}>
                          {evt.attributes.title}
                        </strong>
                      </Link>
                    </td>

                    <td>{evt.attributes.clientPrice}</td>
                    <td>{evt.attributes.clientPrepay}</td>

                    <td>{evt.attributes.clientDept}</td>
                    <td>
                      {evt.attributes.status ? evt.attributes.interest : ''}
                    </td>
                    <td>
                      {evt.attributes.status ? evt.attributes.salaryMax : ''}
                    </td>

                    <td>
                      {evt.attributes.status ? evt.attributes.salary : ''}
                    </td>
                    <td>
                      {moment(evt.attributes.createdAt).format('DD.MM.YY')}
                    </td>

                    <td key={180 + index}>
                      {evt.attributes.status ? (
                        <div className={styles.checkboxGreen}>
                          <BsFillCheckSquareFill />
                        </div>
                      ) : (
                        <div className={styles.checkboxRed}>
                          <FaWrench />
                        </div>
                      )}
                    </td>
                    <td key={190 + index}>
                      {evt.attributes.hidden ? (
                        <div className={styles.checkboxGreen}>
                          <BiArchiveIn />
                        </div>
                      ) : (
                        <div className={styles.checkboxRed}>
                          <BiArchiveOut />
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  <></>
                )
              )}
            </tbody>
            <thead>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <strong>{summ.summSalaryMax.toFixed(1)}</strong>
                </td>
                <td>
                  <strong>{summ.summSalary.toFixed(1)}</strong>
                </td>

                <td colSpan={2}>
                  {' '}
                  <Link href='/events/add'>
                    <div className='d-grid gap-2'>
                      <Button variant='primary' size='md'>
                        Новый заказ
                      </Button>
                    </div>
                  </Link>
                </td>
              </tr>
            </thead>
          </Table>
          <Table borderless>
            <tbody>
              <tr>
                <td>
                  <Alert className={'mb-0 p-0'} variant='warning'>
                    <h4 className={'mb-0'}>Макс 60%:</h4>
                  </Alert>
                </td>
                <td>
                  <Alert className={'mb-0 p-0'} variant='warning'>
                    <h4 className={'mb-0'}>{summ.summSalaryMax.toFixed(1)}</h4>
                  </Alert>
                </td>
              </tr>
              <tr>
                <td>
                  <Alert className={'mb-0 p-0'} variant='primary'>
                    <h4 className={'mb-0'}>Cергей 40%:</h4>
                  </Alert>
                </td>
                <td>
                  <Alert className={'mb-0 p-0'} variant='primary'>
                    <h4 className={'mb-0'}>{summ.summSalary.toFixed(1)}</h4>
                  </Alert>
                </td>
              </tr>
              <tr>
                <td>
                  <Alert className={'mb-0 p-0'} variant='info'>
                    <h4 className={'mb-0'}>Сергей Авансы:</h4>
                  </Alert>
                </td>
                <td>
                  <Alert className={'mb-0 p-0'} variant='info'>
                    <h4 className={'mb-0'}>{`-${summ.summFlow.toFixed(1)}`}</h4>
                  </Alert>
                </td>
              </tr>
              <tr>
                <td>
                  <Alert className={'mb-0 p-0'} variant='info'>
                    <h4 className={'mb-0'}>Сергей Расходы:</h4>
                  </Alert>
                </td>
                <td>
                  <Alert className={'mb-0 p-0'} variant='info'>
                    <h4 className={'mb-0'}>{`${summ.summExpenses.toFixed(
                      1
                    )}`}</h4>
                  </Alert>
                </td>
              </tr>
              <tr>
                <td>
                  <Alert className={'mb-0 p-0'} variant='info'>
                    <h4 className={'mb-0'}>Сергей Расходы 1/2:</h4>
                  </Alert>
                </td>
                <td>
                  <Alert className={'mb-0 p-0'} variant='info'>
                    <h4 className={'mb-0'}>{`${summ.summSharedExpenses.toFixed(
                      1
                    )}`}</h4>
                  </Alert>
                </td>
              </tr>
              <tr>
                <th>
                  <Alert className={'mb-0 p-0 lg'} variant='dark'>
                    <h4 className={'mb-0'}>
                      Сергей <strong>ЗП</strong> (40% - Авансы):
                    </h4>
                  </Alert>
                </th>
                <th>
                  <Alert className={'mb-0 p-0 lg'} variant='dark'>
                    <h4 className={'mb-0'}>
                      {(summ.summSalary - summ.summFlow).toFixed(1)}
                    </h4>
                  </Alert>
                </th>
              </tr>

              <tr>
                <th>
                  <Alert className={'mb-0 p-0 lg'} variant='dark'>
                    <h4 className={'mb-0'}>
                      Сергей <strong>Остаток</strong> (ЗП + Расходы + Расходы
                      1/2):
                    </h4>
                  </Alert>
                </th>
                <th>
                  <Alert className={'mb-0 p-0 lg'} variant='dark'>
                    <h4 className={'mb-0'}>
                      {(
                        summ.summSalary -
                        summ.summFlow +
                        summ.summExpenses +
                        summ.summSharedExpenses
                      ).toFixed(1)}
                    </h4>
                  </Alert>
                </th>
              </tr>
            </tbody>
          </Table>
        </Layout>
      ) : (
        <LoginPage />
      )}
    </>
  );
}

/*export async function getStaticProps() {
  const res = await fetch(`${API_URL}/api/events`);
  const events = await res.json();

  return {
    props: { events },
    revalidate: 1,
  };
}

            <tr>
             <td><Alert className={"mb-0 p-0"} variant="warning"><h4 className={"mb-0"}>Расходы:</h4></Alert></td>
              <td><Alert className={"mb-0 p-0"} variant="warning"><h4 className={"mb-0"}>{summ.summExpenses.toFixed(1)}</h4></Alert></td>
            </tr>

                        <tr>
              <td><Alert className={"mb-0 p-0"} variant="danger"><h4 className={"mb-0"}>Личные:</h4></Alert></td>
              <td><Alert className={"mb-0 p-0"} variant="danger"><h4 className={"mb-0"}>{summ.summPersonalExpenses.toFixed(1)}</h4></Alert></td>
            </tr>
*/

export async function getServerSideProps() {
  const [res, resFlow, resExpenses, resSharedExpenses, resBackups] =
    await Promise.all([
      fetch(`${API_URL}/api/events`),
      fetch(`${API_URL}/api/flows`),
      fetch(`${API_URL}/api/expenses`),
      fetch(`${API_URL}/api/shared-expenses`),
      fetch(`${API_URL}/api/backups`),
    ]);
  const [events, flow, expenses, sharedExpenses, backups] = await Promise.all([
    res.json(),
    resFlow.json(),
    resExpenses.json(),
    resSharedExpenses.json(),
    resBackups.json(),
  ]);

  return {
    props: { events, flow, expenses, sharedExpenses, backups },
  };
}

/*{evt.attributes.status?(evt.attributes.clientPrice?(`${(
                      (evt.attributes.interest / evt.attributes.clientPrice) *
                      100
                    ).toFixed(1)}%`):0):""}
                    
                    <strong>{summ.summInterest.toFixed(1)}</strong>
                    */
