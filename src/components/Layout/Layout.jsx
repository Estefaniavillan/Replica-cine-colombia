import { NavBar } from '../NavBar/NavBar'
import { Outlet } from 'react-router-dom'
import Carousel from '../Carousel'
import SelectedTimeContext from '../context/SelectedTimeContext';
import { TicketProvider } from '../context/TicketContext';
import { useState } from 'react';
import { createContext } from 'react';
import SelectedGenerContext from '../NavBar/SelectedGenerContext';
import ComplextCine from '../context/ComplextCine';
import RoomContext from '../context/RoomContext';

export const SelectedMoviesContext = createContext();

const Layout = () => {
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedTime, setSelectedTime] = useState("");
  const [theatreName, setTheatreName] = useState(null);
  const [room, setRoom] = useState(null)

  const [selectedMovies, setSelectedMovies] = useState([]);
  
  return (
    <>
    <TicketProvider>
      <RoomContext.Provider value={{room, setRoom}}>
      <ComplextCine.Provider value={{ theatreName, setTheatreName }}>
      <SelectedGenerContext.Provider value={{ selectedGenre, setSelectedGenre}}>
      <SelectedTimeContext.Provider value={{ selectedTime, setSelectedTime }}>
      <SelectedMoviesContext.Provider value={{ selectedMovies, setSelectedMovies }}>
    <div>
          <NavBar setSelectedMovies={setSelectedMovies} />
          <Carousel selectedMovies={selectedMovies}/>
          <Outlet/>
        </div>
    </SelectedMoviesContext.Provider>
    </SelectedTimeContext.Provider>
    </SelectedGenerContext.Provider>
    </ComplextCine.Provider>
    </RoomContext.Provider>
    </TicketProvider>
    </>
  );
};

export default Layout;
