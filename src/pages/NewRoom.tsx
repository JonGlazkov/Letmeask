//Não tem como usar um componente sem a inicial Maíuscula, se não, será confundido com uma tag HTML.

//Sempre que for utilizar algum arquivo em react ele nao reconhece o caminho "../assets/images/illustration"". Deve se utilizar o metodo import.

import { Link, useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button'
import '../styles/auth.scss'
import { database } from '../services/firebase';



export function NewRoom() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ newRoom, setNewRoom ] = useState('');

  async function handleCreateRoom(event: FormEvent) { //Foi precisado typar pois está sendo passado o evento de fora da tag <form>.
    event.preventDefault() // Vai prevenir de recarregar a tela ao clicar pra criar a sala.

    if(newRoom.trim() === '') { // .trim() utilizado para tirar os espaços dos lados caso tenha usado no input.
      return;
    }
    // Referencia no registro do banco de dados.
    const roomRef = database.ref('rooms'); // Dentro do banco de dados terá uma separação ou uma categoria chamada 'rooms', podendo incluir dados interativos.

    const firebaseRoom = await roomRef.push({
      title: newRoom, //nome da sala
      authorId: user?.id, // nome ou id do usuário que criou a sala.
    }); // Está procurando dentro do banco de dados uma referência chamada 'rooms' e dentro dela está dando um push da informação ou seja, uma sala nova.
    navigate(`/admin/rooms/${firebaseRoom.key}`) // O usuário será redirecionado para a sala criada através do id fornecido pelo authorId presente no banco de dados.
  };
 
  return(
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className='main-content'>
          <img src={logoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input 
              type="text"
              placeholder="Nome da sala" 
              onChange={event => setNewRoom(event.target.value)}
               //Não é necessário typar pois está sendo passado o evento dentro da definição.
              value={newRoom}
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>
            Quer entrar em uma sala existente? 
            <Link to="/"> clique aqui </Link>
          </p>
        </div>
      </main>
    </div>
  );
}