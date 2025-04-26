import { useEffect, useState } from "react";

function Home() {
  const [isWorking, setIsWorking] = useState(true);

  useEffect(() => {
    const onClick = () => setIsWorking(!isWorking);
    document.addEventListener("click", onClick);

    return () => document.removeEventListener("click", onClick);
  }, [isWorking]);
  return (
    <div>
      <h1>its working? {isWorking ? "yes baby" : "no"}</h1>
    </div>
  );
}

export default Home;
