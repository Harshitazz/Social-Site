import { useState ,useCallback,useRef ,useEffect} from "react";

export const useHttpClient=()=>{
    const [isLoading, setisLoading] = useState(false);
    const [isError, setError] = useState();
    const activeHttpRequests= useRef([]);

    const sendRequest= useCallback(
        async(url,method='GET',body=null,headers={})=>{
        setisLoading(true);
        const httpAbortCtrl= new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);

        try{
            const response =await fetch(url,{
                method,
                body,
                headers,
                signal: httpAbortCtrl.signal
            });
    
            const responseData =await response.json();
            
            
            if(!response.ok){
              throw new Error(responseData.message);
            }
            setisLoading(false);

            return responseData;
        }
        catch(err){
            setError(err.message);
            setisLoading(false);

            throw err;
        }
    },[]);

    const clearError=()=>{
        setError(null);
    }
   
    return {isLoading,isError,sendRequest,clearError}
}