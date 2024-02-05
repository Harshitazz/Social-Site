import React,{useEffect,useState} from "react";
import UserList from "../components/UserList";
import ErrorModal from "../../shared/componets/ui elements/ErrorModal";

import LoadingSpinner from "../../shared/componets/ui elements/LoadingSpinner";
import { useHttpClient } from "../../shared/componets/hooks/http-hook";
const Users=()=>{
    const{isLoading,isError,sendRequest,clearError}=useHttpClient();
    const [loadedUsers,setLoadedUsers]=useState();
    
    useEffect(()=>{
        const fetchusers=async()=>{
            try{
                const responseData = await sendRequest('http://localhost:5000/api/users')
                
                setLoadedUsers(responseData.users);
                console.log(responseData)
            }catch(err){}
        };
        fetchusers();
    },[sendRequest]);
    return (
        <React.Fragment>
            <ErrorModal onClear={clearError} error={isError}/>
            {isLoading && <div style={{margin:'auto',display:'flex', height:'80vh', alignItems:'center',justifyContent:'center'}}><LoadingSpinner  /></div>}

            {!isLoading&& loadedUsers && <UserList items={loadedUsers}/>}
        </React.Fragment>
    
    )
}
export default Users;