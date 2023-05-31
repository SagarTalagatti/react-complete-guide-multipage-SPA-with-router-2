import { Suspense } from "react";
import { useLoaderData, json, defer, Await } from "react-router-dom";

import EventsList from "../components/EventsList";

function EventsPage() {
  const data = useLoaderData();

  //   if (data.isError) {
  //     return <p>{data.message}</p>;
  //   }

  // const events = data.events;

  // return <EventsList events={events} />;
  // return <EventsList />

  // we use Await when using defer. The content inside Await component must be a function that will be executed once the promise is resolved.
  return (
    // Suspense component can be used in some special situations to show a fallback where we are waiting for some data to arrive.
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
      <Await resolve={data.events}>
        {(loadedEvents) => <EventsList events={loadedEvents} />}
      </Await>
    </Suspense>
  );
}

export default EventsPage;

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

export function loader() {
  // in defer, the methods we call must return a promise, because the concept of defer is based on getting back a promise which will eventually resolve to a value.
  return defer({
    events: loadEvents(),
  });
}
