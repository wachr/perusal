import "./style";
import baseroute from "./baseroute";

export default function App() {
  return (
    <div>
      <h1>Hello, World!</h1>
      <img src={`${baseroute}/assets/icon.svg`} />
    </div>
  );
}
