import { useState } from "react";
import { css } from "@emotion/react";
import PacmanLoader from "react-spinners/MoonLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function Loader() {
    let [loading, setLoading] = useState(true);
    let [color, setColor] = useState("#808080");

    return (
        <div style={{ display: "flex", justifyContent: "center", height: "100vh", alignItems: "center" }}>
            <PacmanLoader color={color} size={50} loading={loading} />
        </div>
    );
}

export default Loader;