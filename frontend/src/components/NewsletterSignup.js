import { useEffect } from "react";
import { useFetcher } from "react-router-dom";

import classes from "./NewsletterSignup.module.css";

function NewsletterSignup() {
  // useFetcher when called returns an object that has some useful properties and methods. For ex: it gives us a Form component that is different from the Form defined in react-router-dom, a submit function which is different from the submit function we get with useSubmit.
  // hence, we must use useFetcher if we want to trigger a loader or an action without actually loading the route to which the loader or action belongs.
  const fetcher = useFetcher();
  const { data, state } = fetcher;

  useEffect(() => {
    if (state === "idle" && data && data.message) {
      window.alert(data.message);
    }
  }, [data, state]);

  return (
    // fetcher.Form will still trigger an action but it will not initialize a route transition. Therefore, in below example, we trigger action of Newsletter route but we don't load the element that belongs to that route.
    <fetcher.Form
      method="post"
      action="/newsletter"
      className={classes.newsletter}
    >
      <input
        type="email"
        placeholder="Sign up for newsletter..."
        aria-label="Sign up for newsletter"
      />
      <button>Sign up</button>
    </fetcher.Form>
  );
}

export default NewsletterSignup;
