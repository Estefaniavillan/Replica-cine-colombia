import { useContext, useEffect, useState } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import { getMovie } from "../services/movieServices";
import SelectedTimeContext from "./context/SelectedTimeContext";
import TicketContext from "./context/TicketContext";
import ComplextCine from "./context/ComplextCine";

export default function Summary() {
  const { idMovie } = useParams();
  const [movieInfo, setMovieInfo] = useState(null);
  const { selectedTime } = useContext(SelectedTimeContext);
  const { tickets } = useContext(TicketContext);
  const navigate = useNavigate();
  const { theatreName } = useContext(ComplextCine);
  const [scheduleConfirmed, setScheduleConfirmed] = useState(false);

  useEffect(() => {
    const fetchMovieInfo = async () => {
      try {
        const movieInfo = await getMovie(idMovie);
        setMovieInfo(movieInfo);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMovieInfo();
  }, [idMovie]);

  const handleConfirmSchedule = () => {
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace('/tickets', '/seats');
    navigate(newPath, { replace: true });
    console.log("continuar");
    setScheduleConfirmed(true);
  };

  const handleConfirmPay = () => {
    if (!scheduleConfirmed) {
      handleConfirmSchedule();
      setScheduleConfirmed(true);
    } else {
      const currentPath = window.location.pathname;
      const newPath = currentPath.replace('/seats', '/pago');
      navigate(newPath, { replace: true });
      console.log("continuar");
    }
 };

  const adultPrice = 71;
  const childPrice = 56;
  const seniorPrice = 56;

  const calculateTotalPriceWithIVA = (adultTickets, childTickets, seniorTickets, adultPrice, childPrice, seniorPrice) => {
    const subtotal =
      adultTickets * adultPrice +
      childTickets * childPrice +
      seniorTickets * seniorPrice;
    const iva = 0.19; // 19%
    const totalPriceWithIVA = subtotal * (1 + iva);
    return totalPriceWithIVA;
  };

  const totalPrice = calculateTotalPriceWithIVA(
    tickets.adultTickets,
    tickets.childTickets,
    tickets.seniorTickets,
    adultPrice,
    childPrice,
    seniorPrice
  ).toFixed(2);
  
  

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <>
      <div className="flex justify-between w-4/5 m-20 mx-auto">
        <Outlet />
        <section className="bg-[#F4F4F4FF] w-[43%] h-[57%] p-4 rounded-lg">
          <h2 className="text-2xl font-epilogue font-bold text-gray-600 pb-3">
            Resumen de compra
          </h2>

          <div className="font-roboto text-lg">
            {movieInfo && (
              <figure className="flex gap-3">
                <img
                  className={`shadow-sm w-[5.6rem] h-[8rem] p-1 pb-3 border-2`}
                  src={`https://image.tmdb.org/t/p/w500/${movieInfo.poster_path}`}
                  alt={movieInfo.title}
                />
                <figcaption>
                  <p>
                    <span className="font-bold">Pelicula:</span>{" "}
                    {movieInfo.title}
                  </p>
                  <p>
                    <span className="font-bold">Complejo:</span> {theatreName}
                  </p>
                  <p>
                    <span className="font-bold">Fecha:</span> {formattedDate}
                  </p>
                  <p>
                    <span className="font-bold">Función:</span> {selectedTime}
                  </p>
                  <div className="flex flex-wrap">
                    <p>
                      <span className="font-bold">Boletos:</span>
                    </p>
                    {tickets.adultTickets > 0 && (
                      <p>&nbsp;Adultos({tickets.adultTickets})&nbsp;</p>
                    )}
                    {tickets.childTickets > 0 && (
                      <p>&nbsp;Niños({tickets.childTickets})&nbsp;</p>
                    )}
                    {tickets.seniorTickets > 0 && (
                      <p>&nbsp;3ra Edad({tickets.seniorTickets})&nbsp;</p>
                    )}
                  </div>
                </figcaption>
              </figure>
            )}
            <section className="p-1">
              <p className="pt-8 pb-4">
                Se realizara un cargo por servicio por cada boleto dentro de la
                orden.
              </p>
              <div className="flex justify-between font-bold">
                <p>{`Total(IVA incluido):`}</p>
                <p className="text-[2.563rem]">${totalPrice}</p>
              </div>

              <div className="flex justify-center pt-7">
                <button
                  className="bg-slate-400 p-2 text-white rounded-full hover:bg-blue-950 w-[94%]"
                  onClick={handleConfirmPay}
                >
                  Continuar
                </button>
              </div>
            </section>
          </div>
        </section>
      </div>
    </>
  );
}
