import { useState } from 'react'
import '../../App.css'

function Home() {
  const [count, setCount] = useState(0)
  const [fetchedData, setFetchedData] = useState("");

  const fetchData = async (e) =>{
    e.preventDefault();
    //console.log(e);
    const result = await fetch("https://dog.ceo/api/breeds/image/random");
    const jsonResponse = await result.json();
    //setFetchedData(jsonResponse.toString());
    setFetchedData(jsonResponse.message);
  }

  return (
    <>
      
      <h1>Richard&apos;s Web Development Portfolio</h1>
      <div>
        <a href="https://www.linkedin.com/in/richardrisner/" target="_blank" rel="noreferrer">
          Find me on LinkedIn
        </a>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={(e)=> fetchData(e)}>
          Fetch some data
        </button>
        {
          fetchedData.length > 0 && 
            <div>
              <h3>Check out this dog:</h3>
              <img className='fun-random-image' src={fetchedData}></img>
            </div>  
        }
        
      </div>
      <p className="fun-class">
        This is just a learning project! It&apos;s okay to take baby steps!
      </p>
    </>
  )
}

export default Home;
