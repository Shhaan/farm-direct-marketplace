import axios from "axios" 
import { Api_base } from "./Constants"

const instance = axios.create({
    baseURL:Api_base

})
export default instance

 