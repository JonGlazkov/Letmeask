import { ReactNode } from 'react'
import cx from 'classnames'

import './styles.scss';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
}

export function Question({
  content, 
  author,
  isAnswered = false,
  isHighlighted = false, // Por padrão atribuiremos o valor falso, se não forem informadas iremos entender que ela não foi respondia ou dado destaque.
  children,
}: QuestionProps) {
  return (
    <div 
      className= {cx(
        'question',
          { answered: isAnswered }, // Pela documentação do classnames, simplificamos o código ao invés de usar if ternarios dentro do className.
          { highlighted: isHighlighted && !isAnswered },
          // Pelo import do classnames, podemos colocar uma classe('question') e também objetos. Atribuimos a key(classe) e seu valor onde ela retornará boolean,sendo verdadeiro, irá criar uma classe com o nome colocado (ex: answered, highLighted).
        )}>
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name}/>
          <span>{author.name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  );
}