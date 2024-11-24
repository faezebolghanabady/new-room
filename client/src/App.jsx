import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Registration from './Registration';
import Login from './Login';
import Chat from './Chat';
import { EmailProvider } from './UserContext';


function App() {
  console.log('home')
  return (
    <EmailProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Registration />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </EmailProvider>
  );
}

export default App;


















// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';
// import Registration from './Registration';
// import Login from './Login';
// import Dashboard from './Dashboard';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Home from './Home';
// import Chat from './Chat';
// import { EmailProvider } from './UserContext';




// function App() {
//   return (
//     <EmailProvider> 
//     <BrowserRouter>
//       <Routes>
//        <Route path="/register" element={<Registration />} />
//           <Route path="/login" element={<Login />} />
//          <Route path="/" element={<Registration />} />
//          <Route path="/chat" element={<Chat/>} />
//         <Route path="/dashboard" element={<Dashboard />} />
//        </Routes>
//     </BrowserRouter>
//     </EmailProvider>
//   );
// }

// export default App;