/** Extensões
 * -- axios --
 * yarn add axios
 */
import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3333/'
})
