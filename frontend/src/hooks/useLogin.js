import { useState } from "react";
import { useUserContext } from "./useUserContext";
export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useUserContext();
  const login = async (Email, password) => {
    setIsLoading(true);
    setError(null);
    let cred = JSON.stringify({ email: Email, password: password });
    const response = await fetch(`/users/login`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: cred,
    }).then(async (res) => {
        const json = res
        console.log(json);
        // save the user to local storage
        if (!json.error && json.user !== "user is not found") {
          localStorage.setItem("user", JSON.stringify(json));
          // update the auth context
          dispatch({ type: "LOGIN", payload: json });
          // update loading state
        } else {
          setError("Email or Password is incorrect.");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        console.log("No internet Connection");
      });
  };

  return { login, isLoading, error };
};
