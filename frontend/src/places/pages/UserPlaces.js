import React ,{useEffect ,useState}from 'react';
import { useParams } from "react-router-dom";
import PlaceList from '../components/PlaceList';
import { useHttpClient } from '../../shared/componets/hooks/http-hook';
import ErrorModal from '../../shared/componets/ui elements/ErrorModal';
import LoadingSpinner from '../../shared/componets/ui elements/LoadingSpinner';

const UserPlaces = () => {
  const {isLoading,isError,sendRequest,clearError}=useHttpClient()
    const userId=useParams().userId;
  const[loadedplaces,setloadedplaces]=useState();
const deleteplacehandler= deleteplaceid=>{
  setloadedplaces(prevplaces=>prevplaces.filter(place=>place.id!==deleteplaceid))
}
    useEffect(()=>{
      const fetchplaces=async()=>{
        try{
          const responseData= await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`)
          setloadedplaces(responseData.places)
        }catch(err){}
      }
      fetchplaces();
    },[sendRequest,userId])
  return (
    <React.Fragment>
      <ErrorModal error={isError} onClear={clearError}/>
      {isLoading && <LoadingSpinner/>}
      {!isLoading && loadedplaces && <div style={{position:'relative'}}>
    <PlaceList items={loadedplaces} onDeletePlace={deleteplacehandler} />
    </div>}
    </React.Fragment>
    )
};

export default UserPlaces;