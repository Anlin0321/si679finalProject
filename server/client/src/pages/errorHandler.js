
import { Link, useLocation, useRouteError } from "react-router-dom";

function ErrorBoundary() {

  let errorMessage = '';
  const error = useRouteError();
  const location = useLocation();

  if (error) {
    errorMessage = error.data;
  } else {
    errorMessage = location.state?.errorMessage;
  }
  
  console.log(error);
  return (
    <div>
      <h1>Uh oh! There was an error!</h1>
      <div>Details:</div>
      <div>{errorMessage}</div>
      You can <Link to='/'>go back home</Link> and try again.
    </div>
  )
}

export default ErrorBoundary;