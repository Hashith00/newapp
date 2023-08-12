
import "./index.css"

import { useState, useEffect } from "react"

function App() {
  const [massage , setMassage] = useState(null)
  const [value , setValue] = useState(null)
  const [perviousChat,setPerviousChat] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)
  
  const createNewChat = () => {
    setMassage(null)
    setValue('')
    setCurrentTitle(null)
  }

  const getMessages = async () => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        massage: value
      }),
      headers: {
        "Content-Type" : "application/json"
      }
    }
    try{
      const responce = await fetch('http://localhost:8000/completion', options)
      const data = await responce.json()
      
      console.log(data)
      setMassage(data.choices[0].message)
    }catch(error){
        console.error(error)
    }
  }

  console.log(massage)

useEffect(() => {
  console.log(currentTitle, value, massage)
  if(!currentTitle && value && massage){
    setCurrentTitle(value)
  }
  if(currentTitle && value && massage){
    setPerviousChat(perviousChat =>(
      [...perviousChat , {
        title: currentTitle,
        role:'user',
        content:value
      }, {
        title: currentTitle,
        role: massage.role,
        content: massage.content
      }]
    ))
  }

},[massage], [currentTitle])

const currentChat = perviousChat.filter(perviousChat => perviousChat.title === currentTitle)
const uniqueTitles = Array.from(new Set(perviousChat.map(perviousChat => perviousChat.title)))

const handleClick = (uniqueTitle) =>{
  setCurrentTitle(uniqueTitle)
  setMassage(null)
  setValue("")
}



  return (
    <div className="App">
      <section className="side-bar">
        <button onClick={createNewChat}> + New Chat</button>
        <ul className="hsitory">
          {uniqueTitles?.map((uniqueTitle, index) => <li onClick={() => handleClick(uniqueTitle)} key={index}>{uniqueTitle}</li>)}
        </ul>
        <nav>Made by Hashith</nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>ChatGPT</h1>}
        <ul className="feed">
        {currentChat?.map((chatMassage , index) => <li key={index}>
            <p className="role">{chatMassage.role}</p>
            <p className="chatMassage">{chatMassage.content}</p>
          </li>)}

        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)}/>
            <div id="submit" onClick={getMessages}>+</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
