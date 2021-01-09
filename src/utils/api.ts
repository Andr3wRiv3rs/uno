import Axios, {
  AxiosError,
  AxiosResponse,
  AxiosInstance,
} from 'axios'

export let api: AxiosInstance

if (typeof window !== 'undefined') {
  api = Axios.create({
    baseURL: `${window.location.origin}/api`,
    withCredentials: true,
  })

  api.interceptors.response.use((response: AxiosResponse) => {
    return response
  }, (error: AxiosError<string>) => {
    console.error(
      `${error.response.status}: ${error.response.data || error.response.statusText} (${error.config.method.toUpperCase()} ${error.request.responseURL})`, 
      '\n\nBODY', error.config.data,
      '\n\nHEADERS', error.config.headers,
      '\n\nRESPONSE', error.response.data,
    )
  
    throw error
  })
}
