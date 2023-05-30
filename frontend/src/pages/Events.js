import { useLoaderData, json } from "react-router-dom";

import EventsList from "../components/EventsList";

function EventsPage() {
  const data = useLoaderData();

  //   if (data.isError) {
  //     return <p>{data.message}</p>;
  //   }

  const events = data.events;

  return <EventsList events={events} />;
  //   return <EventsList />
}

export default EventsPage;

export async function loader() {
  const response = await fetch("http://localhost:8088/events");

  if (!response.ok) {
    // returning a custom object containing error state and message is one way of handling errors.
    // return { isError: true, message: "Could not fetch events." };

    // when an error is thrown in loader, React router will render the closest error element
    // throw { message: "Could not fetch events." };

    // throw new Response(JSON.stringify({ message: "Could not fetch events." }), {
    //   status: 500,
    // });

    // json is a utility function provided by react router dom that allows us to throw an object, which we need not parse using JSON.parse() in the place where it is received.
    throw json(
      { message: "Could not fetch events!" },
      {
        status: 500,
      }
    );
  } else {
    // const resData = await response.json();

    // const res = new Response("any data", { status: 201 });

    // we can return any kind of data from a loader function.
    // return resData.events;
    // return res;
    return response;
  }
}
