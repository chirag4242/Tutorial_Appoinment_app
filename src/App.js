import { useState, useEffect, useCallback } from "react";
import { BiCalendar } from "react-icons/bi"
import Search from "./components/Search";
import AddAppoinments from './components/AddAppoinments'
import AppointmentInfo from "./components/AppoinmentInfo"

export function App()
{

  const [appoinmentList, setAppoinmentList] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("petName");
  const [orderBy, setOrderBy] = useState("asc");
  const filteredAppoinments = appoinmentList.filter(item =>
  {
    return (
      item.petName.toLowerCase().includes(query.toLowerCase()) ||
      item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
      item.aptNotes.toLowerCase().includes(query.toLowerCase())
    )
  }
  ).sort((a, b) =>
  {
    let order = (orderBy === 'asc') ? 1 : -1;
    return (a[sortBy].toLowerCase() < b[sortBy].toLowerCase()
      ? -1 * order : 1 * order)
  }
  )
  const fetchData = useCallback(() =>
  {
    fetch("./data.json").then(response => response.json())
      .then(data =>
      {
        setAppoinmentList(data)
      });
  }, []);

  useEffect(() =>
  {
    fetchData();
  }, [fetchData]);

  return <div className="container mx-auto mt-3 font-thin">
    <h1 className="text-5xl"><BiCalendar className="inline-block text-red-400" />Your Appiontment</h1>
    <AddAppoinments onSendAppointment={myAppointment => setAppoinmentList([...appoinmentList, myAppointment])}
      lastId={appoinmentList.reduce((max, item) => Number(item.id) > max ? Number(item.id) : max, 0)} />
    <Search
      query={query}
      onQueryChange={getQuery => setQuery(getQuery)}
      orderBy={orderBy}
      onOrderByChange={mySort => setOrderBy(mySort)}
      sortBy={sortBy}
      onSortByChange={mySort => setSortBy(mySort)}
    />
    <ul className="divide-y divide-gray-200">
      {
        filteredAppoinments.map(appoinment => (
          <AppointmentInfo
            key={appoinment.id}
            id={appoinment.id}
            petName={appoinment.petName}
            aptDate={appoinment.aptDate}
            ownerName={appoinment.ownerName}
            aptNotes={appoinment.aptNotes}
            onDeleteAppointment={
              appoinmentId =>
              {
                setAppoinmentList(appoinmentList.filter(appoinment => appoinment.id !== appoinmentId))
              }
            }
          />
        ))
      }
    </ul>
  </div>;
}

export default App;
