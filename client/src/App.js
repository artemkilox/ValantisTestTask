import {md5} from "js-md5";
// import request from 'request'
import axios from "axios";

function App() {
    const date = new Date()
    const timestamp = date.getUTCFullYear() +
      (date.getUTCMonth() > 9 ? date.getUTCMonth() : "0" + date.getUTCMonth()) +
      (date.getUTCDate() > 9 ? date.getUTCDate() : "0" + date.getUTCDate())
    // const timestamp = date.getFullYear() +
    //     (date.getMonth() > 9 ? date.getMonth() : "0" + date.getMonth()) +
    //     (date.getDate() > 9 ? date.getDate() : "0" + date.getDate())
    const pass = 'valantis'
    const auth = md5(pass + "_" + timestamp)

    console.log(auth)
    // console.log(md5(auth))

    // const data = {"action": "get_ids",
    //         "params": {"offset": 0, "limit": 10}}

    // request.post(url:)

    try {
        const {data} = axios.post('http://api.valantis.store:40000/',
            {
                    "action": "get_ids",
                    "params": {"offset": 0, "limit": 10}
            }, {
                headers : {
                    // "x-auth-token" : auth,
                    // 'X-Auth-User' : 'admin',
                    'X-Auth' : auth,
                    // "Content-type": "application/json; charset=UTF-8"
                }
            })
            // .then(
            // response => {
            //     console.log(response)
                // response.json().then(result => {
                //     console.log(result)
                //     // setFilesOnDisk(result._embedded.items)
                // })
            // }
        // )
        // fetch('http://api.valantis.store:40000/',{
        //     method: "POST",
        //     headers : {
        //         // "x-auth-token" : auth,
        //         // 'X-Auth-User' : 'admin',
        //         'X-Auth' : auth,
        //         "Content-type": "application/json; charset=UTF-8"
        //     },
        //         // body: JSON.stringify(data),
        //     body: JSON.stringify({
        //         "action": "get_ids",
        //         "params": {"offset": 0, "limit": 10}
        //     }),
        // }
        // ).then(
        //     response => {
        //         response.json().then(result => {
        //             console.log(result)
        //             // setFilesOnDisk(result._embedded.items)
        //         })
        //     }
        // )
    } catch (e) {
        if(e.response.message)
            console.log(e.response.message)
    }



    // console.log(response)

    return (
    <div className="App">

    </div>
    );
}

export default App;
