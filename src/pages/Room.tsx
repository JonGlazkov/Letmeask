import { FormEvent, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
import "../styles/room.scss"

import Header from '../components/Header';
import GlobalStyle from '../styles/global';


type RoomParams = {
  id: string,
}

export function Room () {
  const { user } = useAuth();
  const params = useParams<RoomParams>(); // <RoomParams> é chamado de generic, um parâmentro porem utilizado para typagem.
  const [newQuestion, setNewQuestion] = useState('');
  const roomId = params.id!;
  
  const { title, questions} = useRoom(roomId);

  async function handleSendQuestion( event: FormEvent) {
    event.preventDefault(); //Não recarregar a tela.

    if (newQuestion.trim() === '') {
      return;
    }
    if (!user) {
      throw toast.error('You must be logged in') // Error enviado ao usuário caso não esteja logado. react-hot-toast lib
    }

    const question = { // question armazenará todos os dados de quem fez a pergunta em newQuestion.
      content: newQuestion, //pergunta feita
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false, 
      isAnswer: false,
      // Essas duas informações vão determinar se a pergunta ja foi destacada pelo Admin ou respondida.
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion('')
  }

  // Funcionalidade do Like
  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
    if (likeId) {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove() //Remover like se ja tiver dado o like
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id,
        // A ? esta sendo somente pois na variavel user ele recebe o paramentro User || undefined, mas a verificação e autenticação ja foi feita.
      })
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask"/>
          <RoomCode code={roomId} />
        </div>
        <div className="App">
          <GlobalStyle/>
        </div>
      </header>
      <div>
        <Toaster
        position='top-center'
        reverseOrder={false}
        />
      </div>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
          placeholder='O que você quer perguntar?'
          onChange={event => setNewQuestion(event.target.value)}
          value={newQuestion}
          />
          <div className="form-footer">
            { user ? (
              <div className ="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
            )}
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div> 
        </form>

        <div className="question-list">
          {questions.map(question =>{
            // O .map funciona da mesma forma que um forEach, percorrendo todos os elementos em um array(questions), porém, no .map ele permite retornar um resultado do array
            return (
              <Question
                key={question.id} //Algorítimo de Reconciliação
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              > 
                {!question.isAnswered && (
                  <button
                  className= {`like-button ${question.likeId ? 'liked' : '' }`}
                  type="button"
                  aria-label="Marcar como gostei"
                  onClick= {() => handleLikeQuestion(question.id, question.likeId)} //No react não se pode chamar uma função sendo executada no onClick, devemos passar uma arrow function caso seja para executar uma função após o click.
                  >
                    { question.likeCount > 0 &&<span>{question.likeCount}</span> }
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>    
                  </button>
                )}
              </Question>
            );
          })} 
        </div>  
      </main>
    </div>
  );
}