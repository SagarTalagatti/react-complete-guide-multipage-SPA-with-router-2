import { json, useLoaderData /*useParams*/ } from "react-router-dom";
import EventItem from "../components/EventItem";

function EventDetailPage() {
  //   const params = useParams();

  //   const eventId = params.eventId;

  const data = useLoaderData();

  return (
    // <>
    //   <h1>Event Detail Page</h1>
    //   <p>Event Id: {eventId}</p>
    // </>
    <EventItem event={data.event} />
  );
}

export default EventDetailPage;

// when react router calls the loader function for us, it will pass an object to it as argument, which contains a request and params.
export async function loader({ request, params }) {
  const eventId = params.eventId;

  const response = await fetch(`http://localhost:8088/events/${eventId}`);

  if (!response.ok) {
    throw json(
      { message: "Could not fetch details for the selected event." },
      {
        status: 500,
      }
    );
  } else {
    return response;
  }
}
