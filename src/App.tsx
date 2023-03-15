import { Profiler, useDeferredValue, useEffect, useState } from "react";
import { fetchUsers } from "./data/usersSlice";
import { useAppDispatch, useAppSelector } from "./store";

function App() {
  const [pageNumber, setPageNumber] = useState("");
  const deferredPageNumber = useDeferredValue(pageNumber);
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.users);
  const status = useAppSelector((state) => state.users.status);

  useEffect(() => {
    if (!deferredPageNumber) return;
    const parsedPageNumber = parseInt(deferredPageNumber);
    if (isNaN(parsedPageNumber)) {
      return;
    }
    dispatch(fetchUsers(parsedPageNumber));
  }, [deferredPageNumber]);

  function logPerf(...args: any[]) {
    console.log(args);
  }

  return (
    <div className="App">
      It will display list of all users
      <br />
      <input
        value={pageNumber}
        onChange={(evt) => setPageNumber(evt.target.value)}
      />
      <br />
      Status : {status}
      <br />
      {users && users.length > 0 && (
        <Profiler id="userslist" onRender={logPerf}>
          <section className="users">
            {users.map((user) => (
              <div>
                <h1>{user.first_name}</h1>
                <h2>{user.last_name}</h2>
              </div>
            ))}
          </section>
        </Profiler>
      )}
    </div>
  );
}

export default App;
