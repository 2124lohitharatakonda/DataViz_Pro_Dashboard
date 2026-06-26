import { useState } from 'react'
import FileUpload from './components/FileUpload'
import Dashboard from './components/Dashboard'

export default function App() {
  const [data, setData] = useState(null)
  const [fileName, setFileName] = useState('')

  const handleData = (parsedData, name) => {
    setData(parsedData)
    setFileName(name)
  }

  if (data) {
    return <Dashboard data={data} fileName={fileName} onReset={() => { setData(null); setFileName('') }} />
  }

  return <FileUpload onData={handleData} />
}
