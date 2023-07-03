
import { useParams, Link, useNavigate } from "react-router-dom"
import { UserAuth } from "../../firebase/user_auth";
import { useEffect, useRef, useState } from "react";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import '../../App.scss'
import { GeneralPositiveAlert } from "../../components/Alert";
import warning from '../../img/warning.svg'

const DeleteList = ({click, user, query, showModal}) => {
    const [alert, setAlert] = useState(false)
    const nav = useNavigate()
    const modal = useRef()

    if(showModal) {
        modal.current?.removeAttribute('open')
        modal.current?.showModal()
    } else {
        modal.current?.close()
    }

    const delList = () => {
        deleteDoc(query).then(() => {
                //Alert 
                setAlert(true)
                //Then, navigate user 
                setTimeout(() => {
                nav(`../profile/${user.displayName}/lists`, {replace: true}) 
                }, 1000)
            }) 
    }
    return(
    <dialog className="confirm-modal" ref={modal}>
        <div>
            <img src={warning}/>
          <h2>Are you sure?</h2>
          <p>You will not be able to access this list anymore. </p>
          <button onClick={() => click(false)} className="close-btn">Cancel</button>
          <button onClick={() => delList()} className="save-btn">Delete it!</button>
          {alert && <GeneralPositiveAlert text='List deleted successfully! You will be navigated shortly.'/>}  
        </div>
        
    </dialog>)
}
const DisplayList = ({data, loading}) => {
    if(data === undefined) {
        return undefined
    }
    if(!loading) {
      return(
        <>
        {Object.entries(data).map((key) => {
            return(
                <Link className='indv-pic-cont' to={`../games/${key}`} target="_blank">
                    <div id={key}>
                       <img src={key[1].url.replace('t_thumb','t_cover_small')} className='img-test' alt="game-cover"/>
                        <p>{key[1].name}</p> 
                        <div className='img-overlay'></div>
                    </div>
                </Link>
            )
        })}
        
        </>
    )  
    }
    
}
const ListTemplate = () => {
    const { list_name } = useParams()
    const { user } = UserAuth()
    const [gameList, setgameList] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleteList, setdeleteList] = useState(false)
    const query = doc(db, `users/${user.uid}/lists/${list_name}`)
    
    useEffect(() => {
        getDoc(query).then((snapshot) => {
               setgameList(snapshot.data())
              setLoading(false) 
        }).catch((e) => console.log(e))
    }, [])

    return (
        <section className="list-template-cont">
          <h1 className='sub-page-title'><Link to={`../profile/${user.displayName}/lists`} className="list-link">Lists</Link> / <Link className="list-link">{`${gameList.name}`}</Link> </h1> 
          <button className="action-btn" onClick={()=>setdeleteList(true)}>Delete List</button>
          <section className="sub-list-sect">
            <DisplayList data={gameList.games} loading={loading}/>
          </section>
          
       <DeleteList click={setdeleteList} user={user} query={query} showModal={deleteList}/>
        </section>
    )
}

export default ListTemplate