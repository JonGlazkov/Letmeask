import { BrowserRouter, Routes, Route } from "react-router-dom";
import usePersistedState from './hooks/usePersistedState'

import { Home }  from "./pages/Home";
import { NewRoom }  from "./pages/NewRoom";
import { Room } from "./pages/Room";
import { AdminRoom } from "./pages/AdminRoom";


import { AuthContextProvider } from './contexts/AuthContext'

import light from "./styles/themes/light";
import dark from "./styles/themes/dark";
import Header from "./components/Header";
import GlobalStyle from './styles/global';
import { ThemeProvider } from "styled-components";



function App()  {
  const [theme, setTheme] = usePersistedState('theme', light);
  const toggleTheme = () => {
    setTheme(theme.title === 'light' ? dark : light);
  }
  return ( 
    <BrowserRouter> 
      <ThemeProvider theme={ theme }>
        <div className="App">
          <Header toggleTheme ={ toggleTheme } />
          <GlobalStyle/>
        </div>
      <AuthContextProvider>
        <Routes>  
          <Route path="/*"  element= {<Home/>}/>
          <Route path="/rooms/new/*" element ={<NewRoom/>}/>
          <Route path="/rooms/:id" element ={<Room/>}/>
          <Route path ="/admin/rooms/:id" element ={<AdminRoom/>}/> 
        </Routes>
      </AuthContextProvider>
      </ThemeProvider>
    </BrowserRouter>  
    
    );
  }

export default App;
