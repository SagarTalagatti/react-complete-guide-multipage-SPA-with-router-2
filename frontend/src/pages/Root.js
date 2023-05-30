import { Outlet, /*useNavigation*/ } from "react-router-dom";

import MainNavigation from "../components/MainNavigation";

function RootLayout() {
  // we can use useNavigation() to get a navigation object that has a state property which tells us the current navigation state as 'idle' or 'loading' or 'submitting' and we can use it to show a loading spinner or some other content to inform the user that we are loading.
  // const navigation = useNavigation();

  return (
    <>
      <MainNavigation />
      <main>
        {/* {navigation.state === "loading" && <p>Loading...</p>} */}
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
