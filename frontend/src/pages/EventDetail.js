import { Suspense } from "react";
import {
  defer,
  json,
  redirect,
  useRouteLoaderData /* useLoaderData */ /*useParams*/,
  Await,
} from "react-router-dom";
import EventItem from "../components/EventItem";
import EventsList from "../components/EventsList";

function EventDetailPage() {
  // const params = useParams();

  // const eventId = params.eventId;

  // const data = useLoaderData();

  // we use useRouteLoaderData to get access to a higher level loader from a route that doesn't have a loader
  const data = useRouteLoaderData("event-detail");

  return (
    // <>
    //   <h1>Event Detail Page</h1>
    //   <p>Event Id: {eventId}</p>
    // </>

    //each Await should have be wrapped in its own Suspense because otherwise, the Suspense will wait for both Awaits to complete.
    <>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={data.event}>
          {(loadedEvent) => <EventItem event={loadedEvent} />}
        </Await>
      </Suspense>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={data.events}>
          {(loadedEvents) => <EventsList events={loadedEvents} />}
        </Await>
      </Suspense>
    </>
  );
}

export default EventDetailPage;

async function loadEvent(id) {
  const response = await fetch(`http://localhost:8088/events/${id}`);

  if (!response.ok) {
    throw json(
      { message: "Could not fetch details for the selected event." },
      {
        status: 500,
      }
    );
  } else {
    const resData = await response.json();
    return resData.event;
  }
}

async function loadEvents() {
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

    // returning a response works when its directly received by useLoaderData, but when we use defer step in between, it won't work.
    // return response;

    // below 2 lines of code to make it work with defer.
    const resData = await response.json();
    return resData.events;
  }
}

// when react router calls the loader function for us, it will pass an object to it as argument, which contains a request and params.
export async function loader({ request, params }) {
  const eventId = params.eventId;

  return defer({
    // event: loadEvent(eventId),

    // the await keyword tells defer to wait for that data to be loaded before loading that page component at all, but on the other hand, it will load the data of loadEvents after the page was loaded. In this example, it makes sure that we never see the loading text for EventDetails.
    event: await loadEvent(eventId),
    events: loadEvents(),
  });
}

export async function action({ request, params }) {
  const eventId = params.eventId;

  const response = await fetch("http://localhost:8088/events/" + eventId, {
    method: request.method,
  });

  if (!response.ok) {
    throw json(
      { message: "Could not delete the event." },
      {
        status: 500,
      }
    );
  }
  return redirect("/events");
}
