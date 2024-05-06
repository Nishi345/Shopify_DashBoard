import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthenticatedFetch } from "../hooks";

export function TopBar() {
  const [data, setData] = useState("");
  let fetch = useAuthenticatedFetch();

  useEffect(() => {
    console.log("&&&&&&&&&&&");
    getData();
  }, []);

  const getData = async () => {
    try {
      let request = await fetch("/api/store/info", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      let response = await request.json();
      setData(response.data[0].name);

      console.log(request, "****************");
    } catch (error) {
      console.log(error, "##################");
    }
  };

  // const fetch = useAuthenticatedFetch(); // Assuming you have a custom hook for authenticated fetch

  // useEffect(() => {
  //   getData();
  // }, []);

  // const getData = async () => {
  //   try {
  //     let request = await fetch("/api/store/info", {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     if (request.ok) {
  //       let response = await request.json();
  //       console.log(response, "Response Data", "*******");
  //     } else {
  //       console.error("Request failed:", request.status);
  //     }
  //     setStoreName(response.data[0].name);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
  return (
    <div className="topbar-section">
      <div className="logo-block">
        <img className="logo" src="../assets/logo.png" alt="logo image" />
        <h1 className="text-bold h4">{data}</h1>
        <NavLink to="/"> Sales </NavLink>
        <NavLink to="/products"> Products </NavLink>
      </div>
    </div>
  );
}
