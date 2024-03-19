import { createContext, useState } from "react";
import runChat from "../config/Gemini";


export const Context = createContext ();

const ContextProvider = (props) =>{
    
    const[input , SetInput] = useState("");
    const[recentprompt , SetrecentPrompt] = useState("");
    const[prevPrompts , SetPrevPrompts] = useState([]);
    const[showResult , SetShowResult] = useState(false);
    const[loading , SetLoading] = useState(false);
    const[resultData , SetResultData] = useState("");

    const delayPara = (index , nextword)=>{
        setTimeout (function (){
            SetResultData(prev=>prev+nextword);
        },75*index)
    }
    const onSent = async (prompt) => {
        SetResultData("")
        SetLoading(true)
        SetShowResult(true)
        let response ;
        if (prompt !== undefined) {
            response = await runChat(prompt)
            SetrecentPrompt(prompt)
        }
      else{
        SetPrevPrompts(prev=>[...prev,input])
        SetrecentPrompt(input)
        response = await runChat(input)
      }
        let responseArray = response.split("**");
        let newResponse ;
        for(let i =0 ; i< responseArray.length; i++){
            if(i===0 || i%2 !==1){
                newResponse += responseArray[i];
            }
            else{
                newResponse += "<b>"+responseArray[i]+"</b>"
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>");
      let newResponseArray = newResponse2.split(" ");
      for(let i =0; i<newResponseArray.length;i++)
        {
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord+" ")
        }
      SetLoading(false)
      SetInput("")
    }

 


    const contextValue = {
            prevPrompts,
            SetPrevPrompts,
            onSent,
            SetrecentPrompt,
            recentprompt,
            showResult,
            loading,
            resultData,
            input,
            SetInput
    } 

    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider