//Não tem como usar um componente sem a inicial Maíuscula, se não, será confundido com uma tag HTML.

//Sempre que for utilizar algum arquivo em react ele nao reconhece o caminho "../assets/images/illustration"". Deve se utilizar o metodo import.
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom'

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import toast, { Toaster } from 'react-hot-toast';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button'
import '../styles/auth.scss';

export function Home() {
  const navigate = useNavigate();
  const { user , signInWithGoogle } = useAuth();
  const [ roomCode, setRoomCode ] = useState(''); // '' está como parâmentro para indicar que é uma string

  

  //Processo de Login
  async function handleCreateRoom() {
    if (!user) {
     await signInWithGoogle()
    }
    //Só irá acontecer o redirecionamento se o await receber uma resposta positiva.
    navigate('/rooms/new');
  }
  

  async function handleJoinRoom(event : FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === '') {
      toast.error('You must enter a room code.')
      return; 
      // Usar o return para nao executar nada caso esteja vazio.
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get(); // Não será passado 'rooms' pois não queremos que a verificação seja em todas as salas existente, mas sim, se a sala que ele está tentando acessar existe.Buscando o id da sala.  

    //O metodo .get() ira retornar todos os dados da sala como nome e id.

    if (!roomRef.exists()) {
      toast.error ('Room does not exists.');
      setRoomCode('')
      return;
    } else if (roomRef.val().closedAt) {
      toast.error ('Room already closed.');
      setRoomCode('')
      return;
    } else {
      toast.success('Entering room...')
    }

    
    navigate(`/rooms/${roomCode}`)
  }

  return(
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div>
          <Toaster
          position='top-center'
          reverseOrder={false}
          />
        </div>  
        
        <div className='main-content'>
          <img src={logoImg} alt="Letmeask" />
          <button onClick={handleCreateRoom} className='create-room'>
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className='separator'> Ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input 
              type="text"
              placeholder="Digite o código da sala" 
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}