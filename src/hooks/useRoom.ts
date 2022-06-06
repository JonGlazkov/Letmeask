import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type FirebaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string,
  }
  content: string,
  isAnswered: boolean,
  isHighlighted: boolean,
  likes: Record<string,  {
    authorId: string,
  }>
}>

type QuestionType = {
  id: string,
  author: {
    name: string,
    avatar: string,
  }
  content: string,
  isAnswered: boolean,
  isHighlighted: boolean,
  likeCount: number,
  likeId: string | undefined ;
}


export function useRoom (roomId: string) {
  const { user } = useAuth();
   const [questions, setQuestions] = useState<QuestionType[]>([])
   const [title, setTitle] = useState('');

    useEffect(() => {
      const roomRef = database.ref(`rooms/${roomId}`);
     
      roomRef.on('value', room => { 
        //Event listner sendo passado para o firebase da forma que o firebase utiliza.
        //Se quer monitorar somente uma vez utiliza .once, se for mais de uma utiliza .on 
        const databaseRoom = room.val();
        const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
  
        const parsedQuestion = Object.entries(firebaseQuestions).map (([ key, value]) => {
         return {
           id: key,
           content: value.content,
           author: value.author,
           isHighlighted: value.isHighlighted,
           isAnswered: value.isAnswered,
           likeCount: Object.values(value.likes ?? {}).length,
           likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
           // ?. no final informa que se ele não retornar nada da procura ele irá atribuir o valor nulo. Se achar, ele irá pegar o primeiro valor do array(like).
           //.some ele percorre o array até encontrar um valor que satisfaça as condições, retornando um valor boolean = true or false
         } //key = primeira parte do array, value = segunda parte.
        }) // Irá retornar um array com arrays dentro tendo seus resultados.
        setTitle(databaseRoom.title)
        setQuestions(parsedQuestion)
      })
      return () => {
        roomRef.off('value'); // Fazendo o event listner parar.
      }
      
    }, [roomId, user?.id]); 
    //useEffect é uma função/hook que dispara um evento sempre que uma informação mudar. o Array são os parâmetros que se quer monitorar para executar a função ao mudar. Se for passado nenhum valor dentro do Array, ele será executado apenas uma vez assim que o componente for exibido em tela.

    return { questions, title}
}