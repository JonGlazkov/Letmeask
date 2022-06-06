import { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
//import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import "../styles/room.scss"
import { database } from '../services/firebase';


type RoomParams = {
  id: string,
}

export function AdminRoom () {
  //const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams<RoomParams>(); // <RoomParams> é chamado de generic, um parâmentro porem utilizado para typagem.
  const roomId = params.id!;
  
  const { title, questions} = useRoom(roomId);

  console.log(questions)

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      closedAt: new Date(),
    })

    navigate('/')
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();

    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }


  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
          </div>
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

        <div className="question-list">
          {questions.map(question =>{
            {/* O .map funciona da mesma forma que um forEach, percorrendo todos os elementos em um array(questions), porém, no .map ele permite retornar um resultado do array*/}
            return (
              <Question
                key={question.id} //Algorítimo de Reconciliação
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  //Por padrão o React reclama caso tenha 2 elementos ou mais e não esteja dentro de um conteiner(<div>).
                  //Porém, ao colocar uma <div> o mesmo irá ser lido pelo HTML e irá prejudicar no CSS, então no React existe uma coisa chamada Fragment ele é um conteiner, porém, ele não vai pro HTML como uma tag tendo estilização.
                  <>   {/*<-- (<> </>) é um Fragment */}
                    <button
                    type="button"
                    onClick= {() => handleCheckQuestionAsAnswered(question.id)}
                    >
                    <img src={checkImg} alt="Marcar pergunta como respondida" />
                    </button>
                    <button
                      type="button"
                      onClick= {() => handleHighlightQuestion(question.id)}
                      >
                      <img src={answerImg} alt="Dar destaque a pergunta" />
                    </button>
                  </>
                )}
                <button
                 type="button"
                 onClick= {() => handleDeleteQuestion(question.id)}
                 >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>

            );
          })}
        </div>  
      </main>
    </div>
  );
}